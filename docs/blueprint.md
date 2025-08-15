# **App Name**: K6 Commander

## Core Features:

- Test Configuration Form: Allow users to input target URL, HTTP method, headers, body, VUs, duration, and stages for load tests via a web form.
- Load Test Presets: Present pre-defined load test types (Baseline, Spike, Stress, Soak) with sensible default configurations that users can customize.
- K6 Test Execution: Backend service that spawns containerized k6 tests using user-defined configurations.
- Metrics Aggregation: Collects k6 metrics using InfluxDB.
- Real-time Dashboards: Provides links to live Grafana dashboards, pre-configured to display key metrics like RPS, latency, error rates, VUs, and throughput.
- Test Summary Reports: Generates summary reports from k6 JSON output, presenting aggregated stats, charts and run configurations.
- Test History and Reports: Enables test history to be saved, re-run, exported, and imported to/from the browser's LocalStorage, and offer client-side report downloads.

## Style Guidelines:

- Primary color: Electric blue (#7DF9FF), representing energy and speed.
- Background color: Dark gray (#28282B) for a modern, high-tech feel.
- Accent color: Vivid purple (#BE34EB) to draw attention to key metrics and actions.
- Body and headline font: 'Inter', a grotesque-style sans-serif known for its neutral and readable design.
- Use clean, outlined icons from a consistent set (e.g., Remix Icon or Feather) for navigation, test controls, and data visualization.
- Emphasize a clean, single-page dashboard layout to showcase charts and metrics. Employ clear section dividers, spacing, and visual hierarchy to prioritize critical info at-a-glance.
- Integrate subtle animations, like loading spinners, chart transitions, and data updates, to signal progress, ensure responsiveness, and create a polished, high-tech feel.
