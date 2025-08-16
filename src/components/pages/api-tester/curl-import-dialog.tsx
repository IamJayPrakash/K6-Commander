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

export default function CurlImportDialog({ onImport }: { onImport: (values: Partial<ApiFormValues>) => void; }) {
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
      const parsedData = parse(curl);
      
      const importedValues: Partial<ApiFormValues> = {
        url: parsedData.url,
        method: parsedData.method as ApiFormValues['method'],
        headers: Object.entries(parsedData.headers || {}).map(([key, value]) => ({ key, value: String(value) })),
        body: typeof parsedData.data === 'string' ? parsedData.data : JSON.stringify(parsedData.data, null, 2),
        queryParams: Array.from(new URL(parsedData.url).searchParams).map(([key, value]) => ({key, value})),
      };
      
      // Remove query params from URL
      if (importedValues.url) {
        const urlObject = new URL(importedValues.url);
        importedValues.url = `${urlObject.protocol}//${urlObject.host}${urlObject.pathname}`;
      }

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
        description: error.message || 'Could not parse the cURL command. Please check the format.',
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