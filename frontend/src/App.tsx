import { useEffect, useState } from 'react';
import { LangProvider } from './i18n/LangContext';
import { SolanaProvider } from './solana/SolanaProvider';
import { Header } from './components/Header';
import { Footer } from './components/Footer';
import { Home } from './pages/Home';
import { ViolationView } from './pages/ViolationView';
import type { Violation } from './data/violations';

type View = { name: 'home' } | { name: 'violation'; code: string; violation?: Violation };

function Shell() {
  const [view, setView] = useState<View>({ name: 'home' });

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [view]);

  return (
    <div className="flex min-h-full flex-col">
      <Header onHome={() => setView({ name: 'home' })} />
      <main className="flex-1">
        <div key={view.name === 'home' ? 'home' : view.code} className="animate-fadeIn">
          {view.name === 'home' ? (
            <Home onFound={(violation) => setView({ name: 'violation', code: violation.code, violation })} />
          ) : (
            <ViolationView
              code={view.code}
              initialViolation={view.violation}
              onBack={() => setView({ name: 'home' })}
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
      <SolanaProvider>
        <Shell />
      </SolanaProvider>
    </LangProvider>
  );
}
