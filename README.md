# K6 Commander

K6 Commander is a lightweight, production-ready, authorized load-testing platform for your own sites. It allows you to configure, run, and analyze load tests directly from your browser, leveraging the power of k6, InfluxDB, and Grafana, all orchestrated with Docker Compose.

**Disclaimer:** This tool is intended for performance testing **your own applications** in staging or production environments where you have explicit permission to do so. Unauthorized testing of third-party websites is illegal and unethical. The creators of this software are not responsible for its misuse.

## Features

- **Web-Based Configuration**: Easily configure load tests (URL, method, headers, body, VUs, stages) through a sleek UI.
- **Test Presets**: Get started quickly with presets for Baseline, Spike, Stress, and Soak tests.
- **Containerized Testing**: Runs k6 tests in isolated Docker containers for consistency and scalability.
- **Live Monitoring**: View real-time test metrics in a pre-configured Grafana dashboard (RPS, latency, error rates, etc.).
- **Summary Reports**: Get a detailed summary report with charts after each test run.
- **Local History**: All test configurations and results are stored in your browser's LocalStorage. No database needed.
- **Import/Export**: Easily back up and share your test history as a JSON file.
- **Self-Hosted**: Runs entirely on your local machine with Docker. No cloud services required.

## Stack

- **Frontend:** Next.js 14 (App Router), TypeScript, Tailwind CSS, shadcn/ui
- **Backend API:** Next.js Route Handlers
- **Test Runner:** [k6](https://k6.io/)
- **Metrics Database:** InfluxDB 1.8
- **Dashboards:** Grafana
- **Orchestration:** Docker Compose

## Prerequisites

- [Docker](https://www.docker.com/get-started) and [Docker Compose](https://docs.docker.com/compose/install/)
- Node.js (for package management if you wish to modify the code)
- A web browser (Chrome, Firefox, etc.)

## Getting Started

### 1. Clone the Repository

```bash
git clone <repository-url>
cd k6-commander
```

### 2. Configure Environment (Optional)

The application is pre-configured to run out of the box. The Grafana dashboard connects to InfluxDB within the Docker network.

### 3. Build and Run with Docker Compose

From the root directory of the project, run:

```bash
docker-compose up --build
```

This command will:
1.  Build the Next.js application's Docker image.
2.  Pull the required images for InfluxDB and Grafana.
3.  Start all three services (`app`, `influxdb`, `grafana`).

Once the services are up and running, you can access:

- **K6 Commander UI**: [http://localhost:3000](http://localhost:3000)
- **Grafana Dashboard**: [http://localhost:3003](http://localhost:3003)
  - Login with default credentials: `admin` / `admin`. You will be prompted to change the password on first login.

### 4. Running Your First Test

1.  Navigate to [http://localhost:3000](http://localhost:3000).
2.  Fill in the "New Test" form with the details of your target endpoint.
3.  Choose a test preset or configure the VUs and stages manually.
4.  Click "Run Test".
5.  You will see a "Test Running" view with a link to the live Grafana dashboard. Click the link to monitor the test in real-time.
6.  Once the test is complete, a summary report will be displayed in the UI.
7.  You can save the test run to your local history.

## How It Works

1.  The **Next.js frontend** provides the UI for configuring and viewing tests.
2.  When a test is initiated, the configuration is sent to a **Next.js API Route Handler**.
3.  The API handler dynamically generates parameters for a `docker run` command.
4.  It uses a `child_process` to spawn a new `grafana/k6` container. This container runs the test based on the provided configuration.
5.  The **k6 container**:
    - Sends detailed, real-time metrics to the **InfluxDB** container.
    - Generates a `summary.json` file upon completion and saves it to a shared volume.
6.  The **Grafana container** is pre-configured with a data source pointing to InfluxDB and a dashboard to visualize the k6 metrics. The dashboard is filterable by a unique `testId`.
7.  The frontend polls another API endpoint to check for the `summary.json` file. Once available, it fetches the summary and displays the final report.
8.  Test history is managed entirely within the browser's **LocalStorage**.
