import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import Link from 'next/link';

export default function TermsPage() {
  return (
    <Card className="bg-card/50 backdrop-blur-sm">
      <CardHeader>
        <CardTitle>Terms of Service</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <p>Last updated: {new Date().toLocaleDateString()}</p>

        <h2 className="font-bold text-xl pt-4">1. Acceptance of Terms</h2>
        <p>
          By accessing and using K6 Commander (the "Service"), you accept and agree to be bound by
          the terms and provision of this agreement.
        </p>

        <h2 className="font-bold text-xl pt-4">2. Responsible Use</h2>
        <p>
          The Service is a powerful tool designed for testing websites and applications that **YOU
          OWN** or for which **YOU HAVE EXPLICIT, WRITTEN PERMISSION** to conduct such testing.
        </p>
        <p className="font-bold text-destructive">
          Unauthorized testing of third-party websites is strictly prohibited, unethical, and may be
          illegal. You are solely responsible for any and all activities that occur under your
          usage. You agree not to use the service for any illegal or unauthorized purpose.
        </p>

        <h2 className="font-bold text-xl pt-4">3. Disclaimers</h2>
        <p>
          The Service is provided "as is," and we make no warranties, express or implied, regarding
          its reliability, performance, or suitability for your needs. The creators of K6 Commander
          shall not be held liable for any damages or losses resulting from the use or misuse of
          this tool.
        </p>

        <h2 className="font-bold text-xl pt-4">4. Data and Privacy</h2>
        <p>
          K6 Commander is designed to be a local-first application. All test configurations and
          history are stored in your browser's LocalStorage. We do not collect or store your data.
          Please see our{' '}
          <Link href="/privacy" className="text-primary underline">
            Privacy Policy
          </Link>{' '}
          for more information.
        </p>

        <h2 className="font-bold text-xl pt-4">5. Changes to Terms</h2>
        <p>
          We reserve the right to modify these terms from time to time at our sole discretion.
          Therefore, you should review this page periodically. Your continued use of the Service
          after any such change constitutes your acceptance of the new Terms.
        </p>
      </CardContent>
    </Card>
  );
}
