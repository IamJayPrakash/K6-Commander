'use client';

import { useState } from 'react';
import { Sidebar, SidebarInset } from '@/components/ui/sidebar';
import { HistoryPanel } from '@/components/layout/history-panel';
import { Header } from '@/components/layout/header';
import TestForm from '@/components/test/test-form';
import TestRunning from '@/components/test/test-running';
import TestSummary from '@/components/test/test-summary';
import type { TestConfiguration, K6Summary, HistoryItem } from '@/types';
import { useLocalStorage } from '@/hooks/use-local-storage';

type View = 'form' | 'running' | 'summary';

export default function Home() {
  const [view, setView] = useState<View>('form');
  const [activeTestId, setActiveTestId] = useState<string | null>(null);
  const [activeTestConfig, setActiveTestConfig] =
    useState<TestConfiguration | null>(null);
  const [activeTestSummary, setActiveTestSummary] =
    useState<K6Summary | null>(null);
  const [history, setHistory] = useLocalStorage<HistoryItem[]>('k6-history', []);
  const [formSeed, setFormSeed] = useState(Date.now());

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
      setHistory([newHistoryItem, ...history]);
      setView('form');
      setFormSeed(Date.now()); // Reset form
    }
  };

  const handleLoadFromHistory = (item: HistoryItem) => {
    setActiveTestConfig(item.config);
    setActiveTestSummary(item.summary);
    setActiveTestId(item.id);
    setView('summary');
  };

  const handleRerun = (config: TestConfiguration) => {
    setActiveTestConfig(config);
    setFormSeed(Date.now()); // Re-seed form with this config
    setView('form');
  };

  const handleCreateNewTest = () => {
    setActiveTestConfig(null);
    setActiveTestSummary(null);
    setActiveTestId(null);
    setFormSeed(Date.now());
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
      case 'form':
      default:
        return (
          <TestForm
            key={formSeed}
            initialConfig={activeTestConfig}
            onRunTest={handleRunTest}
          />
        );
    }
  };

  return (
    <div className="flex min-h-screen">
      <Sidebar
        variant="sidebar"
        collapsible="icon"
        className="border-r border-sidebar-border"
      >
        <HistoryPanel
          history={history}
          setHistory={setHistory}
          onLoad={handleLoadFromHistory}
          onRerun={handleRerun}
        />
      </Sidebar>
      <SidebarInset className="flex flex-col">
        <Header />
        <main className="flex-1 overflow-y-auto p-4 md:p-6 lg:p-8">
          {renderView()}
        </main>
      </SidebarInset>
    </div>
  );
}
