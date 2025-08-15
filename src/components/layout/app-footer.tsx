
'use client';

import { Rocket } from 'lucide-react';
import Link from 'next/link';
import { useTranslation } from 'react-i18next';

export function AppFooter() {
  const { t } = useTranslation();
  return (
    <footer className="border-t border-border/40 py-6 md:py-8">
      <div className="container max-w-screen-2xl">
        <div className="flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <Rocket className="h-5 w-5 text-primary" />
            <p className="text-sm text-muted-foreground">
              {t('footer.copyright', { year: new Date().getFullYear() })}
            </p>
          </div>
          <nav className="flex items-center gap-4 md:gap-6 text-sm">
            <Link href="/terms" className="transition-colors hover:text-foreground/80 text-foreground/60">
              {t('footer.termsLink')}
            </Link>
            <Link href="/privacy" className="transition-colors hover:text-foreground/80 text-foreground/60">
              {t('footer.privacyLink')}
            </Link>
            <Link href="/security" className="transition-colors hover:text-foreground/80 text-foreground/60">
              {t('footer.securityLink')}
            </Link>
          </nav>
        </div>
      </div>
    </footer>
  );
}
