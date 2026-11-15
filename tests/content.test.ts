import { describe, expect, it } from 'vitest';
import { readFileSync } from 'node:fs';
import { parseFeed } from '../pipeline/rss';
import { FEEDS } from '../pipeline/sources';
import { QUESTION_BANK } from '../src/content/quiz';
import { DOSSIERS } from '../src/content/dossiers';
import { HISTORY } from '../src/content/history';
import { dailyQuiz, historyOfDay } from '../src/lib/daily';
import { computeLevel } from '../src/lib/levels';
import { DEFAULT_STATE } from '../src/lib/store';
import { searchKnowledge } from '../src/lib/search';

const src = FEEDS[0];
const feed = (id: string) => readFileSync(`tests/fixtures/feeds/${id}.xml`, 'utf8');

describe('lecture des flux', () => {
  it('lit RSS, Atom et RDF', () => {
    expect(parseFeed(feed('bbc-world'), src).length).toBe(8);
    const atom = parseFeed(feed('theconversation-fr'), src);
    expect(atom[0].url).toMatch(/^https:/);
    expect(atom[0].publishedAt).not.toBeNull();
    expect(parseFeed(feed('dw-en'), src)[0].title).toContain('Germany');
  });
});

describe('contenus', () => {
  it('les questions sont bien formées', () => {
    for (const q of QUESTION_BANK) {
      expect(q.answer, q.id).toBeGreaterThanOrEqual(0);
      expect(q.answer, q.id).toBeLessThan(q.options.length);
      expect(new Set(q.options).size, q.id).toBe(q.options.length);
    }
  });
  it('chaque dossier a ses 8 parties et des sources', () => {
    for (const d of DOSSIERS) {
      expect(Object.values(d.sections).every((v) => v.length > 0), d.id).toBe(true);
      expect(d.sources.length, d.id).toBeGreaterThan(0);
    }
  });
  it('chaque période historique a au moins une fiche', () => {
    expect(new Set(HISTORY.map((h) => h.period)).size).toBe(9);
  });
  it('quiz du jour : 5 questions stables pour une date', () => {
    const a = dailyQuiz('2026-11-16', null);
    expect(a).toHaveLength(5);
    expect(dailyQuiz('2026-11-16', null).map((q) => q.id)).toEqual(a.map((q) => q.id));
    expect(historyOfDay('2026-07-14').fiche.id).toBe('bastille-1789');
  });
  it('recherche dans la bibliothèque', () => {
    expect(searchKnowledge("détroit d'Ormuz pétrole")[0].link).toContain('iran-golfe-ormuz');
  });
  it('le niveau dépend des résultats, pas du volume de lecture', () => {
    expect(computeLevel({ ...DEFAULT_STATE, read: Object.fromEntries(Array.from({ length: 500 }, (_, i) => [String(i), { id: String(i), kind: 'article', title: '', url: '', at: '' }])) }).name).toBe('Débutant');
  });
});
