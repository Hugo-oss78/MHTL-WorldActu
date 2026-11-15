import type { AiSummary, NewsCluster } from '../src/lib/types';

/**
 * Résumés par IA — FACULTATIF et désactivé par défaut.
 * Activation : variable ATLAS_AI=github-models dans le workflow (utilise le jeton GITHUB_TOKEN
 * fourni par GitHub Actions avec la permission `models: read`, sans coût ni carte bancaire,
 * dans la limite des quotas gratuits de GitHub Models).
 * L'IA ne reçoit que les extraits des sources et doit s'y limiter. Toute erreur est ignorée :
 * le briefing fonctionne sans IA.
 */
const ENDPOINT = process.env.ATLAS_AI_ENDPOINT ?? 'https://models.github.ai/inference/chat/completions';
const MODEL = process.env.ATLAS_AI_MODEL ?? 'openai/gpt-4o-mini';

const SYSTEM = `Tu es un assistant de veille géopolitique. Tu écris en français, de façon sobre et précise.
Règles absolues :
- Utilise UNIQUEMENT les informations présentes dans les extraits fournis. N'ajoute aucun fait, chiffre, date, nom ou citation absent des extraits.
- Distingue les faits rapportés des déclarations ("selon X", "X affirme").
- Si les extraits ne permettent pas de répondre, écris "Informations insuffisantes dans les sources".
- Les conséquences sont des hypothèses : formule-les au conditionnel.
Réponds uniquement en JSON : {"resume": "...", "pourquoi": "...", "consequences": ["...", "..."]}`;

export async function aiSummaries(clusters: NewsCluster[]): Promise<Map<string, AiSummary>> {
  const out = new Map<string, AiSummary>();
  if (process.env.ATLAS_AI !== 'github-models' || !process.env.GITHUB_TOKEN) return out;
  for (const c of clusters) {
    const extracts = c.sources
      .slice(0, 6)
      .map((s, i) => `[${i + 1}] ${s.sourceName} (${s.publishedAt ?? 'date inconnue'}) — ${s.title}. ${s.summary}`)
      .join('\n');
    try {
      const res = await fetch(ENDPOINT, {
        method: 'POST',
        headers: { Authorization: `Bearer ${process.env.GITHUB_TOKEN}`, 'Content-Type': 'application/json' },
        body: JSON.stringify({
          model: MODEL,
          temperature: 0.2,
          max_tokens: 500,
          response_format: { type: 'json_object' },
          messages: [
            { role: 'system', content: SYSTEM },
            { role: 'user', content: `Extraits :\n${extracts}\n\nRédige : un résumé (3 phrases max), pourquoi c'est important (2 phrases max), 2 conséquences possibles.` },
          ],
        }),
      });
      if (!res.ok) {
        console.warn(`IA indisponible (${res.status}) : arrêt des résumés IA pour cette exécution.`);
        break;
      }
      const json = (await res.json()) as { choices?: { message?: { content?: string } }[] };
      const parsed = JSON.parse(json.choices?.[0]?.message?.content ?? '{}') as Partial<AiSummary>;
      if (typeof parsed.resume === 'string' && typeof parsed.pourquoi === 'string' && Array.isArray(parsed.consequences)) {
        out.set(c.id, {
          model: MODEL,
          generatedAt: new Date().toISOString(),
          resume: parsed.resume.slice(0, 800),
          pourquoi: parsed.pourquoi.slice(0, 500),
          consequences: parsed.consequences.filter((x): x is string => typeof x === 'string').slice(0, 3).map((x) => x.slice(0, 300)),
        });
      }
    } catch (e) {
      console.warn('Résumé IA ignoré :', (e as Error).message);
    }
  }
  return out;
}
