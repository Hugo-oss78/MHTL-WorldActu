import type { AiConfig } from './store';

export interface AiContext {
  label: string;
  url?: string;
  text: string;
}

const SYSTEM = `Tu es l'assistant « Comprendre davantage » de l'application ATLAS.
- Réponds en français, simplement et précisément, en 150 à 300 mots sauf demande contraire.
- Sépare clairement « Faits établis » et « Analyses / hypothèses ».
- Appuie-toi en priorité sur les documents fournis et cite-les avec leur numéro [1], [2]…
- N'invente JAMAIS de source, de citation, de chiffre ou de date. Si tu n'es pas sûr, dis-le explicitement.
- Si la question porte sur des faits récents absents des documents, précise que tes connaissances peuvent être dépassées.
- Termine par « Pour aller plus loin » en ne citant que des documents fournis.`;

/**
 * Appel à un modèle compatible avec l'API OpenAI (OpenRouter, Groq, Mistral, Ollama local…).
 * La clé appartient à l'utilisateur, reste sur son appareil et n'est envoyée qu'au fournisseur choisi.
 */
export async function askAi(cfg: AiConfig, question: string, context: AiContext[], history: { role: 'user' | 'assistant'; content: string }[] = []): Promise<string> {
  if (!cfg.enabled || !cfg.endpoint || !cfg.model) throw new Error('Assistant IA non configuré.');
  const docs = context.map((c, i) => `[${i + 1}] ${c.label}${c.url ? ` (${c.url})` : ''}\n${c.text}`).join('\n\n');
  const headers: Record<string, string> = { 'Content-Type': 'application/json' };
  if (cfg.apiKey) headers.Authorization = `Bearer ${cfg.apiKey}`;
  const res = await fetch(cfg.endpoint, {
    method: 'POST',
    headers,
    body: JSON.stringify({
      model: cfg.model,
      temperature: 0.3,
      messages: [
        { role: 'system', content: SYSTEM },
        { role: 'user', content: `Documents disponibles :\n${docs || '(aucun)'}` },
        ...history,
        { role: 'user', content: question },
      ],
    }),
  });
  if (!res.ok) {
    const body = await res.text().catch(() => '');
    throw new Error(`Le fournisseur IA a répondu ${res.status}. ${body.slice(0, 200)}`);
  }
  const json = (await res.json()) as { choices?: { message?: { content?: string } }[] };
  const text = json.choices?.[0]?.message?.content?.trim();
  if (!text) throw new Error('Réponse vide du fournisseur IA.');
  return text;
}
