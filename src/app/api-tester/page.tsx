'use client';

import React from 'react';
import {
  ResizableHandle,
  ResizablePanel,
  ResizablePanelGroup,
} from '@/components/ui/resizable';
import RequestPanel from '@/components/pages/api-tester/request-panel';
import ResponsePanel from '@/components/pages/api-tester/response-panel';

export default function ApiTesterPage() {
  const [requestConfig, setRequestConfig] = React.useState({});
  const [response, setResponse] = React.useState(null);
  const [isLoading, setIsLoading] = React.useState(false);

  const handleSendRequest = (config: any) => {
    setIsLoading(true);
    // This is where you would make the API call.
    // For now, we'll just simulate a delay and set a mock response.
    console.log('Sending request with config:', config);
    setTimeout(() => {
      setResponse({
        status: 200,
        statusText: 'OK',
        headers: { 'content-type': 'application/json' },
        body: { message: 'This is a mock response!', data: config },
        size: 123,
        duration: 456,
      });
      setIsLoading(false);
    }, 1500);
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
