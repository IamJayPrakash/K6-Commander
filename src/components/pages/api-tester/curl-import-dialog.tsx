'use client';

import React, { useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/hooks/use-toast';
import { Download } from 'lucide-react';
import type { ApiFormValues } from './request-panel';
import { useTranslation } from 'react-i18next';

// Simple regex-based parser for cURL commands. Handles common cases.
const parseCurl = (curl: string) => {
  // Remove line breaks and collapse whitespace for easier parsing
  const singleLineCurl = curl.replace(/\\\n/g, '').replace(/\s+/g, ' ');

  const urlMatch = singleLineCurl.match(/'([^']*)'|"([^"]*)"/);
  let url = '';
  if (urlMatch) {
    url = urlMatch[1] || urlMatch[2];
  }

  const methodMatch = singleLineCurl.match(/-X\s+([A-Z]+)/i);
  let method = 'GET';
  if (methodMatch) {
    method = methodMatch[1].toUpperCase();
  }

  const headers: { key: string; value: string }[] = [];
  const headerRegex = /-H\s+'([^:]+):\s*([^']+)'/g;
  let headerMatch;
  while ((headerMatch = headerRegex.exec(singleLineCurl)) !== null) {
    headers.push({ key: headerMatch[1].trim(), value: headerMatch[2].trim() });
  }

  let body = '';
  const dataMatch = singleLineCurl.match(/--(?:data|data-raw)\s+'([^']*)'/);
  if (dataMatch) {
    body = dataMatch[1];
    method = 'POST'; // Common default for data
  }

  return { url, method, headers, body };
};


export default function CurlImportDialog({
  onImport,
}: {
  onImport: (values: Partial<ApiFormValues>) => void;
}) {
  const [open, setOpen] = useState(false);
  const [curl, setCurl] = useState('');
  const { toast } = useToast();
  const { t } = useTranslation();

  const handleImport = () => {
    if (!curl.trim()) {
      toast({
        variant: 'destructive',
        title: t('apiTester.toast.curlImportErrorTitle'),
        description: t('apiTester.toast.curlImportErrorDescription'),
      });
      return;
    }

    try {
      const parsedData = parseCurl(curl);
      
      if (!parsedData.url) {
        throw new Error("Could not find a URL in the cURL command.");
      }

      const importedValues: Partial<ApiFormValues> = {
        url: parsedData.url,
        method: parsedData.method as ApiFormValues['method'],
        headers: parsedData.headers,
        body: parsedData.body,
        queryParams: Array.from(new URL(parsedData.url).searchParams).map(([key, value]) => ({
          key,
          value,
        })),
      };

      // Remove query params from URL
      if (importedValues.url) {
        const urlObject = new URL(importedValues.url);
        importedValues.url = `${urlObject.protocol}//${urlObject.host}${urlObject.pathname}`;
      }

      onImport(importedValues);
      toast({
        title: t('apiTester.toast.curlImportSuccessTitle'),
        description: t('apiTester.toast.curlImportSuccessDescription'),
      });
      setOpen(false);
      setCurl('');
    } catch (error: any) {
      console.error(error);
      toast({
        variant: 'destructive',
        title: t('apiTester.toast.curlImportErrorTitle'),
        description: error.message || t('apiTester.toast.curlImportErrorDescription'),
      });
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" data-testid="import-curl-button">
          <Download className="mr-2 h-4 w-4" /> {t('apiTester.importCurlButton')}
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[625px]" data-testid="import-curl-dialog">
        <DialogHeader>
          <DialogTitle>{t('apiTester.importCurlDialog.title')}</DialogTitle>
          <DialogDescription>{t('apiTester.importCurlDialog.description')}</DialogDescription>
        </DialogHeader>
        <div className="py-4">
          <Textarea
            placeholder="curl 'https://api.example.com' -H 'Content-Type: application/json' --data-raw '{}'"
            className="h-48 font-mono"
            value={curl}
            onChange={(e) => setCurl(e.target.value)}
            data-testid="import-curl-textarea"
          />
        </div>
        <DialogFooter>
          <Button type="button" onClick={handleImport} data-testid="import-curl-submit-button">
            {t('apiTester.importCurlDialog.importButton')}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
