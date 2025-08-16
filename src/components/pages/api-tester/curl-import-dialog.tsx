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

interface CurlImportDialogProps {
  onImport: (values: Partial<ApiFormValues>) => void;
}

// A simplified cURL parser using regular expressions.
// This is not exhaustive but covers common cases for API testing.
function parseCurl(curl: string): Partial<ApiFormValues> {
  const result: Partial<ApiFormValues> = {};

  // Extract URL
  const urlMatch = curl.match(/'([^']*)'/);
  if (urlMatch) {
    const fullUrl = urlMatch[1];
    const urlObject = new URL(fullUrl);
    result.url = `${urlObject.protocol}//${urlObject.host}${urlObject.pathname}`;

    const queryParams: { key: string; value: string }[] = [];
    urlObject.searchParams.forEach((value, key) => {
      queryParams.push({ key, value });
    });
    if (queryParams.length > 0) {
      result.queryParams = queryParams;
    }
  }

  // Extract Method
  const methodMatch = curl.match(/-X\s+'([^']*)'|--request\s+'([^']*)'/);
  if (methodMatch) {
    const method = (methodMatch[1] || methodMatch[2]).toUpperCase();
    if (['GET', 'POST', 'PUT', 'PATCH', 'DELETE'].includes(method)) {
      result.method = method as ApiFormValues['method'];
    }
  }

  // Extract Headers
  const headerMatches = curl.matchAll(/-H\s+'([^']*)'|--header\s+'([^']*)'/g);
  const headers: { key: string; value: string }[] = [];
  for (const match of headerMatches) {
    const headerString = match[1] || match[2];
    const [key, ...valueParts] = headerString.split(': ');
    if (key && valueParts.length > 0) {
      headers.push({ key, value: valueParts.join(': ') });
    }
  }
  if (headers.length > 0) {
    result.headers = headers;
  }

  // Extract Body
  const bodyMatch = curl.match(/--data-raw\s+'([^']*)'|--data\s+'([^']*)'/);
  if (bodyMatch) {
    const body = bodyMatch[1] || bodyMatch[2];
    try {
      // Try to beautify if it's JSON
      const parsed = JSON.parse(body);
      result.body = JSON.stringify(parsed, null, 2);
    } catch (e) {
      result.body = body;
    }
  }

  return result;
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
      const importedValues = parseCurl(curl);

      if (!importedValues.url) {
        throw new Error("Could not parse a valid URL from the cURL command.");
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

