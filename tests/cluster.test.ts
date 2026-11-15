import { describe, expect, it } from 'vitest';
import { assessReliability, buildCluster, clusterItems, enrich } from '../pipeline/cluster';
import type { FeedSource } from '../pipeline/sources';
import { detectEntities } from '../src/lib/gazetteer';
import { detectStatement } from '../src/lib/classify';

// Données de test (fictives, inspirées de formats de titres réels) — utilisées uniquement par les tests.
const src = (id: string, group: string, lang: 'fr' | 'en', kind: FeedSource['kind'] = 'media'): FeedSource => ({ id, name: id, url: '', lang, group, kind });
const BBC = src('bbc', 'BBC', 'en');
const GUARD = src('guardian', 'Guardian', 'en');
const LM = src('lemonde', 'Le Monde', 'fr');
const F24 = src('france24', 'France Médias Monde', 'fr');
const RFI = src('rfi', 'France Médias Monde', 'fr');
const now = Date.parse('2026-11-15T16:00:00Z');
let n = 0;
const item = (source: FeedSource, title: string, summary = '', hoursAgo = 2) =>
  enrich({ source, title, summary, url: `https://ex.org/${n++}`, publishedAt: new Date(now - hoursAgo * 3600_000).toISOString() }, []);

describe('gazetteer', () => {
  it('détecte pays et organisations sans faux positifs sur « us »', () => {
    expect(detectEntities('Iran targets US military base in Bahrain').countries).toEqual(expect.arrayContaining(['IRN', 'USA']));
    expect(detectEntities('Tell us what you think about it').countries).toEqual([]);
    expect(detectEntities('Le sommet de l’OTAN à La Haye').orgs).toContain('otan');
  });
});

describe('nature des énoncés', () => {
  it('classe accusations, hypothèses, déclarations et faits', () => {
    expect(detectStatement('Moscou accuse Kiev d’avoir visé une centrale')).toBe('accusation');
    expect(detectStatement('Trade talks could collapse next week')).toBe('hypothese');
    expect(detectStatement('US has floated Ukraine ceding Donbas, Zelensky says')).toBe('declaration');
    expect(detectStatement('Three men sentenced to death in Jordan')).toBe('fait');
  });
});

describe('regroupement', () => {
  it('regroupe le même événement en français et en anglais, et sépare les sujets différents', () => {
    const items = [
      item(BBC, 'Iran targets US military base in Bahrain with drone attack', 'It marks the second attack in three days amid the Strait of Hormuz stand-off.'),
      item(GUARD, 'Iran launches drone attack on US base in Bahrain', 'Second drone attack on US forces in the Gulf this week.'),
      item(LM, 'L’Iran vise une base militaire américaine à Bahreïn par une attaque de drones', 'Deuxième attaque en trois jours, sur fond de bras de fer autour du détroit d’Ormuz.'),
      item(BBC, 'Israel kills Hamas commander in strike on Gaza camp', 'Both Hamas and IDF officials confirm the death of the commander.'),
      item(F24, 'Gaza : un commandant du Hamas tué dans une frappe israélienne', 'Le Hamas et l’armée israélienne ont confirmé la mort du commandant.'),
      item(LM, 'Budget 2027 : le Sénat adopte la première partie du texte', 'Les sénateurs ont voté la partie recettes du projet de loi de finances.'),
    ];
    const clusters = clusterItems(items);
    const sizes = clusters.map((c) => c.length).sort((a, b) => b - a);
    expect(sizes).toEqual([3, 2, 1]);
  });

  it('ne fusionne pas deux sujets différents concernant le même pays', () => {
    const items = [
      item(BBC, 'Russian drone strike hits Kharkiv apartment block', 'At least 5 killed in the overnight attack.'),
      item(BBC, 'Russia and Ukraine hold prisoner exchange talks in Istanbul', 'Delegations met for a new round.'),
    ];
    expect(clusterItems(items)).toHaveLength(2);
  });
});

describe('fiabilité', () => {
  it('ne compte pas deux médias du même groupe comme deux confirmations', () => {
    const items = [item(F24, 'Séisme au Japon : alerte au tsunami'), item(RFI, 'Japon : un séisme provoque une alerte au tsunami')];
    const r = assessReliability(items);
    expect(r.independentOrigins).toBe(1);
    expect(r.level).toBe('non_confirme');
  });

  it('compte les reprises d’une même agence pour une seule origine', () => {
    const items = [
      item(LM, 'Un accord commercial signé entre l’UE et l’Inde', 'Bruxelles et New Delhi ont signé l’accord (AFP).'),
      item(F24, 'L’UE et l’Inde signent un accord commercial', 'Selon l’AFP, la signature a eu lieu à Bruxelles.'),
      item(BBC, 'EU and India sign trade deal', 'The deal was signed in Brussels.'),
    ];
    const r = assessReliability(items);
    expect(r.origins.sort()).toEqual(['AFP', 'BBC']);
    expect(r.level).toBe('partiel');
  });

  it('confirme avec trois origines indépendantes et signale les bilans divergents', () => {
    const ok = assessReliability([item(LM, 'Sommet du G7'), item(BBC, 'G7 summit'), item(GUARD, 'G7 summit opens')]);
    expect(ok.level).toBe('confirme');
    const div = assessReliability([
      item(LM, 'Frappe sur un marché : 12 morts'),
      item(BBC, 'Market strike: 40 killed'),
    ]);
    expect(div.level).toBe('contradictoire');
  });

  it('construit un groupe daté avec titre français prioritaire', () => {
    const c = buildCluster([item(BBC, 'EU and India sign trade deal'), item(LM, 'L’UE et l’Inde signent un accord commercial')], now)!;
    expect(c.lang).toBe('fr');
    expect(c.places).toContain('IND');
  });
});
