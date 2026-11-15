const TZ = 'Europe/Paris';

export function formatDateTime(iso: string | null | undefined): string {
  if (!iso) return 'date inconnue';
  return new Intl.DateTimeFormat('fr-FR', { timeZone: TZ, day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit' }).format(new Date(iso));
}

export function formatDate(iso: string): string {
  return new Intl.DateTimeFormat('fr-FR', { timeZone: TZ, weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' }).format(new Date(iso.length === 10 ? `${iso}T12:00:00Z` : iso));
}

export function relativeTime(iso: string | null | undefined, now = Date.now()): string {
  if (!iso) return 'date inconnue';
  const diff = (now - Date.parse(iso)) / 60000;
  if (diff < 1) return "à l'instant";
  if (diff < 60) return `il y a ${Math.round(diff)} min`;
  if (diff < 60 * 24) return `il y a ${Math.round(diff / 60)} h`;
  const d = Math.round(diff / 1440);
  return `il y a ${d} jour${d > 1 ? 's' : ''}`;
}

export function formatNumber(v: number, opts: Intl.NumberFormatOptions = {}): string {
  return new Intl.NumberFormat('fr-FR', opts).format(v);
}

export function formatBig(v: number, unit = ''): string {
  const abs = Math.abs(v);
  if (abs >= 1e12) return `${formatNumber(v / 1e12, { maximumFractionDigits: 2 })} billion${abs >= 2e12 ? 's' : ''}${unit}`;
  if (abs >= 1e9) return `${formatNumber(v / 1e9, { maximumFractionDigits: 1 })} Md${unit}`;
  if (abs >= 1e6) return `${formatNumber(v / 1e6, { maximumFractionDigits: 1 })} M${unit}`;
  return `${formatNumber(v, { maximumFractionDigits: 0 })}${unit}`;
}
