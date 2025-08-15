
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

export default function PrivacyPage() {
  return (
      <Card className="bg-card/50 backdrop-blur-sm">
        <CardHeader>
          <CardTitle>Privacy Policy</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <p>Last updated: {new Date().toLocaleDateString()}</p>
          
          <h2 className="font-bold text-xl pt-4">Our Commitment to Privacy</h2>
          <p>
            Your privacy is critically important to us. K6 Commander is designed from the ground up to be a "local-first" application.
          </p>

          <h2 className="font-bold text-xl pt-4">Data Collection and Storage</h2>
          <p>
            <strong>We do not collect, transmit, or store any of your personal data, test configurations, or test results on our servers.</strong>
          </p>
          <p>
            All data you input into the application, including:
          </p>
          <ul className="list-disc list-inside pl-4">
            <li>Target URLs</li>
            <li>Test configurations (headers, bodies, VUs, duration, etc.)</li>
            <li>Test summary reports</li>
            <li>Your entire test history</li>
          </ul>
          <p>
            ...is stored exclusively in your web browser's <strong>LocalStorage</strong>. This data never leaves your computer unless you explicitly choose to export it.
          </p>
          
          <h2 className="font-bold text-xl pt-4">Third-Party Services</h2>
          <p>
            The application runs within a self-contained Docker environment on your machine. It communicates with InfluxDB and Grafana containers, also running locally. There is no communication with external cloud databases or services by default.
          </p>

          <h2 className="font-bold text-xl pt-4">Import/Export Functionality</h2>
          <p>
            The application provides functionality to import and export your test history as a JSON file. This process is initiated entirely by you and managed by your browser. We do not have access to these files.
          </p>
          
           <h2 className="font-bold text-xl pt-4">Changes to this Policy</h2>
          <p>
            Since we do not collect your data, we do not anticipate changes to this policy. However, if the application's functionality changes in a way that impacts data handling, we will update this policy accordingly.
          </p>
        </CardContent>
      </Card>
  );
}
