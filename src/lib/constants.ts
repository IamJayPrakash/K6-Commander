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
