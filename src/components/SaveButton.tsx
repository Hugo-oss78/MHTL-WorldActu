import { IconBookmark } from './Icons';
import { toggleSaved, useStore, type SavedItem } from '../lib/store';

export default function SaveButton({ item, label = false }: { item: Omit<SavedItem, 'at'>; label?: boolean }) {
  const saved = useStore((s) => !!s.saved[item.id]);
  return (
    <button
      onClick={(e) => {
        e.preventDefault();
        e.stopPropagation();
        toggleSaved(item);
      }}
      className={`inline-flex items-center gap-1.5 rounded-full p-1.5 text-sm ${saved ? 'text-accent' : 'text-muted hover:text-ink'}`}
      aria-pressed={saved}
      aria-label={saved ? 'Retirer des favoris' : 'Ajouter aux favoris'}
    >
      <IconBookmark filled={saved} size={18} />
      {label && <span>{saved ? 'Enregistré' : 'Enregistrer'}</span>}
    </button>
  );
}
