
'use client';

import { useState } from 'react';
import TestForm from '@/components/test/test-form';
import TestRunning from '@/components/test/test-running';
import TestSummary from '@/components/test/test-summary';
import type { TestConfiguration, K6Summary, HistoryItem, LighthouseSummary, SeoAnalysis } from '@/types';
import { useLocalStorage } from '@/hooks/use-local-storage';
import { AppHeader } from '@/components/layout/app-header';
import { AppFooter } from '@/components/layout/app-footer';
import AboutPage from '@/components/pages/about-page';
import HelpPage from '@/components/pages/help-page';
import ContactPage from '@/components/pages/contact-page';
import HistoryPage from '@/components/pages/history-page';

type View = 'form' | 'running' | 'summary' | 'about' | 'history' | 'help' | 'contact';

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
      setView('history');
    }
  };

  const handleLoadFromHistory = (item: HistoryItem) => {
    setActiveTestConfig(item.config);
    setActiveTestResults(item.results);
    setActiveTestId(item.id);
    setView('summary');
  };

  const handleRerun = (config: TestConfiguration) => {
    setRerunInitialValues(config);
    setFormKey(Date.now());
    setView('form');
  };
  
  const handleCreateNewTest = () => {
    setRerunInitialValues(null);
    setFormKey(Date.now());
    setActiveTestConfig(null);
    setActiveTestResults(null);
    setActiveTestId(null);
    setView('form');
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
            initialValues={rerunInitialValues}
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

