import { useEffect, useState } from 'react';
import { LangProvider } from './i18n/LangContext';
import { SolanaProvider } from './solana/SolanaProvider';
import { Header } from './components/Header';
import { Footer } from './components/Footer';
import { Home } from './pages/Home';
import { ViolationView } from './pages/ViolationView';

type View = { name: 'home' } | { name: 'violation'; code: string };

function Shell() {
  const [view, setView] = useState<View>({ name: 'home' });

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [view]);

  return (
    <div className="flex min-h-full flex-col">
      <Header onHome={() => setView({ name: 'home' })} />
      <main className="flex-1">
        {view.name === 'home' ? (
          <Home onFound={(code) => setView({ name: 'violation', code })} />
        ) : (
          <ViolationView
            key={view.code}
            code={view.code}
            onBack={() => setView({ name: 'home' })}
          />
        )}
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
