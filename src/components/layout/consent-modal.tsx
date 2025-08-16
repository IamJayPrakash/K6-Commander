'use client';

import { useEffect, useState } from 'react';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { useLocalStorage } from '@/hooks/use-local-storage';
import Link from 'next/link';

const CONSENT_KEY = 'k6-commander-consent-given';

export default function ConsentModal() {
  const [consentGiven, setConsentGiven] = useLocalStorage(CONSENT_KEY, false);
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  const handleAgree = () => {
    setConsentGiven(true);
  };

  if (!isMounted || consentGiven) {
    return null;
  }

  return (
    <AlertDialog open={!consentGiven}>
      <AlertDialogContent data-testid="consent-dialog">
        <AlertDialogHeader>
          <AlertDialogTitle>Responsible Usage Policy</AlertDialogTitle>
          <AlertDialogDescription>
            Welcome to K6 Commander. This tool is designed for performance testing applications that
            you own or have explicit, written permission to test.
            <br />
            <br />
            Unauthorized load testing of third-party systems is prohibited and can be considered a
            denial-of-service (DoS) attack, which may have legal consequences.
            <br />
            <br />
            By clicking "I Agree," you acknowledge that you will only use this service responsibly
            and in accordance with our{' '}
            <Link href="/terms" className="underline text-primary" data-testid="consent-terms-link">
              Terms of Service
            </Link>
            .
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogAction onClick={handleAgree} data-testid="consent-agree-button">
            I Agree
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
