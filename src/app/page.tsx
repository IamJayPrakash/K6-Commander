
'use client';

import { useState, useEffect } from 'react';
import TestForm from '@/components/test/test-form';
import TestRunning from '@/components/test/test-running';
import TestSummary from '@/components/test/test-summary';
import type { TestConfiguration, K6Summary, HistoryItem, LighthouseSummary, SeoAnalysis } from '@/types';
import { useLocalStorage } from '@/hooks/use-local-storage';
import AboutPage from '@/app/about/page';
import HistoryPage from './history/page';
import Joyride, { STATUS } from 'react-joyride';
import { TOUR_STEPS } from '@/lib/constants';
import ConsentModal from '@/components/layout/consent-modal';
import { useToast } from '@/hooks/use-toast';

type View = 'form' | 'running' | 'summary' | 'about' | 'history';

export interface TestResults {
  k6?: K6Summary;
  lighthouse?: LighthouseSummary;
  seo?: SeoAnalysis;
}

export default function Home() {
  const [view, setView] = useState<View>('form');
  const [activeTestId, setActiveTestId] = useState<string | null>(null);
  const [activeTestConfig, setActiveTestConfig] =
    useState<TestConfiguration | null>(null);
  const [activeTestResults, setActiveTestResults] =
    useState<TestResults | null>(null);
  const [history, setHistory] = useLocalStorage<HistoryItem[]>('k6-history', []);
  const [rerunInitialValues, setRerunInitialValues] = useState<Partial<TestConfiguration> | null>(null);
  const [formKey, setFormKey] = useState(Date.now());
  const [isTourRunning, setIsTourRunning] = useState(false);
  const { toast } = useToast();
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  const handleRunTest = (testId: string, config: TestConfiguration) => {
    setActiveTestId(testId);
    setActiveTestConfig(config);
    setActiveTestResults(null); // Reset previous results
    setView('running');
  };

  const handleTestComplete = (results: TestResults) => {
    setActiveTestResults(results);
    setView('summary');
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
      const newHistory = [newHistoryItem, ...history.filter(h => h.id !== activeTestId)];
      setHistory(newHistory);
      toast({ title: 'Saved to History', description: 'Test run has been saved.'})
      // setView('history'); This was causing a jump to the history page which might not be desired.
    }
  };

  const handleLoadFromHistory = (item: HistoryItem) => {
    setActiveTestConfig(item.config);
    setActiveTestResults(item.results);
    setActiveTestId(item.id);
    setView('summary');
  };

  const handleRerun = (config: TestConfiguration) => {
    // Setting initial values for the form when "Run Again" is clicked
    sessionStorage.setItem('rerun-config', JSON.stringify(config));
    setRerunInitialValues(config);
    setFormKey(Date.now()); // Change key to force re-mount
    setView('form');
  };
  
  const handleCreateNewTest = () => {
    sessionStorage.removeItem('rerun-config');
    sessionStorage.removeItem('load-history-item');
    setRerunInitialValues(null); // Clear initial values
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

    // Check for history item to load from session storage
    const itemToLoad = sessionStorage.getItem('load-history-item');
    if (itemToLoad) {
        try {
            handleLoadFromHistory(JSON.parse(itemToLoad));
        } catch (e) {
            console.error("Failed to parse history item from session storage", e);
        } finally {
            sessionStorage.removeItem('load-history-item');
        }
    }

    // Check for rerun config from session storage
    const configToRerun = sessionStorage.getItem('rerun-config');
    if (configToRerun) {
        try {
            handleRerun(JSON.parse(configToRerun));
        } catch (e) {
            console.error("Failed to parse rerun config from session storage", e);
        } finally {
            sessionStorage.removeItem('rerun-config');
        }
    }

    return () => {
      delete (window as any).startTour;
    }
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
            testId={activeTestId!}
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
      case 'about':
        return <AboutPage />;
      case 'history':
        return <HistoryPage />;
      case 'form':
      default:
        return (
          <TestForm
            key={formKey}
            initialValues={rerunInitialValues}
            onRunTest={handleRunTest}
          />
        );
    }
  };

  return (
    <>
      {isMounted && (
        <Joyride
          steps={TOUR_STEPS}
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
      {renderView()}
    </>
  );
}
