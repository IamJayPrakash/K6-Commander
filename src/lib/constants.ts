
import type { TestConfiguration } from '@/types';

type PresetConfig = Pick<TestConfiguration, 'stages' | 'vus' | 'duration'>;

export const APP_CONFIG = {
  githubUrl: 'https://github.com/your-username/k6-commander',
  contactEmail: '[INSERT CONTACT METHOD]',
  bugReportUrl: 'https://github.com/your-username/k6-commander/issues/new?template=bug_report.md',
  featureRequestUrl: 'https://github.com/your-username/k6-commander/issues/new?template=feature_request.md',
};

export const TEXT_CONSTANTS = {
  // App Header
  headerTitle: 'K6 Commander',
  historyLink: 'History',
  aboutLink: 'About',
  startTourButton: 'Start Tour',

  // App Footer
  footerCopyright: `K6 Commander © ${new Date().getFullYear()}`,
  termsLink: 'Terms of Service',
  privacyLink: 'Privacy Policy',
  securityLink: 'Security',

  // Test Form
  formTitle: 'New Test Run',
  formDescription: 'Configure and launch performance and SEO audits.',
  urlLabel: 'Target Endpoint',
  urlDescription: 'The full URL of the API endpoint or page to test.',
  urlPlaceholder: 'https://your-api.com/v1/users',
  testSuitesTitle: 'Test Suites',
  testSuitesDescription: 'Select which tests you would like to run.',
  k6SwitchLabel: 'k6 Load Test',
  k6SwitchDescription: 'Simulate traffic to measure performance under pressure.',
  lighthouseSwitchLabel: 'Lighthouse Audit',
  lighthouseSwitchDescription: "Run Google's Lighthouse to check PWA, SEO, and more.",
  seoSwitchLabel: 'AI-Powered SEO Analysis',
  seoSwitchDescription: 'Deep-dive analysis of on-page factors with AI suggestions.',
  requestConfigTitle: 'Request Configuration',
  requestConfigDescription: 'Define the HTTP request details for the load test.',
  methodLabel: 'HTTP Method',
  headersLabel: 'Headers',
  addHeaderButton: 'Add Header',
  requestBodyLabel: 'Request Body',
  loadProfileTitle: 'Load Test Profile',
  loadProfileDescription: 'Choose a preset or define a custom load profile.',
  customProfileTitle: 'Custom Load Profile',
  customProfileDescription: 'Manually set Virtual Users (VUs) and duration, or define ramping stages.',
  vusLabel: 'Virtual Users (VUs)',
  durationLabel: 'Test Duration',
  stagesLabel: 'Ramping Stages',
  stagesDescription: 'Define ramping stages for VUs. This overrides fixed VUs and Duration.',
  addStageButton: 'Add Stage',
  runTestButton: 'Run Test(s)',
  runningTestButton: 'Starting Tests...',
  clearHistoryDialogTitle: 'Before you run...',
  clearHistoryDialogDescription: 'Would you like to clear your local test history before starting this new run? This can be useful to start a session with a clean slate.',
  clearHistoryDialogKeepButton: "Don't Clear",
  clearHistoryDialogClearButton: 'Clear History & Run',

  // Test Running
  runningTitle: 'Tests in Progress...',
  runningDescription: 'Your tests are running. Results will appear here when complete.',
  finalizingTitle: 'Finalizing Results...',
  grafanaLink: 'View Live Grafana Dashboard',

  // Test Summary
  summaryTitle: 'Test Run Complete',
  summaryDescription: 'Summary of tests for:',
  saveToHistoryButton: 'Save to History',
  rerunButton: 'Run Again',
  newTestButton: 'New Test',
  k6Tab: 'Load Test',
  lighthouseTab: 'Lighthouse',
  seoTab: 'SEO',
  configSummaryTitle: 'Test Configuration',
  viewFullDetails: 'View Full Details',
  
  // History Page
  historyTitle: 'Test History',
  historyDescription: 'Review, re-run, or manage your past test sessions. All data is stored in your browser.',
  importButton: 'Import',
  exportButton: 'Export',
  clearAllButton: 'Clear All',
  clearAllDialogTitle: 'Are you absolutely sure?',
  clearAllDialogDescription: 'This will permanently delete all test runs from your history. This action cannot be undone.',
  clearAllDialogConfirm: 'Yes, delete all',
  deleteDialogTitle: 'Are you sure?',
  deleteDialogDescription: 'This action will permanently delete this test run.',
  deleteDialogConfirm: 'Delete',
  noHistoryMessage: 'No test history found.',

  // About Page
  aboutTitle: 'K6 Commander: Your Local Test Ops Center',
  aboutDescription: 'A powerful, local-first testing platform designed for developers to ensure applications are performant, accessible, and SEO-friendly without the complexity of cloud services.',
  philosophyTitle: 'Core Philosophy: Local & Powerful',
  localFirstTitle: 'Local First Data',
  localFirstDescription: "Your test configurations, history, and results are stored exclusively in your browser's LocalStorage. No cloud accounts, no data transmission, full privacy.",
  unifiedToolingTitle: 'Unified Tooling',
  unifiedToolingDescription: 'Access sophisticated load testing, detailed web audits, and essential SEO checks from a single, cohesive interface, orchestrated seamlessly with Docker.',
  k6FeatureTitle: 'k6 Load Testing',
  k6FeatureDescription: 'Simulate traffic to find performance bottlenecks before your users do.',
  k6HowItWorks: "<strong>How it Works:</strong> K6 Commander abstracts the complexity of running load tests. When you configure a test in the UI, the application dynamically generates a k6 JavaScript file. It then spins up a dedicated `grafana/k6` Docker container, passing your configuration (URL, method, headers, VUs, stages, etc.) as environment variables.",
  k6HowItWorks2: "As the test runs, the k6 engine sends detailed performance metrics (like `http_req_duration`, `http_req_failed`, `vus`) over the local Docker network to an InfluxDB container. InfluxDB, a high-performance time-series database, stores this data. Simultaneously, a pre-configured Grafana instance queries InfluxDB in real-time, displaying live charts and statistics on a dashboard. This gives you immediate insight into how your application performs under stress.",
  lighthouseFeatureTitle: 'Lighthouse Audits',
  lighthouseFeatureDescription: "Audit for performance, accessibility, best practices, and SEO with Google's industry-standard tool.",
  lighthouseHowItWorks: "<strong>How it Works:</strong> This feature leverages Google Lighthouse directly, executed within the application's backend environment. When you start a Lighthouse audit, the server spawns a new process running `npx lighthouse`. It programmatically launches a headless instance of Google Chrome to navigate to your target URL and collect data.",
  lighthouseHowItWorks2: "Lighthouse then runs its full suite of audits, analyzing everything from page load performance and image optimization to accessibility standards (ARIA attributes, color contrast) and basic SEO checks. The results are saved as both a JSON object for the summary view in the UI and a full, interactive HTML report that you can open for a granular, shareable deep-dive into every metric and recommendation.",
  seoFeatureTitle: 'AI-Powered SEO Analysis',
  seoFeatureDescription: 'Go beyond basic checks with a deep, AI-driven analysis of on-page SEO factors.',
  seoHowItWorks: "<strong>How it Works:</strong> This isn't just a simple tag checker; it's an AI agent. When you initiate an SEO analysis, a Genkit flow is triggered. This flow first fetches the raw HTML content of the target URL. It then sends this HTML to the Gemini Pro model with a specialized, engineered prompt.",
  seoHowItWorks2: "This prompt instructs the AI to act as an expert Technical SEO Analyst. It analyzes the content for critical elements like title tags, meta descriptions, H1 headings, canonical URLs, and Open Graph tags. For each element, it determines if it's present and optimal. If an element is missing or could be improved (e.g., a title tag is too long), the AI generates a concise, actionable recommendation, providing you with expert-level advice on how to fix it.",
  stackTitle: 'Technology Stack',
  stackDescription: 'Built with modern, powerful, and developer-friendly technologies.',
  involvedTitle: 'Getting Involved',
  involvedDescription: 'K6 Commander is an open-source project. We welcome contributions of all kinds, from bug reports and feature requests to code contributions.',
  githubButton: 'View on GitHub',
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
    content: `Check out the source code, report issues, or contribute to the project on GitHub.`,
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

export const TECH_STACK = [
    { name: 'Frontend', value: 'Next.js & React', description: 'For a fast, server-rendered user interface.' },
    { name: 'Styling', value: 'Tailwind CSS', description: 'A utility-first CSS framework for rapid UI development.' },
    { name: 'UI Components', value: 'shadcn/ui', description: 'Beautifully designed, accessible, and reusable components.' },
    { name: 'AI Integration', value: 'Genkit', description: 'Powers the AI-driven SEO analysis and recommendations.' },
    { name: 'Load Testing', value: 'k6', description: 'A powerful, open-source load testing tool from Grafana Labs.' },
    { name: 'Auditing', value: 'Lighthouse', description: "Google's automated tool for improving web page quality." },
    { name: 'Metrics DB', value: 'InfluxDB', description: 'A time-series database for storing k6 test metrics.' },
    { name: 'Dashboards', value: 'Grafana', description: 'The open standard for beautiful analytics and monitoring.' },
    { name: 'Orchestration', value: 'Docker', description: 'To containerize and run all services in an isolated environment.' },
];
