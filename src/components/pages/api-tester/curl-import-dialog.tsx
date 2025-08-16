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
import { curlconverter } from 'curlconverter';

interface CurlImportDialogProps {
  onImport: (values: Partial<ApiFormValues>) => void;
}

export default function CurlImportDialog({ onImport }: CurlImportDialogProps) {
  const [open, setOpen] = useState(false);
  const [curl, setCurl] = useState('');
  const { toast } = useToast();

  const handleImport = () => {
    if (!curl.trim()) {
      toast({
        variant: 'destructive',
        title: 'Error',
        description: 'cURL command cannot be empty.',
      });
      return;
    }

    try {
      const jsonString = curlconverter(curl, 'json');
      const result = JSON.parse(jsonString);

      const { url, method, headers, data } = result;

      const uppercaseMethod = (method?.toUpperCase() as ApiFormValues['method']) || 'GET';

      const parsedHeaders = headers
        ? Object.entries(headers).map(([key, value]) => ({ key, value: String(value) }))
        : [];

      const queryParams: { key: string; value: string }[] = [];
      const urlObject = new URL(url);
      for (const [key, value] of urlObject.searchParams.entries()) {
        queryParams.push({ key, value });
      }
      urlObject.search = '';
      const baseUrl = urlObject.toString();

      const importedValues: Partial<ApiFormValues> = {
        url: baseUrl,
        method: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH'].includes(uppercaseMethod)
          ? uppercaseMethod
          : 'GET',
        headers: parsedHeaders,
        body: typeof data === 'object' ? JSON.stringify(data, null, 2) : String(data || ''),
        queryParams: queryParams.length > 0 ? queryParams : [{ key: '', value: '' }],
      };

      onImport(importedValues);
      toast({
        title: 'Success',
        description: 'cURL command imported successfully.',
      });
      setOpen(false);
      setCurl('');
    } catch (error: any) {
      console.error(error);
      toast({
        variant: 'destructive',
        title: 'Import Failed',
        description: 'Could not parse the cURL command. Please check the format.',
      });
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline">
          <Download className="mr-2 h-4 w-4" /> Import cURL
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[625px]">
        <DialogHeader>
          <DialogTitle>Import from cURL</DialogTitle>
          <DialogDescription>
            Paste a raw cURL command below to automatically populate the request fields.
          </DialogDescription>
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
            Import Command
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
