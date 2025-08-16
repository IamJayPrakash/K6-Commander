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
import { useIsMobile } from '@/hooks/use-mobile';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { History, TestTubeDiagonal, ArrowLeftRight } from 'lucide-react';
import { useTranslation } from 'react-i18next';

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

  const isMobile = useIsMobile();
  const { t } = useTranslation();
  const [mobileTab, setMobileTab] = React.useState('request');

  const handleSendRequest = async (config: ApiFormValues) => {
    setIsLoading(true);
    setResponse(null);
    if (isMobile) {
      setMobileTab('response');
    }

    const startTime = Date.now();
    let responseData = {};

    try {
      const url = new URL(config.url);
      config.queryParams.forEach((param) => {
        if (param.key) {
          url.searchParams.append(param.key, param.value);
        }
      });

      const headers = new Headers();
      config.headers.forEach((header) => {
        if (header.key) {
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
            // Add to the beginning of the array, but handle case where requests is undefined
            const updatedRequests = c.requests ? [newHistoryItem, ...c.requests] : [newHistoryItem];
            return { ...c, requests: updatedRequests };
          }
          return c;
        })
      );
    }
  };

  const handleSelectRequest = (requestItem: ApiTestItem | null) => {
    setCurrentRequest(requestItem);
    if (isMobile && requestItem) {
      setMobileTab('request');
    }
  };

  if (isMobile === undefined) {
    return null; // or a loading spinner
  }

  return isMobile ? (
    <Tabs value={mobileTab} onValueChange={setMobileTab} className="w-full">
      <TabsList className="grid w-full grid-cols-3">
        <TabsTrigger value="history">
          <History className="mr-2 h-4 w-4" />
          {t('apiTester.historyTab')}
        </TabsTrigger>
        <TabsTrigger value="request">
          <TestTubeDiagonal className="mr-2 h-4 w-4" />
          {t('apiTester.requestTab')}
        </TabsTrigger>
        <TabsTrigger value="response">
          <ArrowLeftRight className="mr-2 h-4 w-4" />
          {t('apiTester.responseTab')}
        </TabsTrigger>
      </TabsList>
      <TabsContent value="history" className="mt-4">
        <ApiTestHistory
          collections={collections}
          setCollections={setCollections}
          activeCollectionId={activeCollectionId}
          setActiveCollectionId={setActiveCollectionId}
          onSelectRequest={handleSelectRequest}
          selectedRequestId={currentRequest?.id}
        />
      </TabsContent>
      <TabsContent value="request" className="mt-4">
        <RequestPanel
          key={currentRequest?.id || 'new'}
          onSend={handleSendRequest}
          isLoading={isLoading}
          initialValues={currentRequest?.request}
        />
      </TabsContent>
      <TabsContent value="response" className="mt-4">
        <ResponsePanel response={response} isLoading={isLoading} />
      </TabsContent>
    </Tabs>
  ) : (
    <ResizablePanelGroup
      direction="horizontal"
      className="w-full rounded-lg border flex-1"
    >
      <ResizablePanel defaultSize={25} minSize={20}>
        <ApiTestHistory
          collections={collections}
          setCollections={setCollections}
          activeCollectionId={activeCollectionId}
          setActiveCollectionId={setActiveCollectionId}
          onSelectRequest={handleSelectRequest}
          selectedRequestId={currentRequest?.id}
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
