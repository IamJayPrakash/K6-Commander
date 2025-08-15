
'use client';

import { useState } from 'react';
import TestForm from '@/components/test/test-form';
import TestRunning from '@/components/test/test-running';
import TestSummary from '@/components/test/test-summary';
import type { TestConfiguration, K6Summary, HistoryItem } from '@/types';
import { useLocalStorage } from '@/hooks/use-local-storage';
import { AppHeader } from '@/components/layout/app-header';
import { AppFooter } from '@/components/layout/app-footer';
import AboutPage from '@/components/pages/about-page';
import HelpPage from '@/components/pages/help-page';
import ContactPage from '@/components/pages/contact-page';
import HistoryPage from '@/components/pages/history-page';
import { TEST_PRESETS } from '@/lib/constants';

type View = 'form' | 'running' | 'summary' | 'about' | 'history' | 'help' | 'contact';

// Define default values outside the component to ensure it's a stable reference
const newTestDefaultValues = {
    url: '',
    method: 'GET' as const,
    headers: [],
    body: '',
    testPreset: 'baseline' as const,
    vus: TEST_PRESETS.baseline.vus,
    duration: TEST_PRESETS.baseline.duration,
    stages: TEST_PRESETS.baseline.stages,
    runLoadTest: true,
    runLighthouse: false,
    runSeo: false,
};

export default function Home() {
  const [view, setView] = useState<View>('form');
  const [activeTestId, setActiveTestId] = useState<string | null>(null);
  const [activeTestConfig, setActiveTestConfig] =
    useState<TestConfiguration | null>(null);
  const [activeTestSummary, setActiveTestSummary] =
    useState<K6Summary | null>(null);
  const [history, setHistory] = useLocalStorage<HistoryItem[]>('k6-history', []);
  
  // By using a key that changes, we can force React to re-mount the TestForm component,
  // ensuring a clean state for the form instead of trying to update the existing one.
  const [formKey, setFormKey] = useState(Date.now());
  const [formInitialValues, setFormInitialValues] = useState(newTestDefaultValues);

  const handleRunTest = (testId: string, config: TestConfiguration) => {
    setActiveTestId(testId);
    setActiveTestConfig(config);
    setView('running');
  };

  const handleTestComplete = (summary: K6Summary) => {
    setActiveTestSummary(summary);
    setView('summary');
  };

  const handleSaveToHistory = () => {
    if (activeTestConfig && activeTestSummary && activeTestId) {
      const newHistoryItem: HistoryItem = {
        id: activeTestId,
        timestamp: new Date().toISOString(),
        config: activeTestConfig,
        summary: activeTestSummary,
      };
      const newHistory = [newHistoryItem, ...history];
      setHistory(newHistory);
      setView('history');
    }
  };

  const handleLoadFromHistory = (item: HistoryItem) => {
    setActiveTestConfig(item.config);
    setActiveTestSummary(item.summary);
    setActiveTestId(item.id);
    setView('summary');
  };

  const handleRerun = (config: TestConfiguration) => {
    // Set the initial values for the form based on the historical run
    setFormInitialValues({
        url: config.url || '',
        method: config.method || 'GET',
        headers: config.headers ? Object.entries(config.headers).map(([key, value]) => ({ key, value: String(value) })) : [],
        body: config.body || '',
        testPreset: config.testPreset || 'custom',
        vus: config.vus,
        duration: config.duration,
        stages: config.stages,
        runLoadTest: config.runLoadTest,
        runLighthouse: config.runLighthouse,
        runSeo: config.runSeo,
    });
    // Change the key to force re-mount and navigate to the form
    setFormKey(Date.now());
    setView('form');
  };
  
  const handleCreateNewTest = () => {
    // Reset to default values
    setFormInitialValues(newTestDefaultValues);
    setActiveTestConfig(null);
    setActiveTestSummary(null);
    setActiveTestId(null);
    // Change the key to force re-mount
    setFormKey(Date.now());
    setView('form');
  };

  const renderView = () => {
    switch (view) {
      case 'running':
        return (
          <TestRunning
            testId={activeTestId!}
            onTestComplete={handleTestComplete}
          />
        );
      case 'summary':
        return (
          <TestSummary
            summary={activeTestSummary!}
            config={activeTestConfig!}
            onSaveToHistory={handleSaveToHistory}
            onRerun={() => handleRerun(activeTestConfig!)}
            onCreateNew={handleCreateNewTest}
          />
        );
      case 'about':
        return <AboutPage />;
      case 'help':
        return <HelpPage />;
      case 'contact':
        return <ContactPage />;
      case 'history':
        return <HistoryPage 
                  history={history} 
                  setHistory={setHistory}
                  onLoad={handleLoadFromHistory}
                  onRerun={handleRerun}
                />;
      case 'form':
      default:
        return (
          <TestForm
            key={formKey}
            defaultValues={formInitialValues}
            onRunTest={handleRunTest}
          />
        );
    }
  };

  return (
    <div className="flex flex-col min-h-screen bg-gradient-to-br from-black to-[#1a1a1a]">
        <AppHeader setView={setView} />
        <main className="flex-1 container mx-auto px-4 md:px-6 lg:px-8 py-8">
            {renderView()}
        </main>
        <AppFooter />
    </div>
  );
}
