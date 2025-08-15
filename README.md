# K6 Commander

K6 Commander is a lightweight, local-first, authorized load-testing platform. It allows you to configure, run, and analyze load tests, Lighthouse audits, and basic SEO checks directly from a sleek web UI, leveraging the power of k6, InfluxDB, and Grafana.

**Disclaimer:** This tool is intended for performance testing **your own applications** where you have explicit permission to do so. Unauthorized testing of third-party websites is illegal and unethical. The creators of this software are not responsible for its misuse.

![K6 Commander Screenshot](https://placehold.co/1200x600.png)

## ✨ Features

- **Multi-Modal Testing**: Run k6 load tests, Google Lighthouse audits, and basic on-page SEO checks from a single interface.
- **Web-Based Configuration**: Easily configure load tests (URL, method, headers, body, VUs, stages) through an intuitive UI.
- **Test Presets**: Get started quickly with presets for Baseline, Spike, Stress, and Soak tests.
- **Live Monitoring**: View real-time test metrics in a pre-configured Grafana dashboard.
- **Unified Summary Reports**: Get a detailed, tabbed report with charts and scores after each test run.
- **Local History**: All test configurations and results are stored in your browser's LocalStorage. No cloud database needed.
- **Import/Export**: Easily back up and share your test history as a JSON file.
- **Self-Hosted & Containerized**: Runs entirely on your local machine with Docker Compose for consistency and scalability.

## 🛠️ Stack

- **Frontend:** Next.js 14 (App Router), TypeScript, Tailwind CSS, shadcn/ui
- **Backend API:** Next.js Route Handlers
- **Test Runner:** [k6](https://k6.io/) (via Docker)
- **Audit Engine:** [Google Lighthouse](https://developers.google.com/web/tools/lighthouse) (via `npx`)
- **Metrics Database:** InfluxDB 1.8
- **Dashboards:** Grafana
- **Orchestration:** Docker Compose

## 🚀 Getting Started

### Prerequisites

- [Docker](https://www.docker.com/get-started) and [Docker Compose](https://docs.docker.com/compose/install/)
- Node.js (for package management if you wish to modify the code)
- A web browser (Chrome, Firefox, etc.)

### 1. Clone the Repository

```bash
git clone https://github.com/your-username/k6-commander.git
cd k6-commander
```

### 2. Build and Run with Docker Compose

From the root directory of the project, run:

```bash
docker-compose up --build
```

This command will:
1.  Build the Next.js application's Docker image.
2.  Pull the required images for InfluxDB and Grafana.
3.  Start all services (`app`, `influxdb`, `grafana`).

Once the services are up, you can access:

- **K6 Commander UI**: [http://localhost:3000](http://localhost:3000)
- **Grafana Dashboard**: [http://localhost:3003](http://localhost:3003)
  - Login with default credentials: `admin` / `admin`. You will be prompted to change the password on first login.

### 3. Running Your First Test

1.  Navigate to [http://localhost:3000](http://localhost:3000).
2.  Accept the terms of service.
3.  Fill in the "New Test Run" form with the URL you want to audit.
4.  Select the test suites to run (Load Test, Lighthouse, SEO).
5.  If running a load test, choose a preset or configure it manually.
6.  Click "Run Test(s)".
7.  Monitor the "Test Running" view. For load tests, a link to the live Grafana dashboard will be available.
8.  Once the test is complete, a summary report will be displayed.

## 🤝 Contributing

Contributions, issues, and feature requests are welcome! Feel free to check the [issues page](https://github.com/your-username/k6-commander/issues).

Please read our [Contributing Guidelines](./CONTRIBUTING.md) and [Code of Conduct](./CODE_OF_CONDUCT.md).

## 📜 License

This project is licensed under the MIT License - see the [LICENSE](./LICENSE) file for details.
