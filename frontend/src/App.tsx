import { useEffect, useState } from 'react';
import { ThirdwebProvider } from 'thirdweb/react';
import { LangProvider } from './i18n/LangContext';
import { SolanaProvider } from './solana/SolanaProvider';
import { Header } from './components/Header';
import { Footer } from './components/Footer';
import { Home } from './pages/Home';
import { ViolationView } from './pages/ViolationView';
import { isValidCodeFormat, type Violation } from './data/violations';

// Bump to invalidate stale local payment/appeal caches from prior demo runs.
const DEMO_DATA_VERSION = '2026-05-25-v2';
if (typeof window !== 'undefined') {
  try {
    if (localStorage.getItem('safecity:demo_version') !== DEMO_DATA_VERSION) {
      localStorage.removeItem('safecity:payments');
      localStorage.removeItem('safecity:violation_status');
      localStorage.setItem('safecity:demo_version', DEMO_DATA_VERSION);
    }
  } catch {
    /* ignore */
  }
}

type View = { name: 'home' } | { name: 'violation'; code: string; violation?: Violation };

function viewFromHash(): View {
  const hash = window.location.hash.replace(/^#/, '').trim();
  if (hash && isValidCodeFormat(hash)) return { name: 'violation', code: hash };
  return { name: 'home' };
}

function Shell() {
  const [view, setView] = useState<View>(viewFromHash);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [view]);

  // Keep URL in sync with the active view.
  useEffect(() => {
    const targetHash = view.name === 'violation' ? `#${view.code}` : '';
    if (window.location.hash !== targetHash) {
      history.pushState(null, '', targetHash || location.pathname + location.search);
    }
  }, [view]);

  // Handle browser back / forward.
  useEffect(() => {
    const onPopState = () => setView(viewFromHash());
    window.addEventListener('popstate', onPopState);
    return () => window.removeEventListener('popstate', onPopState);
  }, []);

  const goToViolation = (violation: Violation) =>
    setView({ name: 'violation', code: violation.code, violation });

  const goHome = () => setView({ name: 'home' });

  return (
    <div className="flex min-h-full flex-col">
      <Header onHome={goHome} />
      <main className="flex-1">
        <div key={view.name === 'home' ? 'home' : view.code} className="animate-fadeIn">
          {view.name === 'home' ? (
            <Home onFound={goToViolation} />
          ) : (
            <ViolationView
              code={view.code}
              initialViolation={view.violation}
              onBack={goHome}
            />
          )}
        </div>
      </main>
      <Footer />
    </div>
  );
}

export default function App() {
  return (
    <LangProvider>
      <ThirdwebProvider>
        <SolanaProvider>
          <Shell />
        </SolanaProvider>
      </ThirdwebProvider>
    </LangProvider>
  );
}
