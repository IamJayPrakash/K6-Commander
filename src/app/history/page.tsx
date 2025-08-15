'use client';

import { useLocalStorage } from '@/hooks/use-local-storage';
import type { HistoryItem, TestConfiguration } from '@/types';
import HistoryPageComponent from '@/components/pages/history-page';
import { useRouter } from 'next/navigation';

// This is a client-side route that wraps the history page component
// It handles the logic for loading/rerunning tests by navigating back to the main page
// with the correct state. This is a common pattern for separating complex state logic
// from the main page component.
export default function HistoryPage() {
  const [history, setHistory] = useLocalStorage<HistoryItem[]>('k6-history', []);
  const [lastSaved, setLastSaved] = useLocalStorage<string | null>('k6-history-last-saved', null);
  const router = useRouter();

  const handleLoadFromHistory = (item: HistoryItem) => {
    // We can't directly set the state of the home page from here.
    // The best approach is to store the item to load in session storage and redirect.
    sessionStorage.setItem('load-history-item', JSON.stringify(item));
    router.push('/');
  };

  const handleRerun = (config: TestConfiguration) => {
    sessionStorage.setItem('rerun-config', JSON.stringify(config));
    router.push('/');
  };

  const updateHistory = (newHistory: HistoryItem[] | ((prev: HistoryItem[]) => HistoryItem[])) => {
    const valueToSet = typeof newHistory === 'function' ? newHistory(history) : newHistory;
    setHistory(valueToSet);
    setLastSaved(new Date().toISOString());
  };

  return (
    <HistoryPageComponent
      history={history}
      setHistory={updateHistory}
      lastSaved={lastSaved}
      onLoad={handleLoadFromHistory}
      onRerun={handleRerun}
    />
  );
}
