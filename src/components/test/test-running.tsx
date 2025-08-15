
'use client';

import { useEffect, useState, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { ExternalLink, Loader, XCircle, CheckCircle } from 'lucide-react';
import type { TestConfiguration, K6Summary, LighthouseSummary, SeoAnalysis } from '@/types';
import { useToast } from '@/hooks/use-toast';
import type { TestResults } from '@/types/index';

interface TestRunningProps {
  initialTestId: string;
  config: TestConfiguration;
  onTestComplete: (results: TestResults, finalTestId: string) => void;
}

export default function TestRunning({ initialTestId, config, onTestComplete }: TestRunningProps) {
  const { toast } = useToast();
  const [error, setError] = useState<string | null>(null);
  const [runningStatus, setRunningStatus] = useState({
    k6: config.runLoadTest ? 'pending' : 'skipped',
    lighthouse: config.runLighthouse ? 'pending' : 'skipped',
    seo: config.runSeo ? 'pending' : 'skipped',
  });
  const [k6TestId, setK6TestId] = useState<string>(initialTestId); // This can be updated by the API response
  const [finalTestId, setFinalTestId] = useState<string>(initialTestId);

  const grafanaUrl = `${window.location.protocol}//${window.location.hostname}:3003/d/k6/k6-load-testing-results?orgId=1&var-testid=${k6TestId}&refresh=5s`;
  
  const hasCompleted = useRef(false);

  useEffect(() => {
    if (hasCompleted.current) return;

    const runAllTests = async () => {
        const testPromises: Promise<Partial<TestResults>>[] = [];
        let serverGeneratedTestId = finalTestId;

        // K6 Load Test
        if (config.runLoadTest) {
            const k6Promise = (async (): Promise<Partial<TestResults>> => {
                try {
                    setRunningStatus(s => ({ ...s, k6: 'running' }));
                    const startResponse = await fetch('/api/run-test', {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify(config),
                    });
                    if (!startResponse.ok) throw new Error('Failed to start k6 test');
                    const { testId: newTestId } = await startResponse.json();
                    
                    // This is the definitive test ID for all reports
                    serverGeneratedTestId = newTestId;
                    setK6TestId(newTestId);
                    setFinalTestId(newTestId);

                    // Polling for summary
                    const summary = await new Promise<K6Summary>((resolve, reject) => {
                        let attempts = 0;
                        const maxAttempts = 100; // ~5 minutes
                        const poll = () => {
                            if (attempts++ > maxAttempts) return reject(new Error('k6 test timed out.'));
                            fetch(`/api/check-summary/${newTestId}`)
                                .then(res => {
                                    if (res.ok) return res.json().then(resolve);
                                    if (res.status === 404) setTimeout(poll, 3000);
                                    else reject(new Error(`Server error: ${res.status}`));
                                })
                                .catch(reject);
                        };
                        poll();
                    });
                    
                    setRunningStatus(s => ({ ...s, k6: 'completed' }));
                    return { k6: summary };
                } catch (e: any) {
                    setRunningStatus(s => ({ ...s, k6: 'failed' }));
                    toast({ variant: 'destructive', title: 'k6 Test Error', description: e.message });
                    return {};
                }
            })();
            testPromises.push(k6Promise);
        }

        // Wait for k6 test to finish to get the definitive testId, if it's running
        await Promise.all(testPromises);

        // Run other tests in parallel now that we have the correct testId
        const otherTestPromises: Promise<Partial<TestResults>>[] = [];

        // Lighthouse Test
        if (config.runLighthouse) {
            const lighthousePromise = (async (): Promise<Partial<TestResults>> => {
                try {
                    setRunningStatus(s => ({ ...s, lighthouse: 'running' }));
                    const response = await fetch('/api/run-lighthouse', {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify({ url: config.url, testId: serverGeneratedTestId }),
                    });
                     if (!response.ok) {
                        const errorData = await response.json();
                        throw new Error(errorData.details || 'Lighthouse audit failed on the server.');
                    }
                    const report = await response.json();
                    setRunningStatus(s => ({ ...s, lighthouse: 'completed' }));
                    return { lighthouse: report };
                } catch (e: any) {
                    setRunningStatus(s => ({ ...s, lighthouse: 'failed' }));
                    toast({ variant: 'destructive', title: 'Lighthouse Error', description: e.message });
                    return {};
                }
            })();
            otherTestPromises.push(lighthousePromise);
        }

        // SEO Test
        if (config.runSeo) {
            const seoPromise = (async (): Promise<Partial<TestResults>> => {
                try {
                    setRunningStatus(s => ({ ...s, seo: 'running' }));
                    const response = await fetch('/api/run-seo', {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify({ url: config.url }),
                    });
                    if (!response.ok) throw new Error('SEO analysis failed');
                    const analysis = await response.json();
                    setRunningStatus(s => ({ ...s, seo: 'completed' }));
                    return { seo: analysis };
                } catch (e: any) {
                    setRunningStatus(s => ({ ...s, seo: 'failed' }));
                    toast({ variant: 'destructive', title: 'SEO Error', description: e.message });
                    return {};
                }
            })();
            otherTestPromises.push(seoPromise);
        }

        const allPromiseResults = await Promise.all([Promise.all(testPromises), Promise.all(otherTestPromises)]);
        const allResults = allPromiseResults.flat();
        const finalResults = allResults.reduce((acc, res) => ({ ...acc, ...res }), {});
        
        hasCompleted.current = true;
        onTestComplete(finalResults, serverGeneratedTestId);
    };

    runAllTests();

  }, []); // Run only once on mount
  
  const getStatusIcon = (status: string) => {
    switch(status) {
        case 'running': return <Loader className="h-4 w-4 animate-spin text-primary" />;
        case 'completed': return <CheckCircle className="h-4 w-4 text-green-500" />;
        case 'failed': return <XCircle className="h-4 w-4 text-destructive" />;
        default: return null;
    }
  }

  const allDone = Object.values(runningStatus).every(s => s !== 'running' && s !== 'pending');

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
            <div className="relative mx-auto flex items-center justify-center">
                <Loader className="h-12 w-12 text-primary animate-spin" />
            </div>
            <CardTitle>{allDone ? 'Finalizing Results...' : 'Tests in Progress...'}</CardTitle>
            <CardDescription>Your tests are running. Results will appear here when complete.</CardDescription>
          </>
        )}
      </CardHeader>
      <CardContent className="flex flex-col items-center gap-6">
        <div className='w-full space-y-2 text-left bg-muted/50 p-4 rounded-lg'>
            <p className='text-sm font-medium text-center mb-2'>Status:</p>
            <ul className='text-sm text-muted-foreground space-y-2'>
                {config.runLoadTest && <li className='flex items-center justify-between'><span>k6 Load Test</span> <span className='flex items-center gap-2 capitalize'>{getStatusIcon(runningStatus.k6)} {runningStatus.k6}</span></li>}
                {config.runLighthouse && <li className='flex items-center justify-between'><span>Lighthouse Audit</span> <span className='flex items-center gap-2 capitalize'>{getStatusIcon(runningStatus.lighthouse)} {runningStatus.lighthouse}</span></li>}
                {config.runSeo && <li className='flex items-center justify-between'><span>AI SEO Analysis</span> <span className='flex items-center gap-2 capitalize'>{getStatusIcon(runningStatus.seo)} {runningStatus.seo}</span></li>}
            </ul>
        </div>
        {config.runLoadTest && (
            <Button asChild size="lg" disabled={runningStatus.k6 === 'pending'}>
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
