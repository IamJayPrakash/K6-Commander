
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
  CheckCircle2,
  Gauge,
  Save,
  Play,
  Plus,
  Settings,
  ShieldCheck,
  Search as SearchIcon
} from 'lucide-react';
import type { TestConfiguration, TestResults } from '@/types';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import LighthouseSummaryReport from './lighthouse-summary';
import SeoSummaryReport from './seo-summary';
import K6SummaryReport from './k6-summary';

interface TestSummaryProps {
  results: TestResults;
  config: TestConfiguration;
  testId: string;
  onSaveToHistory: () => void;
  onRerun: () => void;
  onCreateNew: () => void;
}

export default function TestSummary({
  results,
  config,
  testId,
  onSaveToHistory,
  onRerun,
  onCreateNew,
}: TestSummaryProps) {
  
  const defaultTab = config.runLoadTest ? "k6" : (config.runLighthouse ? "lighthouse" : "seo");

  return (
    <div className="space-y-6">
       <Card data-testid="test-summary-header-card">
            <CardHeader>
                <CardTitle className="flex items-center gap-3 text-3xl">
                    <CheckCircle2 className="h-10 w-10 text-green-500" />
                    Test Run Complete
                </CardTitle>
                <CardDescription>
                    Summary of tests for: <span className="font-semibold text-primary">{config.url}</span>
                </CardDescription>
            </CardHeader>
            <CardContent>
                <div className="flex flex-col sm:flex-row gap-2">
                    <Button onClick={onSaveToHistory} data-testid="save-to-history-button"><Save className="mr-2 h-4 w-4" /> Save to History</Button>
                    <Button variant="outline" onClick={onRerun} data-testid="rerun-button"><Play className="mr-2 h-4 w-4" /> Run Again</Button>
                    <Button variant="secondary" onClick={onCreateNew} data-testid="new-test-button"><Plus className="mr-2 h-4 w-4" /> New Test</Button>
                </div>
            </CardContent>
       </Card>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
            <Tabs defaultValue={defaultTab} className="w-full">
                <TabsList className="grid w-full grid-cols-3" data-testid="results-tabs-list">
                    <TabsTrigger value="k6" disabled={!results.k6} data-testid="k6-results-tab-trigger"><Gauge className="mr-2 h-4 w-4" /> Load Test</TabsTrigger>
                    <TabsTrigger value="lighthouse" disabled={!results.lighthouse} data-testid="lighthouse-results-tab-trigger"><ShieldCheck className="mr-2 h-4 w-4" />Lighthouse</TabsTrigger>
                    <TabsTrigger value="seo" disabled={!results.seo} data-testid="seo-results-tab-trigger"><SearchIcon className="mr-2 h-4 w-4" />SEO</TabsTrigger>
                </TabsList>
                <TabsContent value="k6" data-testid="k6-results-tab-content">
                    {results.k6 ? <K6SummaryReport summary={results.k6} /> : <p>No load test data.</p>}
                </TabsContent>
                <TabsContent value="lighthouse" data-testid="lighthouse-results-tab-content">
                    {results.lighthouse ? <LighthouseSummaryReport summary={results.lighthouse} testId={testId} /> : <p>No Lighthouse audit data.</p>}
                </TabsContent>
                <TabsContent value="seo" data-testid="seo-results-tab-content">
                    {results.seo ? <SeoSummaryReport analysis={results.seo} /> : <p>No SEO analysis data.</p>}
                </TabsContent>
            </Tabs>
        </div>
        <div className="lg:col-span-1">
             <Card data-testid="test-config-summary-card">
                <CardHeader>
                    <CardTitle className="flex items-center gap-2"><Settings/> Test Configuration</CardTitle>
                </CardHeader>
                <CardContent>
                    <Table>
                        <TableBody>
                            <TableRow><TableHead className='w-1/3'>URL</TableHead><TableCell className="truncate max-w-[200px]"><span title={config.url}>{config.url}</span></TableCell></TableRow>
                            <TableRow><TableHead>Method</TableHead><TableCell>{config.method}</TableCell></TableRow>
                            <TableRow><TableHead>Preset</TableHead><TableCell className="capitalize">{config.testPreset}</TableCell></TableRow>
                            {config.testPreset === 'custom' && (
                                <>
                                    {config.vus && <TableRow><TableHead>VUs</TableHead><TableCell>{config.vus}</TableCell></TableRow>}
                                    {config.duration && <TableRow><TableHead>Duration</TableHead><TableCell>{config.duration}</TableCell></TableRow>}
                                </>
                            )}
                        </TableBody>
                    </Table>
                     <Accordion type="single" collapsible className="w-full mt-4">
                        <AccordionItem value="details">
                            <AccordionTrigger data-testid="config-details-accordion-trigger">View Full Details</AccordionTrigger>
                            <AccordionContent>
                               <Table>
                                    <TableBody>
                                         <TableRow><TableHead className='w-1/3'>Stages</TableHead><TableCell>
                                            <pre className="text-xs bg-muted p-2 rounded-md max-w-full overflow-auto">{JSON.stringify(config.stages, null, 2)}</pre>
                                        </TableCell></TableRow>
                                        <TableRow><TableHead>Headers</TableHead><TableCell>
                                            <pre className="text-xs bg-muted p-2 rounded-md max-w-full overflow-auto">{JSON.stringify(config.headers, null, 2)}</pre>
                                        </TableCell></TableRow>
                                        <TableRow><TableHead>Body</TableHead><TableCell>
                                            <pre className="text-xs bg-muted p-2 rounded-md max-w-full overflow-auto">{config.body || 'N/A'}</pre>
                                        </TableCell></TableRow>
                                    </TableBody>
                                </Table>
                            </AccordionContent>
                        </AccordionItem>
                    </Accordion>
                </CardContent>
            </Card>
        </div>
      </div>
    </div>
  );
}
