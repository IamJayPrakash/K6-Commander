# K6 Commander

K6 Commander is a lightweight, local-first, authorized load-testing platform. It allows you to configure, run, and analyze load tests, Lighthouse audits, and basic SEO checks directly from a sleek web UI, leveraging the power of k6, InfluxDB, and Grafana.

---
### ⚠️ Important Deployment Notice
**This application's architecture is NOT compatible with serverless deployment platforms like Vercel or Netlify.**

K6 Commander relies on running Docker containers (`k6`) and spawning system processes (`npx lighthouse`) directly from its backend. These operations are restricted on serverless platforms.

**Attempting to deploy this application on Vercel or Netlify will result in the load testing and Lighthouse features failing.** You must use a hosting environment that provides full control over the operating system and allows Docker to run, such as a traditional Virtual Machine (e.g., AWS EC2, DigitalOcean Droplet, Google Cloud VM) or a dedicated server.
---

![alt text](image.png)

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

## 🚀 Getting Started (Local Development)

### Prerequisites

- [Docker](https://www.docker.com/get-started) and [Docker Compose](https://docs.docker.com/compose/install/)
- Node.js (v18 or higher)
- A web browser (Chrome, Firefox, etc.)

### 1. Clone the Repository

```bash
git clone https://github.com/your-username/k6-commander.git
cd k6-commander
```

### 2. Set Up Environment Variables

Create a `.env` file by copying the example file. The app will function without it, but the AI-powered SEO analysis requires an API key.

```bash
cp .env.example .env
```

Open the `.env` file and add your `GEMINI_API_KEY` to enable the AI-powered SEO analysis feature.

### 3. Install Dependencies

```bash
npm install
```

### 4. Build and Run with Docker Compose

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

### 5. Running Your First Test

1.  Navigate to [http://localhost:3000](http://localhost:3000).
2.  Accept the terms of service.
3.  Fill in the "New Test Run" form with the URL you want to audit.
4.  Select the test suites to run (Load Test, Lighthouse, SEO).
5.  If running a load test, choose a preset or configure it manually.
6.  Click "Run Test(s)".
7.  Monitor the "Test Running" view. For load tests, a link to the live Grafana dashboard will be available.
8.  Once the test is complete, a summary report will be displayed.


## 🚢 Deployment

Please see the important deployment notice at the top of this README. The recommended deployment method is using Docker on a virtual private server.

### Server Requirements

- A server with Docker and Docker Compose installed.
- At least 2GB of RAM is recommended.
- A firewall configured to allow traffic on the ports you intend to expose (e.g., port 80/443 for the web app).

### Steps for Deployment

1. **Clone the repository** onto your server.
2. **Configure environment variables**: Create a `.env` file with your `GEMINI_API_KEY`.
3. **Build and run the application**:
   ```bash
   docker-compose up --build -d
   ```
   The `-d` flag runs the containers in detached mode.
4. **Set up a reverse proxy (Recommended)**: To serve the application over standard HTTP/S ports and handle SSL, you should use a reverse proxy like Nginx or Caddy.
   - Configure your reverse proxy to forward requests to the K6 Commander app running on `http://localhost:3000`.
   - Configure another subdomain (e.g., `grafana.your-domain.com`) to point to the Grafana instance on `http://localhost:3003`.


## 📁 Project Structure

```
/
├── .github/          # GitHub templates (issues, funding)
│   └── workflows/    # GitHub Actions CI/CD workflows
│       └── e2e.yml
├── grafana/          # Grafana provisioning files
│   ├── dashboards/     # Pre-configured dashboard JSON
│   └── provisioning/   # Datasource and dashboard configurations
├── k6/               # k6 test scripts
│   └── script.js     # The main k6 script, configurable via environment variables
├── public/           # Static assets for Next.js
├── results/          # (Git-ignored) Directory where test outputs are saved
├── src/
│   ├── app/            # Next.js App Router
│   │   ├── (pages)/    # Main application pages (form, history, etc.)
│   │   ├── api/        # API route handlers for running tests
│   │   └── layout.tsx  # Root layout
│   ├── components/     # React components
│   │   ├── layout/     # Header, Footer, etc.
│   │   ├── pages/      # Components specific to a single page
│   │   ├── test/       # Components for the test lifecycle (form, running, summary)
│   │   └── ui/         # Reusable shadcn/ui components
│   ├── hooks/          # Custom React hooks
│   ├── lib/            # Utility functions and constants
│   └── types/          # TypeScript type definitions
├── tests/
│   └── e2e/
│       └── app.spec.ts # Example Playwright E2E test
├── .env.example      # Example environment variables
├── .gitignore        # Files and directories to ignore in version control
├── docker-compose.yml  # Orchestrates all services (app, grafana, influxdb)
├── Dockerfile          # Defines the Next.js application container
├── next.config.ts      # Next.js configuration
├── package.json        # Project dependencies and scripts
└── playwright.config.ts# Configuration for Playwright
```

## ⚙️ Configuration

The primary configuration is handled within `docker-compose.yml` and the Next.js application itself. You must create a `.env` file for the `GEMINI_API_KEY`.

### k6 Script Environment Variables

The core k6 test script (`k6/script.js`) is dynamically configured by the Next.js backend via environment variables passed to the Docker container at runtime. These are sourced from the user's input in the web UI.

- `TARGET_URL`: The URL to test.
- `HTTP_METHOD`: `GET`, `POST`, etc.
- `HEADERS_JSON`: A JSON string of request headers.
- `BODY`: The request body content.
- `STAGES_JSON`: A JSON string defining the ramping stages for VUs.
- `VUS`: The number of virtual users for a fixed test.
- `DURATION`: The duration for a fixed test.

### Service Configuration

- **Grafana**: The admin user/password can be changed in `docker-compose.yml` under the `grafana` service's environment section.
- **InfluxDB**: The database name (`k6`) is set in `docker-compose.yml`.

## 🤝 Contributing

Contributions, issues, and feature requests are welcome! Feel free to check the [issues page](https://github.com/your-username/k6-commander/issues).

Please read our [Contributing Guidelines](./CONTRIBUTING.md) and [Code of Conduct](./CODE_OF_CONDUCT.md).

## 📜 License

This project is licensed under the MIT License - see the [LICENSE](./LICENSE) file for details.
