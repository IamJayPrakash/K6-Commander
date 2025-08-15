'use client';

import { useState, useEffect } from 'react';
import TestForm from '@/components/test/test-form';
import TestRunning from '@/components/test/test-running';
import TestSummary from '@/components/test/test-summary';
import type { TestConfiguration, HistoryItem, SeoAnalysis } from '@/types';
import { useLocalStorage } from '@/hooks/use-local-storage';
import Joyride, { STATUS } from 'react-joyride';
import { TOUR_STEPS } from '@/lib/constants';
import ConsentModal from '@/components/layout/consent-modal';
import { useToast } from '@/hooks/use-toast';
import type { TestResults } from '@/types/index';
import { Card, CardDescription } from '@/components/ui/card';
import { Clock } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';
import Link from 'next/link';
import { useTranslation } from 'react-i18next';

type View = 'form' | 'running' | 'summary';

export default function Home() {
  const [view, setView] = useState<View>('form');
  const [activeTestId, setActiveTestId] = useState<string | null>(null);
  const [activeTestConfig, setActiveTestConfig] = useState<TestConfiguration | null>(null);
  const [activeTestResults, setActiveTestResults] = useState<TestResults | null>(null);
  const [history, setHistory] = useLocalStorage<HistoryItem[]>('k6-history', []);
  const [lastSaved, setLastSaved] = useLocalStorage<string | null>('k6-history-last-saved', null);
  const [initialValues, setInitialValues] = useState<Partial<TestConfiguration> | null>(null);
  const [formKey, setFormKey] = useState(Date.now());
  const [isTourRunning, setIsTourRunning] = useState(false);
  const { toast } = useToast();
  const [isMounted, setIsMounted] = useState(false);
  const { t } = useTranslation();

  const tourSteps = TOUR_STEPS.map((step) => ({
    ...step,
    content: t(step.content),
  }));

  useEffect(() => {
    setIsMounted(true);
  }, []);

  const updateHistory = (newHistory: HistoryItem[] | ((prev: HistoryItem[]) => HistoryItem[])) => {
    const valueToSet = typeof newHistory === 'function' ? newHistory(history) : newHistory;
    setHistory(valueToSet);
    setLastSaved(new Date().toISOString());
  };

  // Check for history item to load from session storage on mount
  useEffect(() => {
    if (!isMounted) return;
    const itemToLoad = sessionStorage.getItem('load-history-item');
    if (itemToLoad) {
      try {
        const item = JSON.parse(itemToLoad);
        handleLoadFromHistory(item);
      } catch (e) {
        console.error('Failed to parse history item from session storage', e);
      }
      sessionStorage.removeItem('load-history-item');
    }

    const configToRerun = sessionStorage.getItem('rerun-config');
    if (configToRerun) {
      try {
        const config = JSON.parse(configToRerun);
        handleRerun(config);
      } catch (e) {
        console.error('Failed to parse rerun config from session storage', e);
      }
      sessionStorage.removeItem('rerun-config');
    }
  }, [isMounted]);

  const handleRunTest = (testId: string, config: TestConfiguration) => {
    setActiveTestId(testId);
    setActiveTestConfig(config);
    setActiveTestResults(null); // Reset previous results
    setView('running');
  };

  const handleTestComplete = (results: TestResults, finalTestId: string) => {
    if (activeTestConfig) {
      setActiveTestId(finalTestId); // Update with the final ID from the server
      setActiveTestResults(results);
      // Auto-save to history on completion
      const newHistoryItem: HistoryItem = {
        id: finalTestId,
        timestamp: new Date().toISOString(),
        config: activeTestConfig,
        results: results,
      };
      updateHistory((prev) => [newHistoryItem, ...prev.filter((h) => h.id !== finalTestId)]);
      toast({
        title: 'Test Complete & Saved',
        description: 'Your test results are ready and saved to history.',
      });
      setView('summary');
    }
  };

  const handleSaveToHistory = () => {
    if (activeTestConfig && activeTestResults && activeTestId) {
      const newHistoryItem: HistoryItem = {
        id: activeTestId,
        timestamp: new Date().toISOString(),
        config: activeTestConfig,
        results: activeTestResults,
      };
      // Prevent duplicates
      updateHistory([newHistoryItem, ...history.filter((h) => h.id !== activeTestId)]);
      toast({ title: 'Saved to History', description: 'Test run has been saved.' });
    }
  };

  const handleLoadFromHistory = (item: HistoryItem) => {
    setActiveTestConfig(item.config);
    setActiveTestResults(item.results);
    setActiveTestId(item.id);
    setView('summary');
  };

  const handleRerun = (config: TestConfiguration) => {
    setInitialValues(config);
    setFormKey(Date.now()); // Change key to force re-mount
    setView('form');
  };

  const handleCreateNewTest = () => {
    setInitialValues(null); // Clear initial values
    setFormKey(Date.now()); // Change key to force re-mount
    setActiveTestConfig(null);
    setActiveTestResults(null);
    setActiveTestId(null);
    setView('form');
  };

  useEffect(() => {
    // Expose startTour to the window object so the header can call it
    (window as any).startTour = () => {
      setView('form');
      // A small delay to ensure the form view is rendered
      setTimeout(() => setIsTourRunning(true), 100);
    };

    return () => {
      delete (window as any).startTour;
    };
  }, []);

  const handleJoyrideCallback = (data: any) => {
    const { status } = data;
    if ([STATUS.FINISHED, STATUS.SKIPPED].includes(status)) {
      setIsTourRunning(false);
    }
  };

  const renderView = () => {
    switch (view) {
      case 'running':
        return (
          <TestRunning
            initialTestId={activeTestId!}
            config={activeTestConfig!}
            onTestComplete={handleTestComplete}
          />
        );
      case 'summary':
        return (
          <TestSummary
            results={activeTestResults!}
            config={activeTestConfig!}
            testId={activeTestId!}
            onSaveToHistory={handleSaveToHistory}
            onRerun={() => handleRerun(activeTestConfig!)}
            onCreateNew={handleCreateNewTest}
          />
        );
      case 'form':
      default:
        return (
          <TestForm
            key={formKey}
            initialValues={initialValues}
            onRunTest={handleRunTest}
            setHistory={updateHistory}
          />
        );
    }
  };

  return (
    <>
      {isMounted && (
        <Joyride
          steps={tourSteps}
          run={isTourRunning}
          continuous
          showProgress
          showSkipButton
          callback={handleJoyrideCallback}
          styles={{
            options: {
              arrowColor: 'hsl(var(--card))',
              backgroundColor: 'hsl(var(--card))',
              primaryColor: 'hsl(var(--primary))',
              textColor: 'hsl(var(--card-foreground))',
              zIndex: 1000,
            },
          }}
        />
      )}
      <ConsentModal />
      {view === 'form' && lastSaved && (
        <Card className="mb-6 bg-blue-900/10 border-blue-500/20 hover:border-blue-500/50 transition-colors">
          <Link href="/history">
            <CardDescription className="text-center p-2 text-xs text-blue-300 flex items-center justify-center gap-2 cursor-pointer">
              <Clock className="h-3 w-3" />
              {t('home.lastSaved', {
                distance: formatDistanceToNow(new Date(lastSaved), { addSuffix: true }),
              })}
            </CardDescription>
          </Link>
        </Card>
      )}
      {renderView()}
    </>
  );
}
