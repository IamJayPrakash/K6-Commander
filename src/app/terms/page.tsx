'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useTranslation } from 'react-i18next';
import Link from 'next/link';

export default function TermsPage() {
  const { i18n } = useTranslation();
  const lastUpdated = new Date().toLocaleDateString(i18n.language, {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });

  return (
    <Card className="bg-card/50 backdrop-blur-sm" data-testid="terms-page-card">
      <CardHeader>
        <CardTitle>Terms of Service</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4 text-foreground/80 leading-relaxed">
        <p>Last updated: {lastUpdated}</p>

        <h2 className="text-2xl font-semibold text-foreground pt-4">1. Acceptance of Terms</h2>
        <p>
          By accessing and using K6 Commander (the "Service"), you accept and agree to be bound by
          the terms and provision of this agreement. This Service includes all features, such as the
          load tester, Lighthouse audit tool, SEO analyzer, and the API Tester.
        </p>

        <h2 className="text-2xl font-semibold text-foreground pt-4">2. Responsible Use</h2>
        <p>
          The Service is a powerful tool designed for testing websites and applications that{' '}
          <strong>YOU OWN</strong> or for which <strong>YOU HAVE EXPLICIT, WRITTEN PERMISSION</strong>{' '}
          to conduct such testing.
        </p>
        <p className="font-bold text-destructive border-l-4 border-destructive pl-4 bg-destructive/10 py-2">
          Unauthorized testing of third-party websites is strictly prohibited, unethical, and may be
          illegal. You are solely responsible for any and all activities that occur under your
          usage. You agree not to use the service for any illegal or unauthorized purpose.
        </p>

        <h2 className="text-2xl font-semibold text-foreground pt-4">3. Disclaimers</h2>
        <p>
          The Service is provided "as is," and we make no warranties, express or implied, regarding
          its reliability, performance, or suitability for your needs. The creators of K6 Commander
          shall not be held liable for any damages or losses resulting from the use or misuse of
          this tool. This includes any system instability caused by load testing or any consequences
          of acting on the advice from the AI-powered SEO analysis.
        </p>

        <h2 className="text-2xl font-semibold text-foreground pt-4">4. Data and Privacy</h2>
        <p>
          K6 Commander is designed to be a local-first application. All test configurations and
          history are stored in your browser's LocalStorage. We do not collect or store your data.
          Please see our{' '}
          <Link href="/privacy" className="text-primary underline">
            Privacy Policy
          </Link>{' '}
          for more information.
        </p>

        <h2 className="text-2xl font-semibold text-foreground pt-4">5. Changes to Terms</h2>
        <p>
          We reserve the right to modify these terms from time to time at our sole discretion.
          Therefore, you should review this page periodically. Your continued use of the Service
          after any such change constitutes your acceptance of the new Terms.
        </p>
      </CardContent>
    </Card>
  );
}
