'use client';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Gauge, HeartPulse, Users, AlertTriangle, BarChart } from 'lucide-react';
import type { K6Summary } from '@/types';
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  ChartConfig,
} from '@/components/ui/chart';
import { Bar, BarChart as RechartsBarChart, XAxis, YAxis, Cell } from 'recharts';

interface K6SummaryReportProps {
  summary: K6Summary;
}

const chartConfig = {
  p95: { label: 'p(95)', color: 'hsl(var(--chart-1))' },
  p90: { label: 'p(90)', color: 'hsl(var(--chart-2))' },
  avg: { label: 'Average', color: 'hsl(var(--chart-3))' },
  med: { label: 'Median', color: 'hsl(var(--chart-4))' },
  min: { label: 'Min', color: 'hsl(var(--chart-5))' },
  max: { label: 'Max', color: 'hsl(var(--chart-1))' },
} satisfies ChartConfig;

const MetricCard = ({
  icon,
  title,
  value,
  unit,
  description,
}: {
  icon: React.ReactNode;
  title: string;
  value: string;
  unit?: string;
  description: string;
}) => (
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
);

export default function K6SummaryReport({ summary }: K6SummaryReportProps) {
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
    <Card>
      <CardHeader>
        <CardTitle>Load Test Results</CardTitle>
        <CardDescription>Performance metrics from the k6 load test.</CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-2">
          <MetricCard
            icon={<Gauge className="h-4 w-4" />}
            title="Requests per Second"
            value={(metrics.http_reqs.values.rate || 0).toFixed(2)}
            description="Average requests processed"
          />
          <MetricCard
            icon={<HeartPulse className="h-4 w-4" />}
            title="Avg. Response Time"
            value={(metrics.http_req_duration.values.avg || 0).toFixed(2)}
            unit="ms"
            description={`p(95): ${metrics.http_req_duration.values['p(95)'].toFixed(2)}ms`}
          />
          <MetricCard
            icon={<Users className="h-4 w-4" />}
            title="Total Requests"
            value={totalRequests.toLocaleString()}
            description="Across all virtual users"
          />
          <MetricCard
            icon={<AlertTriangle className="h-4 w-4" />}
            title="Failed Requests"
            value={`${failedRequests.toLocaleString()} (${(failureRate * 100).toFixed(2)}%)`}
            description="Requests that did not pass checks"
          />
        </div>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <BarChart /> Latency Distribution
            </CardTitle>
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
                    <Cell
                      key={`cell-${entry.name}`}
                      fill={chartConfig[entry.name as keyof typeof chartConfig]?.color}
                    />
                  ))}
                </Bar>
              </RechartsBarChart>
            </ChartContainer>
          </CardContent>
        </Card>
      </CardContent>
    </Card>
  );
}
