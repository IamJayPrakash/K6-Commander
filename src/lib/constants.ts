import type { TestConfiguration } from '@/types';

type PresetConfig = Pick<TestConfiguration, 'stages' | 'vus' | 'duration'>;

export const APP_CONFIG = {
  githubUrl: 'https://github.com/your-username/k6-commander',
  contactEmail: '[INSERT CONTACT METHOD]',
  bugReportUrl: 'https://github.com/your-username/k6-commander/issues/new?template=bug_report.md',
  featureRequestUrl:
    'https://github.com/your-username/k6-commander/issues/new?template=feature_request.md',
};

export const TEST_PRESETS: Record<string, PresetConfig> = {
  baseline: {
    vus: 10,
    duration: '5m',
    stages: [
      { duration: '1m', target: 10 },
      { duration: '3m', target: 10 },
      { duration: '1m', target: 0 },
    ],
  },
  spike: {
    vus: 100,
    duration: '2m',
    stages: [
      { duration: '10s', target: 20 },
      { duration: '30s', target: 100 },
      { duration: '10s', target: 20 },
      { duration: '30s', target: 100 },
      { duration: '10s', target: 0 },
    ],
  },
  stress: {
    vus: 200,
    duration: '10m',
    stages: [
      { duration: '2m', target: 50 },
      { duration: '1m', target: 50 },
      { duration: '2m', target: 100 },
      { duration: '1m', target: 100 },
      { duration: '2m', target: 200 },
      { duration: '1m', target: 200 },
      { duration: '1m', target: 0 },
    ],
  },
  soak: {
    vus: 50,
    duration: '30m',
    stages: [
      { duration: '2m', target: 50 },
      { duration: '26m', target: 50 },
      { duration: '2m', target: 0 },
    ],
  },
};

export const TECH_STACK = [
  {
    name: 'Frontend',
    value: 'Next.js & React',
    description: 'For a fast, server-rendered user interface.',
  },
  {
    name: 'Styling',
    value: 'Tailwind CSS',
    description: 'A utility-first CSS framework for rapid UI development.',
  },
  {
    name: 'UI Components',
    value: 'shadcn/ui',
    description: 'Beautifully designed, accessible, and reusable components.',
  },
  {
    name: 'AI Integration',
    value: 'Genkit',
    description: 'Powers the AI-driven SEO analysis and recommendations.',
  },
  {
    name: 'Load Testing',
    value: 'k6',
    description: 'A powerful, open-source load testing tool from Grafana Labs.',
  },
  {
    name: 'Auditing',
    value: 'Lighthouse',
    description: "Google's automated tool for improving web page quality.",
  },
  {
    name: 'Metrics DB',
    value: 'InfluxDB',
    description: 'A time-series database for storing k6 test metrics.',
  },
  {
    name: 'Dashboards',
    value: 'Grafana',
    description: 'The open standard for beautiful analytics and monitoring.',
  },
  {
    name: 'Orchestration',
    value: 'Docker',
    description: 'To containerize and run all services in an isolated environment.',
  },
];

export const TOUR_STEPS = [
  {
    target: '[data-testid="home-link"]',
    content: 'tour.steps.welcome',
  },
  {
    target: '[data-testid="header-history-link"]',
    content: 'tour.steps.history',
  },
  {
    target: '[data-testid="header-about-link"]',
    content: 'tour.steps.about',
  },
  {
    target: '[data-testid="github-link"]',
    content: 'tour.steps.github',
  },
  {
    target: 'form [name="url"]',
    content: 'tour.steps.urlInput',
  },
  {
    target: '.test-suites',
    content: 'tour.steps.testSuites',
  },
  {
    target: '.request-config',
    content: 'tour.steps.requestConfig',
  },
  {
    target: '.load-test-profile',
    content: 'tour.steps.loadProfile',
  },
  {
    target: 'button[type="submit"]',
    content: 'tour.steps.runTest',
  },
];
