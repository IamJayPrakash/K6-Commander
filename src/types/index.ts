export type TestPreset = 'baseline' | 'spike' | 'stress' | 'soak';

export interface TestConfiguration {
  url: string;
  method: 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH';
  headers: Record<string, string>;
  body: string;
  testPreset: TestPreset | 'custom';
  stages: {
    duration: string;
    target: number;
  }[];
  vus: number;
  duration: string;
  runLoadTest: boolean;
  runLighthouse: boolean;
  runSeo: boolean;
}

export interface K6Metric {
  type: 'counter' | 'gauge' | 'rate' | 'trend';
  contains: 'time' | 'default' | 'data';
  values: {
    'p(90)': number;
    'p(95)': number;
    avg: number;
    min: number;
    med: number;
    max: number;
    count?: number;
    passes?: number;
    fails?: number;
    rate?: number;
  };
}

export interface K6Summary {
  root_group: {
    path: string;
    groups: any[];
    checks: any[];
  };
  metrics: {
    vus: K6Metric;
    vus_max: K6Metric;
    http_reqs: K6Metric;
    http_req_duration: K6Metric;
    http_req_failed: K6Metric;
    http_req_receiving: K6Metric;
    http_req_sending: K6Metric;
    http_req_waiting: K6Metric;
    http_req_blocked: K6Metric;
    http_req_connecting: K6Metric;
    http_req_tls_handshaking: K6Metric;
    data_received: K6Metric;
    data_sent: K6Metric;
    iteration_duration: K6Metric;
    iterations: K6Metric;
  };
}

export interface LighthouseCategory {
  id: string;
  title: string;
  score: number;
}

export interface LighthouseSummary {
  requestedUrl: string;
  finalUrl: string;
  fetchTime: string;
  categories: {
    performance: LighthouseCategory;
    accessibility: LighthouseCategory;
    'best-practices': LighthouseCategory;
    seo: LighthouseCategory;
  };
}

export interface SeoAnalysisItem {
  name: string;
  value: string | null;
  status: 'pass' | 'fail' | 'warning';
  recommendation: string | null;
}

export interface SeoAnalysis {
  analysis: SeoAnalysisItem[];
  rawHtml: string;
}

export interface TestResults {
  k6?: K6Summary;
  lighthouse?: LighthouseSummary;
  seo?: SeoAnalysis;
}

export interface HistoryItem {
  id: string;
  timestamp: string;
  config: TestConfiguration;
  results: TestResults;
}
