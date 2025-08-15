
'use client';

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { CheckCircle, XCircle, AlertCircle, HelpCircle } from 'lucide-react';
import type { SeoAnalysis, SeoCheck } from '@/types';

interface SeoSummaryProps {
  analysis: SeoAnalysis;
}

const CheckItem = ({ label, check }: { label: string, check: SeoCheck & { text?: string | null; length?: number, url?: string | null } }) => {
    let Icon;
    let colorClass;
    let description;
    
    switch(check.status) {
        case 'pass':
            Icon = CheckCircle;
            colorClass = 'text-green-500';
            break;
        case 'fail':
            Icon = XCircle;
            colorClass = 'text-red-500';
            break;
        case 'warning':
            Icon = AlertCircle;
            colorClass = 'text-yellow-500';
            break;
        default:
            Icon = HelpCircle;
            colorClass = 'text-muted-foreground';
    }

    if(label === 'Title') {
        description = check.text ? `${check.text} (${check.length} chars)` : 'Missing title tag.';
    } else if (label === 'Meta Description') {
        description = check.text ? `${check.text} (${check.length} chars)` : 'Missing meta description.';
    } else if (label === 'H1 Heading') {
        description = check.text ? `"${check.text}"` : 'Missing H1 heading.';
    } else if (label === 'Canonical Tag') {
        if(check.status === 'pass') {
            description = `Matches URL: ${check.url}`;
        } else if (check.status === 'warning') {
            description = `Mismatch: ${check.url}`;
        } else if (check.status === 'fail') {
            description = 'Missing canonical tag.';
        }
    }


    return (
        <div className="flex items-start gap-4">
            <Icon className={`h-5 w-5 mt-1 flex-shrink-0 ${colorClass}`} />
            <div>
                <h4 className="font-semibold">{label}</h4>
                <p className="text-sm text-muted-foreground">{description}</p>
            </div>
        </div>
    )
}

export default function SeoSummaryReport({
  analysis,
}: SeoSummaryProps) {
  
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <CheckCircle className="h-6 w-6 text-primary" /> Basic SEO Checklist
        </CardTitle>
        <CardDescription>
          A quick check of on-page SEO fundamentals.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <CheckItem label="Title" check={analysis.title} />
        <CheckItem label="Meta Description" check={analysis.description} />
        <CheckItem label="H1 Heading" check={analysis.h1} />
        <CheckItem label="Canonical Tag" check={analysis.canonical} />
      </CardContent>
    </Card>
  );
}
