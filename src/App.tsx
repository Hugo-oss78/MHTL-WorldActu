import { lazy, Suspense } from 'react';
import { Route, Routes } from 'react-router-dom';
import Layout from './components/Layout';
import Home from './pages/Home';
import { Empty } from './components/ui';

const News = lazy(() => import('./pages/News'));
const Geopolitics = lazy(() => import('./pages/Geopolitics'));
const DossierPage = lazy(() => import('./pages/DossierPage'));
const CountryPage = lazy(() => import('./pages/CountryPage'));
const History = lazy(() => import('./pages/History'));
const HistoryFichePage = lazy(() => import('./pages/HistoryFichePage'));
const Culture = lazy(() => import('./pages/Culture'));
const CultureFichePage = lazy(() => import('./pages/Culture').then((m) => ({ default: m.CultureFichePage })));
const ConceptPage = lazy(() => import('./pages/Culture').then((m) => ({ default: m.ConceptPage })));
const Progress = lazy(() => import('./pages/Progress'));
const SourcesPage = lazy(() => import('./pages/Info').then((m) => ({ default: m.SourcesPage })));
const MethodPage = lazy(() => import('./pages/Info').then((m) => ({ default: m.MethodPage })));
const ArchivesPage = lazy(() => import('./pages/Info').then((m) => ({ default: m.ArchivesPage })));

export default function App() {
  return (
    <Suspense fallback={<div className="p-8 text-center text-sm text-muted">Chargement…</div>}>
      <Routes>
        <Route element={<Layout />}>
          <Route index element={<Home />} />
          <Route path="actualite" element={<News />} />
          <Route path="geopolitique" element={<Geopolitics />} />
          <Route path="geopolitique/dossier/:id" element={<DossierPage />} />
          <Route path="geopolitique/pays/:iso" element={<CountryPage />} />
          <Route path="histoire" element={<History />} />
          <Route path="histoire/fiche/:id" element={<HistoryFichePage />} />
          <Route path="culture" element={<Culture />} />
          <Route path="culture/fiche/:id" element={<CultureFichePage />} />
          <Route path="culture/concept/:id" element={<ConceptPage />} />
          <Route path="progression" element={<Progress />} />
          <Route path="progression/:section" element={<Progress />} />
          <Route path="sources" element={<SourcesPage />} />
          <Route path="methode" element={<MethodPage />} />
          <Route path="archives" element={<ArchivesPage />} />
          <Route path="*" element={<Empty title="Page introuvable" />} />
        </Route>
      </Routes>
    </Suspense>
  );
}
