
import type { TestConfiguration } from '@/types';

type PresetConfig = Pick<TestConfiguration, 'stages' | 'vus' | 'duration'>;

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

export const TOUR_STEPS = [
  {
    target: '[data-testid="home-link"]',
    content: 'Welcome to K6 Commander! This is the main navigation header. Click here to always return to this main test form page.',
    disableBeacon: true,
  },
   {
    target: '[data-testid="header-history-link"]',
    content: 'View your past test runs, load previous configurations, or export your entire test history from the History page.',
  },
  {
    target: '[data-testid="header-about-link"]',
    content: 'Learn more about how K6 Commander works under the hood on the About page.',
  },
   {
    target: '[data-testid="github-link"]',
    content: 'Check out the source code, report issues, or contribute to the project on GitHub.',
  },
  {
    target: 'form [name="url"]',
    content: 'Start by entering the full URL of the page or API endpoint you want to test.',
  },
  {
    target: '.test-suites',
    content: 'Select one or more test suites to run. You can run a Load Test, a Lighthouse Audit, or an AI-powered SEO analysis.',
  },
  {
    target: '.request-config',
    content: 'If you are running a load test, you can configure the HTTP Method, add custom headers, and include a request body for POST/PUT requests.',
  },
  {
    target: '.load-test-profile',
    content: 'Choose a pre-configured load test profile, or select "Custom" to define your own virtual users, duration, or ramping stages.',
  },
  {
    target: 'button[type="submit"]',
    content: 'Once everything is configured, click here to run your tests!',
  },
];
