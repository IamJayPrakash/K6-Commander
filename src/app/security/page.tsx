import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useTranslation } from 'react-i18next';

export default function SecurityPage() {
  const { i18n } = useTranslation();
  const lastUpdated = new Date().toLocaleDateString(i18n.language, {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });

  return (
    <Card className="bg-card/50 backdrop-blur-sm" data-testid="security-page-card">
      <CardHeader>
        <CardTitle>Security Policy</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4 prose dark:prose-invert max-w-none">
        <p>Last updated: {lastUpdated}</p>

        <h2>Our Security Philosophy</h2>
        <p>
          K6 Commander is designed with a "local-first" security model. Our primary security feature
          is that your sensitive data—including target URLs, API keys in headers, request bodies, and
          test results—never leaves your local environment unless you explicitly action it.
        </p>

        <h2>Application Architecture</h2>
        <ul>
          <li>
            <strong>Containerization:</strong> All components of the application (the Next.js app,
            InfluxDB, Grafana) run in isolated Docker containers on your local machine, orchestrated
            by Docker Compose. This minimizes interference with your host system.
          </li>
          <li>
            <strong>Local Network:</strong> The services communicate with each other over a private
            Docker bridge network (`k6-network`). Ports are exposed to your `localhost` for access,
            but are not automatically exposed to the public internet.
          </li>
          <li>
            <strong>No Cloud Dependencies for Core Features:</strong> The core functionality does
            not rely on any external cloud databases or authentication services. All data is stored
            locally in your browser.
          </li>
          <li>
            <strong>AI Feature Security:</strong> The optional AI SEO analyzer sends data to the
            Google AI Platform. Ensure any sensitive information is removed from your page's HTML
            before running this type of analysis if that is a concern.
          </li>
        </ul>

        <h2>Responsible Usage</h2>
        <p className="font-bold text-destructive">
          The most significant security consideration is how you use this tool. You are responsible
          for ensuring you only test applications and services you own or have explicit, written
          permission to test. Unauthorized load testing can be considered a denial-of-service (DoS)
          attack and may have legal consequences.
        </p>

        <h2>Reporting Vulnerabilities</h2>
        <p>
          We take security seriously. If you believe you have found a security vulnerability in K6
          Commander, please report it to us responsibly by creating a GitHub issue. We will make
          every effort to address it promptly.
        </p>
      </CardContent>
    </Card>
  );
}
