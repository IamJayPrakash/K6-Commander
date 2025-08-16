import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useTranslation } from 'react-i18next';
import Link from 'next/link';

export default function PrivacyPage() {
  const { i18n } = useTranslation();
  const lastUpdated = new Date().toLocaleDateString(i18n.language, {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });

  return (
    <Card className="bg-card/50 backdrop-blur-sm" data-testid="privacy-page-card">
      <CardHeader>
        <CardTitle>Privacy Policy</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4 prose dark:prose-invert max-w-none">
        <p>Last updated: {lastUpdated}</p>

        <h2>Our Commitment to Privacy</h2>
        <p>
          Your privacy is critically important to us. K6 Commander is designed from the ground up to
          be a "local-first" application.
        </p>

        <h2>Data Collection and Storage</h2>
        <p>
          <strong>
            We do not collect, transmit, or store any of your personal data, test configurations, or
            test results on our servers.
          </strong>
        </p>
        <p>All data you input into the application, including:</p>
        <ul>
          <li>Target URLs</li>
          <li>Test configurations (headers, bodies, VUs, duration, etc.) for load tests.</li>
          <li>API request configurations in the API Tester.</li>
          <li>Test summary reports (k6, Lighthouse, SEO).</li>
          <li>Your entire test history for both load tests and API requests.</li>
        </ul>
        <p>
          ...is stored exclusively in your web browser's <strong>LocalStorage</strong>. This data
          never leaves your computer unless you explicitly choose to export it.
        </p>

        <h2>Third-Party Services</h2>
        <p>
          The application runs within a self-contained Docker environment on your machine. It
          communicates with InfluxDB and Grafana containers, also running locally. There is no
          communication with external cloud databases or services for core functionality.
        </p>
        <p>
          The optional AI-powered SEO Analysis feature sends the target URL and its HTML content to
          the Google AI API for processing. This is the only instance where data is sent to an
          external service, and it only occurs when you explicitly run an SEO test.
        </p>

        <h2>Import/Export Functionality</h2>
        <p>
          The application provides functionality to import and export your test history as a JSON
          file. This process is initiated entirely by you and managed by your browser. We do not
          have access to these files.
        </p>

        <h2>Changes to this Policy</h2>
        <p>
          Since we do not collect your data, we do not anticipate major changes to this policy.
          However, if the application's functionality changes in a way that impacts data handling,
          we will update this policy accordingly.
        </p>
      </CardContent>
    </Card>
  );
}
