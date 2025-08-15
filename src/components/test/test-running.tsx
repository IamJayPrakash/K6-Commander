'use client';

import { useEffect, useState, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { ExternalLink, Loader, XCircle } from 'lucide-react';
import type { K6Summary } from '@/types';
import { useToast } from '@/hooks/use-toast';

interface TestRunningProps {
  testId: string;
  onTestComplete: (summary: K6Summary) => void;
}

const POLLING_INTERVAL = 3000; // 3 seconds
const MAX_POLLING_ATTEMPTS = 600; // 3s * 600 = 30 minutes

export default function TestRunning({ testId, onTestComplete }: TestRunningProps) {
  const [progress, setProgress] = useState(0);
  const [error, setError] = useState<string | null>(null);
  const attempts = useRef(0);
  const { toast } = useToast();

  const grafanaUrl = `${window.location.protocol}//${window.location.hostname}:3003/d/k6/k6-load-testing-results?orgId=1&var-testid=${testId}&refresh=5s`;

  useEffect(() => {
    const pollForSummary = async () => {
      if (attempts.current >= MAX_POLLING_ATTEMPTS) {
        setError('Test timed out. The test ran for too long or failed to start.');
        toast({
          variant: 'destructive',
          title: 'Test Timed Out',
          description: 'Please check the container logs for more details.',
        });
        return;
      }

      try {
        const response = await fetch(`/api/check-summary/${testId}`);

        if (response.ok) {
          const summary: K6Summary = await response.json();
          setProgress(100);
          onTestComplete(summary);
          return; // Stop polling
        }
        
        if (response.status === 404) {
          // File not found, continue polling
          attempts.current += 1;
          setProgress((attempts.current / MAX_POLLING_ATTEMPTS) * 100);
          setTimeout(pollForSummary, POLLING_INTERVAL);
        } else {
           const errorData = await response.json();
           throw new Error(errorData.error || `Server responded with status ${response.status}`);
        }
      } catch (err) {
        console.error('Polling error:', err);
        setError(err instanceof Error ? err.message : 'An unknown error occurred while checking test status.');
        toast({
            variant: 'destructive',
            title: 'Polling Error',
            description: err instanceof Error ? err.message : 'Could not retrieve test status.',
        });
      }
    };

    setTimeout(pollForSummary, POLLING_INTERVAL);
    
  }, [testId, onTestComplete, toast]);

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
            <CardTitle>Test in Progress...</CardTitle>
            <CardDescription>Your load test is running. You can monitor the progress live in Grafana.</CardDescription>
          </>
        )}
      </CardHeader>
      <CardContent className="flex flex-col items-center gap-6">
        {!error && (
            <>
                <div className="w-full space-y-2">
                    <Progress value={progress} />
                    <p className="text-xs text-muted-foreground text-center">Checking for results... (ID: {testId})</p>
                </div>
                <Button asChild size="lg">
                    <a href={grafanaUrl} target="_blank" rel="noopener noreferrer">
                        <ExternalLink className="mr-2 h-4 w-4" />
                        View Live Grafana Dashboard
                    </a>
                </Button>
            </>
        )}
      </CardContent>
    </Card>
  );
}
