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
  HeartPulse,
  Save,
  Clock,
  Users,
  AlertTriangle,
  Play,
  Plus,
  BarChart,
  Settings
} from 'lucide-react';
import type { K6Summary, TestConfiguration } from '@/types';
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  ChartConfig,
} from '@/components/ui/chart';
import { Bar, BarChart as RechartsBarChart, XAxis, YAxis, Cell } from 'recharts';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';

interface TestSummaryProps {
  summary: K6Summary;
  config: TestConfiguration;
  onSaveToHistory: () => void;
  onRerun: () => void;
  onCreateNew: () => void;
}

const chartConfig = {
  p95: { label: 'p(95)', color: 'hsl(var(--chart-1))' },
  p90: { label: 'p(90)', color: 'hsl(var(--chart-2))' },
  avg: { label: 'Average', color: 'hsl(var(--chart-3))' },
  med: { label: 'Median', color: 'hsl(var(--chart-4))' },
  min: { label: 'Min', color: 'hsl(var(--chart-5))' },
  max: { label: 'Max', color: 'hsl(var(--chart-1))' },
} satisfies ChartConfig;


const MetricCard = ({ icon, title, value, unit, description }: { icon: React.ReactNode, title: string, value: string, unit?: string, description: string }) => (
    <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">{title}</CardTitle>
            <div className="text-muted-foreground">{icon}</div>
        </CardHeader>
        <CardContent>
            <div className="text-2xl font-bold">
                {value}
                {unit && <span className="text-xs text-muted-foreground ml-1">{unit}</span>}
            </div>
            <p className="text-xs text-muted-foreground">{description}</p>
        </CardContent>
    </Card>
)

export default function TestSummary({
  summary,
  config,
  onSaveToHistory,
  onRerun,
  onCreateNew,
}: TestSummaryProps) {
  const metrics = summary.metrics;
  const totalRequests = metrics.http_reqs.values.count || 0;
  const failureRate = metrics.http_req_failed.values.rate || 0;
  const failedRequests = Math.round(totalRequests * failureRate);

  const durationData = [
    { name: 'p(95)', value: metrics.http_req_duration.values['p(95)'] },
    { name: 'p(90)', value: metrics.http_req_duration.values['p(90)'] },
    { name: 'avg', value: metrics.http_req_duration.values.avg },
    { name: 'med', value: metrics.http_req_duration.values.med },
    { name: 'min', value: metrics.http_req_duration.values.min },
    { name: 'max', value: metrics.http_req_duration.values.max },
  ];
  
  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row gap-4 justify-between items-start">
        <div>
            <CardTitle className="flex items-center gap-2 text-3xl">
                <CheckCircle2 className="h-10 w-10 text-green-500" />
                Test Complete
            </CardTitle>
            <CardDescription className="mt-2">
                Summary of the load test for: {config.url}
            </CardDescription>
        </div>
        <div className="flex gap-2 flex-shrink-0">
          <Button onClick={onSaveToHistory}><Save className="mr-2 h-4 w-4" /> Save to History</Button>
          <Button variant="outline" onClick={onRerun}><Play className="mr-2 h-4 w-4" /> Run Again</Button>
          <Button variant="secondary" onClick={onCreateNew}><Plus className="mr-2 h-4 w-4" /> New Test</Button>
        </div>
      </div>
      
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <MetricCard icon={<Gauge className="h-4 w-4"/>} title="Requests per Second" value={(metrics.http_reqs.values.rate || 0).toFixed(2)} description="Average requests processed" />
        <MetricCard icon={<HeartPulse className="h-4 w-4"/>} title="Avg. Response Time" value={(metrics.http_req_duration.values.avg || 0).toFixed(2)} unit="ms" description={`p(95): ${metrics.http_req_duration.values['p(95)'].toFixed(2)}ms`} />
        <MetricCard icon={<Users className="h-4 w-4"/>} title="Total Requests" value={totalRequests.toLocaleString()} description="Across all virtual users" />
        <MetricCard icon={<AlertTriangle className="h-4 w-4"/>} title="Failed Requests" value={`${failedRequests.toLocaleString()} (${(failureRate * 100).toFixed(2)}%)`} description="Requests that did not pass checks" />
      </div>

      <Card>
          <CardHeader>
              <CardTitle className="flex items-center gap-2"><BarChart/> Latency Distribution</CardTitle>
              <CardDescription>Response time percentiles in milliseconds (ms).</CardDescription>
          </CardHeader>
          <CardContent>
            <ChartContainer config={chartConfig} className="h-[250px] w-full">
                <RechartsBarChart data={durationData} accessibilityLayer>
                    <XAxis dataKey="name" tickLine={false} axisLine={false} tickMargin={8} />
                    <YAxis tickLine={false} axisLine={false} tickMargin={8} unit="ms" />
                    <ChartTooltip content={<ChartTooltipContent />} />
                    <Bar dataKey="value" radius={4}>
                       {durationData.map((entry) => (
                         <Cell key={`cell-${entry.name}`} fill={chartConfig[entry.name as keyof typeof chartConfig]?.color} />
                       ))}
                    </Bar>
                </RechartsBarChart>
            </ChartContainer>
          </CardContent>
      </Card>
      
      <Accordion type="single" collapsible>
        <AccordionItem value="config">
            <AccordionTrigger>
                <div className="flex items-center gap-2"><Settings/> View Test Configuration</div>
            </AccordionTrigger>
            <AccordionContent>
                <Card>
                    <CardContent className="pt-6">
                        <Table>
                            <TableBody>
                                <TableRow><TableHead>URL</TableHead><TableCell>{config.url}</TableCell></TableRow>
                                <TableRow><TableHead>Method</TableHead><TableCell>{config.method}</TableCell></TableRow>
                                <TableRow><TableHead>Test Preset</TableHead><TableCell className="capitalize">{config.testPreset}</TableCell></TableRow>
                                {config.testPreset === 'custom' && (
                                    <>
                                        <TableRow><TableHead>VUs</TableHead><TableCell>{config.vus}</TableCell></TableRow>
                                        <TableRow><TableHead>Duration</TableHead><TableCell>{config.duration}</TableCell></TableRow>
                                    </>
                                )}
                                <TableRow><TableHead>Stages</TableHead><TableCell>
                                    <pre className="text-xs bg-muted p-2 rounded-md">{JSON.stringify(config.stages, null, 2)}</pre>
                                </TableCell></TableRow>
                                <TableRow><TableHead>Headers</TableHead><TableCell>
                                    <pre className="text-xs bg-muted p-2 rounded-md">{JSON.stringify(config.headers, null, 2)}</pre>
                                </TableCell></TableRow>
                                <TableRow><TableHead>Body</TableHead><TableCell>
                                    <pre className="text-xs bg-muted p-2 rounded-md">{config.body || 'N/A'}</pre>
                                </TableCell></TableRow>
                            </TableBody>
                        </Table>
                    </CardContent>
                </Card>
            </AccordionContent>
        </AccordionItem>
      </Accordion>

    </div>
  );
}
