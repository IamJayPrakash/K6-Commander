'use client';

import React from 'react';
import {
  ResizableHandle,
  ResizablePanel,
  ResizablePanelGroup,
} from '@/components/ui/resizable';
import RequestPanel from '@/components/pages/api-tester/request-panel';
import ResponsePanel from '@/components/pages/api-tester/response-panel';
import type { ApiFormValues } from '@/components/pages/api-tester/request-panel';

export default function ApiTesterPage() {
  const [response, setResponse] = React.useState(null);
  const [isLoading, setIsLoading] = React.useState(false);

  const handleSendRequest = async (config: ApiFormValues) => {
    setIsLoading(true);
    setResponse(null);

    const startTime = Date.now();

    try {
      // Build URL with query params
      const url = new URL(config.url);
      config.queryParams.forEach((param) => {
        if (param.key && param.value) {
          url.searchParams.append(param.key, param.value);
        }
      });

      // Prepare headers
      const headers = new Headers();
      config.headers.forEach((header) => {
        if (header.key && header.value) {
          headers.append(header.key, header.value);
        }
      });

      // Prepare body
      let body = null;
      if (['POST', 'PUT', 'PATCH'].includes(config.method) && config.body) {
        try {
          body = JSON.stringify(JSON.parse(config.body));
          if (!headers.has('Content-Type')) {
            headers.append('Content-Type', 'application/json');
          }
        } catch (e) {
          throw new Error('Invalid JSON in request body.');
        }
      }

      const res = await fetch(url.toString(), {
        method: config.method,
        headers,
        body,
      });

      const duration = Date.now() - startTime;
      const responseBodyText = await res.text();
      let responseBody;
      try {
        responseBody = JSON.parse(responseBodyText);
      } catch (e) {
        responseBody = responseBodyText;
      }
      
      const responseHeaders: Record<string, string> = {};
      res.headers.forEach((value, key) => {
        responseHeaders[key] = value;
      });

      setResponse({
        status: res.status,
        statusText: res.statusText,
        headers: responseHeaders,
        body: responseBody,
        size: new Blob([responseBodyText]).size,
        duration,
      });
    } catch (error: any) {
      const duration = Date.now() - startTime;
      setResponse({
        status: 'Error',
        statusText: 'Request Failed',
        headers: {},
        body: {
          error: 'Failed to fetch',
          message: error.message || 'An unknown error occurred.',
        },
        size: 0,
        duration,
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex flex-col h-[calc(100vh-10rem)]">
      <ResizablePanelGroup direction="vertical" className="w-full h-full">
        <ResizablePanel defaultSize={50}>
          <div className="h-full overflow-auto p-1">
            <RequestPanel onSend={handleSendRequest} isLoading={isLoading} />
          </div>
        </ResizablePanel>
        <ResizableHandle withHandle />
        <ResizablePanel defaultSize={50}>
          <div className="h-full overflow-auto p-1">
            <ResponsePanel response={response} isLoading={isLoading} />
          </div>
        </ResizablePanel>
      </ResizablePanelGroup>
    </div>
  );
}