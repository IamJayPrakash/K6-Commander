
'use client';

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { CheckCircle, XCircle, AlertCircle, Sparkles, BrainCircuit } from 'lucide-react';
import type { SeoAnalysis } from '@/types';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '../ui/accordion';

interface SeoSummaryProps {
  analysis: SeoAnalysis;
}

const AnalysisItem = ({ item }: { item: SeoAnalysis['analysis'][0] }) => {
    let Icon;
    let colorClass;
    
    switch(item.status) {
        case 'pass':
            Icon = CheckCircle;
            colorClass = 'text-green-500';
            break;
        case 'fail':
            Icon = XCircle;
            colorClass = 'text-red-500';
            break;
        case 'warning':
        default:
            Icon = AlertCircle;
            colorClass = 'text-yellow-500';
            break;
    }

    return (
        <div className="flex flex-col gap-2 rounded-lg border p-4">
            <div className="flex items-center gap-3">
                <Icon className={`h-6 w-6 flex-shrink-0 ${colorClass}`} />
                <div className='flex-1 min-w-0'>
                    <h4 className="font-semibold text-base">{item.name}</h4>
                    <p className="text-sm text-muted-foreground break-words">
                        {item.value ? item.value : <span className="italic">Not found</span>}
                    </p>
                </div>
            </div>
            {item.recommendation && (
                 <div className="mt-2 text-sm text-foreground/80 border-t pt-3 flex items-start gap-3">
                    <Sparkles className="h-5 w-5 text-accent flex-shrink-0 mt-0.5" />
                    <div>
                        <h5 className="font-semibold text-accent/90">AI Recommendation</h5>
                        <p className='text-muted-foreground'>{item.recommendation}</p>
                    </div>
                </div>
            )}
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
          <BrainCircuit className="h-6 w-6 text-primary" /> AI-Powered SEO Analysis
        </CardTitle>
        <CardDescription>
          A deep analysis of on-page SEO factors with AI-powered recommendations for improvement.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid md:grid-cols-2 gap-4">
            {analysis.analysis.map((item) => (
                <AnalysisItem key={item.name} item={item} />
            ))}
        </div>

        <Accordion type="single" collapsible className="w-full pt-4">
            <AccordionItem value="raw-html">
                <AccordionTrigger>View Raw HTML Content</AccordionTrigger>
                <AccordionContent>
                    <pre className="text-xs bg-muted p-4 rounded-md max-h-96 overflow-auto">
                        <code>
                            {analysis.rawHtml}
                        </code>
                    </pre>
                </AccordionContent>
            </AccordionItem>
        </Accordion>

      </CardContent>
    </Card>
  );
}
