
'use client';

import { useEffect, useState, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { ExternalLink, Loader, XCircle } from 'lucide-react';
import type { TestConfiguration } from '@/types';
import { useToast } from '@/hooks/use-toast';
import type { TestResults } from '@/app/page';

interface TestRunningProps {
  testId: string;
  config: TestConfiguration;
  onTestComplete: (results: TestResults) => void;
}

export default function TestRunning({ testId, config, onTestComplete }: TestRunningProps) {
  const { toast } = useToast();
  const [error, setError] = useState<string | null>(null);
  const [running, setRunning] = useState({
    k6: config.runLoadTest,
    lighthouse: config.runLighthouse,
    seo: config.runSeo,
  });
  const resultsRef = useRef<TestResults>({});

  const grafanaUrl = `${window.location.protocol}//${window.location.hostname}:3003/d/k6/k6-load-testing-results?orgId=1&var-testid=${testId}&refresh=5s`;
  
  useEffect(() => {
    let isMounted = true;
    
    const allTestsComplete = () => {
      return !running.k6 && !running.lighthouse && !running.seo;
    };
    
    // Check if all tests are complete after a state update
    if (isMounted && allTestsComplete()) {
      onTestComplete(resultsRef.current);
    }
    
    return () => { isMounted = false };
  }, [running, onTestComplete]);


  // K6 Load Test Runner
  useEffect(() => {
    if (!config.runLoadTest) return;

    let pollTimeout: NodeJS.Timeout;
    let attempts = 0;
    const maxAttempts = 100; // ~5 minutes

    const pollForK6Summary = async (k6TestId: string) => {
      if (attempts >= maxAttempts) {
        setError('k6 test timed out.');
        setRunning(r => ({ ...r, k6: false }));
        return;
      }
      try {
        const response = await fetch(`/api/check-summary/${k6TestId}`);
        attempts++;
        if (response.ok) {
          const summary = await response.json();
          resultsRef.current.k6 = summary;
          setRunning(r => ({ ...r, k6: false }));
        } else if (response.status === 404) {
          pollTimeout = setTimeout(() => pollForK6Summary(k6TestId), 3000);
        } else {
          throw new Error(`Server error: ${response.status}`);
        }
      } catch (e: any) {
        setError(`Failed to poll for k6 summary: ${e.message}`);
        setRunning(r => ({ ...r, k6: false }));
      }
    };
    
    const runK6Test = async () => {
        try {
            const response = await fetch('/api/run-test', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(config),
            });
            if (!response.ok) throw new Error('Failed to start k6 test');
            const { testId: k6TestId } = await response.json();
            pollForK6Summary(k6TestId);
        } catch (e: any) {
            setError(`Failed to start k6 test: ${e.message}`);
            setRunning(r => ({ ...r, k6: false }));
        }
    };
    runK6Test();
    return () => clearTimeout(pollTimeout);
  }, [config, testId]);

  // Lighthouse Runner
  useEffect(() => {
    if (!config.runLighthouse) return;
    const runLighthouse = async () => {
        try {
            const response = await fetch('/api/run-lighthouse', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ url: config.url, testId }),
            });
            if (!response.ok) throw new Error('Lighthouse audit failed');
            const report = await response.json();
            resultsRef.current.lighthouse = report;
        } catch (e: any) {
            toast({ variant: 'destructive', title: 'Lighthouse Error', description: e.message });
        } finally {
            setRunning(r => ({ ...r, lighthouse: false }));
        }
    };
    runLighthouse();
  }, [config.runLighthouse, config.url, testId, toast]);

  // SEO Runner
  useEffect(() => {
    if (!config.runSeo) return;
    const runSeo = async () => {
        try {
            const response = await fetch('/api/run-seo', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ url: config.url }),
            });
            if (!response.ok) throw new Error('SEO analysis failed');
            const analysis = await response.json();
            resultsRef.current.seo = analysis;
        } catch (e: any) {
            toast({ variant: 'destructive', title: 'SEO Error', description: e.message });
        } finally {
            setRunning(r => ({ ...r, seo: false }));
        }
    };
    runSeo();
  }, [config.runSeo, config.url, toast]);

  return (
    <Card className="max-w-2xl mx-auto">
      <CardHeader className="text-center">
        {error ? (
          <>
            <XCircle className="mx-auto h-12 w-12 text-destructive" />
            <CardTitle>Test Failed</CardTitle>
            <CardDescription>{error}</CardDescription>
          </>
        ) : (
          <>
            <div className="relative mx-auto">
                <Loader className="h-12 w-12 text-primary animate-spin" />
            </div>
            <CardTitle>Tests in Progress...</CardTitle>
            <CardDescription>Your tests are running. Results will appear here when complete.</CardDescription>
          </>
        )}
      </CardHeader>
      <CardContent className="flex flex-col items-center gap-6">
        <div className='w-full space-y-2 text-center'>
            <p className='text-sm font-medium'>Status:</p>
            <ul className='text-sm text-muted-foreground'>
                {config.runLoadTest && <li>k6 Load Test: {running.k6 ? "Running..." : "Complete"}</li>}
                {config.runLighthouse && <li>Lighthouse Audit: {running.lighthouse ? "Running..." : "Complete"}</li>}
                {config.runSeo && <li>SEO Check: {running.seo ? "Running..." : "Complete"}</li>}
            </ul>
        </div>
        {config.runLoadTest && (
            <Button asChild size="lg">
                <a href={grafanaUrl} target="_blank" rel="noopener noreferrer">
                    <ExternalLink className="mr-2 h-4 w-4" />
                    View Live Grafana Dashboard
                </a>
            </Button>
        )}
      </CardContent>
    </Card>
  );
}
