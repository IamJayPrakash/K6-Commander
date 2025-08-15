
'use client';

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import {
  ShieldCheck,
  CircleGauge,
  Accessibility,
  Wrench,
  Search,
  ExternalLink
} from 'lucide-react';
import type { LighthouseSummary } from '@/types';
import { Progress } from '@/components/ui/progress';

interface LighthouseSummaryProps {
  summary: LighthouseSummary;
  testId: string;
}

const ScoreCircle = ({ score, label }: { score: number, label: string }) => {
    const getScoreColor = (s: number) => {
        if (s >= 90) return 'text-green-500';
        if (s >= 50) return 'text-yellow-500';
        return 'text-red-500';
    }
    const colorClass = getScoreColor(score);

    return (
        <div className="flex flex-col items-center gap-2">
            <div className={`relative h-24 w-24 flex items-center justify-center font-bold text-3xl ${colorClass}`}>
                <svg className="absolute inset-0" viewBox="0 0 36 36">
                    <path
                        className="text-muted/20"
                        d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="4"
                    />
                    <path
                        className="transition-all duration-500"
                        d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="4"
                        strokeDasharray={`${score}, 100`}
                    />
                </svg>
                {score}
            </div>
            <span className="font-semibold">{label}</span>
        </div>
    )
}

export default function LighthouseSummaryReport({
  summary,
  testId,
}: LighthouseSummaryProps) {
  
  const reportUrl = `/results/lighthouse-${testId}.report.html`;

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <ShieldCheck className="h-6 w-6 text-primary" /> Lighthouse Audit
        </CardTitle>
        <CardDescription>
          A summary of the official Google Lighthouse audit. Click the button below to view the full, detailed HTML report.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 justify-items-center">
            <ScoreCircle key="performance" score={Math.round(summary.categories.performance.score * 100)} label="Performance" />
            <ScoreCircle key="accessibility" score={Math.round(summary.categories.accessibility.score * 100)} label="Accessibility" />
            <ScoreCircle key="best-practices" score={Math.round(summary.categories['best-practices'].score * 100)} label="Best Practices" />
            <ScoreCircle key="seo" score={Math.round(summary.categories.seo.score * 100)} label="SEO" />
        </div>
        <div className="flex justify-center">
            <Button asChild>
                <a href={reportUrl} target="_blank" rel="noopener noreferrer">
                    <ExternalLink className="mr-2 h-4 w-4" />
                    View Full Lighthouse Report
                </a>
            </Button>
        </div>
      </CardContent>
    </Card>
  );
}
