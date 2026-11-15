import { Suspense, useEffect } from 'react';
import { NavLink, Outlet, useLocation } from 'react-router-dom';
import { IconBook, IconChart, IconGlobe, IconHome, IconMoon, IconNews, IconSun } from './Icons';
import { getState, markDay, update, useStore } from '../lib/store';

const NAV = [
  { to: '/', label: 'Accueil', icon: IconHome, end: true },
  { to: '/actualite', label: 'Actualité', icon: IconNews },
  { to: '/geopolitique', label: 'Géopolitique', icon: IconGlobe },
  { to: '/histoire', label: 'Histoire', icon: IconBook },
  { to: '/progression', label: 'Progression', icon: IconChart },
];

export function applyTheme(theme: 'system' | 'light' | 'dark') {
  const dark = theme === 'dark' || (theme === 'system' && window.matchMedia('(prefers-color-scheme: dark)').matches);
  document.documentElement.classList.toggle('dark', dark);
}

export default function Layout() {
  const theme = useStore((s) => s.theme);
  const textSize = useStore((s) => s.textSize);
  const { pathname } = useLocation();

  useEffect(() => {
    markDay();
  }, []);
  useEffect(() => {
    applyTheme(theme);
    const mq = window.matchMedia('(prefers-color-scheme: dark)');
    const on = () => getState().theme === 'system' && applyTheme('system');
    mq.addEventListener('change', on);
    return () => mq.removeEventListener('change', on);
  }, [theme]);
  useEffect(() => {
    document.documentElement.classList.toggle('text-large', textSize === 'large');
  }, [textSize]);
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);

  const isDark = document.documentElement.classList.contains('dark');
  const toggleTheme = () => update((s) => ({ ...s, theme: isDark ? 'light' : 'dark' }));

  return (
    <div className="min-h-dvh">
      <header className="safe-top sticky top-0 z-30 border-b border-line bg-paper/90 backdrop-blur">
        <div className="mx-auto flex h-14 max-w-5xl items-center gap-4 px-4">
          <NavLink to="/" className="flex items-center gap-2" aria-label="ATLAS, accueil">
            <svg width="26" height="26" viewBox="0 0 64 64" aria-hidden="true">
              <circle cx="32" cy="32" r="28" fill="none" stroke="currentColor" strokeWidth="4" />
              <path d="M4 32h56M32 4c-10 8-14 18-14 28s4 20 14 28M32 4c10 8 14 18 14 28s-4 20-14 28" fill="none" stroke="currentColor" strokeWidth="3" />
            </svg>
            <span className="font-serif text-xl font-semibold tracking-[0.18em]">ATLAS</span>
          </NavLink>
          <nav className="ml-4 hidden flex-1 gap-1 md:flex" aria-label="Navigation principale">
            {NAV.map((n) => (
              <NavLink key={n.to} to={n.to} end={n.end} className={({ isActive }) => `rounded-lg px-3 py-1.5 text-sm ${isActive ? 'bg-accent-soft font-medium text-accent' : 'text-muted hover:text-ink'}`}>
                {n.label}
              </NavLink>
            ))}
            <NavLink to="/culture" className={({ isActive }) => `rounded-lg px-3 py-1.5 text-sm ${isActive ? 'bg-accent-soft font-medium text-accent' : 'text-muted hover:text-ink'}`}>
              Culture
            </NavLink>
          </nav>
          <button onClick={toggleTheme} className="ml-auto rounded-full p-2 text-muted hover:text-ink" aria-label={isDark ? 'Passer en mode clair' : 'Passer en mode sombre'}>
            {isDark ? <IconSun /> : <IconMoon />}
          </button>
        </div>
      </header>

      <main className="mx-auto max-w-5xl px-4 pb-28 pt-5 md:pb-12">
        <Suspense fallback={<div className="p-8 text-center text-sm text-muted">Chargement…</div>}>
          <Outlet />
        </Suspense>
      </main>

      <nav className="safe-bottom fixed inset-x-0 bottom-0 z-30 border-t border-line bg-paper/95 backdrop-blur md:hidden" aria-label="Navigation principale">
        <div className="mx-auto grid max-w-lg grid-cols-5">
          {NAV.map((n) => (
            <NavLink key={n.to} to={n.to} end={n.end} className={({ isActive }) => `flex flex-col items-center gap-0.5 pt-2 text-[11px] ${isActive ? 'text-accent' : 'text-muted'}`}>
              <n.icon size={22} />
              <span>{n.label}</span>
            </NavLink>
          ))}
        </div>
      </nav>
    </div>
  );
}
