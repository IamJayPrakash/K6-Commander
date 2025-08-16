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
import ApiTestHistory from '@/components/pages/api-tester/api-test-history';
import { useLocalStorage } from '@/hooks/use-local-storage';
import { v4 as uuidv4 } from 'uuid';
import type { ApiTestCollection, ApiTestItem } from '@/types/index';

export default function ApiTesterPage() {
  const [response, setResponse] = React.useState(null);
  const [isLoading, setIsLoading] = React.useState(false);
  const [currentRequest, setCurrentRequest] = React.useState<ApiTestItem | null>(null);

  const [collections, setCollections] = useLocalStorage<ApiTestCollection[]>('api-test-history', [
    { id: 'default', name: 'Scratch Pad', requests: [] },
  ]);
  const [activeCollectionId, setActiveCollectionId] = useLocalStorage<string>(
    'api-test-active-collection',
    'default'
  );

  const handleSendRequest = async (config: ApiFormValues) => {
    setIsLoading(true);
    setResponse(null);

    const startTime = Date.now();
    let responseData = {};

    try {
      const url = new URL(config.url);
      config.queryParams.forEach((param) => {
        if (param.key && param.value) {
          url.searchParams.append(param.key, param.value);
        }
      });

      const headers = new Headers();
      config.headers.forEach((header) => {
        if (header.key && header.value) {
          headers.append(header.key, header.value);
        }
      });

      let body: BodyInit | null = null;
      if (['POST', 'PUT', 'PATCH'].includes(config.method) && config.body) {
        body = config.body;
        if (!headers.has('Content-Type')) {
          headers.append('Content-Type', 'application/json');
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

      responseData = {
        status: res.status,
        statusText: res.statusText,
        headers: responseHeaders,
        body: responseBody,
        size: new Blob([responseBodyText]).size,
        duration,
      };
    } catch (error: any) {
      const duration = Date.now() - startTime;
      responseData = {
        status: 'Error',
        statusText: 'Request Failed',
        headers: {},
        body: {
          error: 'Failed to fetch',
          message: error.message || 'An unknown error occurred.',
        },
        size: 0,
        duration,
      };
    } finally {
      setResponse(responseData);
      setIsLoading(false);
      // Save to history
      const newHistoryItem: ApiTestItem = {
        id: uuidv4(),
        name: `${config.method} ${config.url}`,
        request: config,
        createdAt: new Date().toISOString(),
      };
      setCollections((prevCollections) =>
        prevCollections.map((c) => {
          if (c.id === activeCollectionId) {
            return { ...c, requests: [newHistoryItem, ...c.requests] };
          }
          return c;
        })
      );
    }
  };

  const handleSelectRequest = (requestItem: ApiTestItem | null) => {
    setCurrentRequest(requestItem);
  };

  return (
    <ResizablePanelGroup direction="horizontal" className="w-full h-[calc(100vh-10rem)]">
      <ResizablePanel defaultSize={25} minSize={20}>
        <ApiTestHistory
          collections={collections}
          setCollections={setCollections}
          activeCollectionId={activeCollectionId}
          setActiveCollectionId={setActiveCollectionId}
          onSelectRequest={handleSelectRequest}
        />
      </ResizablePanel>
      <ResizableHandle withHandle />
      <ResizablePanel defaultSize={75}>
        <ResizablePanelGroup direction="vertical">
          <ResizablePanel defaultSize={50} minSize={30}>
            <RequestPanel
              key={currentRequest?.id || 'new'}
              onSend={handleSendRequest}
              isLoading={isLoading}
              initialValues={currentRequest?.request}
            />
          </ResizablePanel>
          <ResizableHandle withHandle />
          <ResizablePanel defaultSize={50} minSize={20}>
            <ResponsePanel response={response} isLoading={isLoading} />
          </ResizablePanel>
        </ResizablePanelGroup>
      </ResizablePanel>
    </ResizablePanelGroup>
  );
}
