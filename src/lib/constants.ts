
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
    target: 'form [name="url"]',
    content: 'Start by entering the full URL of the page or API endpoint you want to test.',
    disableBeacon: true,
  },
  {
    target: '.test-suites',
    content: 'Select one or more test suites to run. You can run a Load Test, a Lighthouse Audit, or a Basic SEO check.',
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
