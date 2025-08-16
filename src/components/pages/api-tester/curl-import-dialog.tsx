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
import { parse } from 'curlconverter';
import { useTranslation } from 'react-i18next';

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
      const parsedData = parse(curl);

      const importedValues: Partial<ApiFormValues> = {
        url: parsedData.url,
        method: parsedData.method.toUpperCase() as ApiFormValues['method'],
        headers: Object.entries(parsedData.headers || {}).map(([key, value]) => ({
          key,
          value: String(value),
        })),
        body:
          typeof parsedData.data === 'string'
            ? parsedData.data
            : JSON.stringify(parsedData.data, null, 2),
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
        <Button variant="outline">
          <Download className="mr-2 h-4 w-4" /> {t('apiTester.importCurlButton')}
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[625px]">
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
          />
        </div>
        <DialogFooter>
          <Button type="button" onClick={handleImport}>
            {t('apiTester.importCurlDialog.importButton')}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}