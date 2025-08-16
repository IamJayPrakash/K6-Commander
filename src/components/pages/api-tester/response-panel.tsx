'use client';

import React from 'react';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Loader } from 'lucide-react';
import { useTranslation } from 'react-i18next';

interface ResponsePanelProps {
  response: any;
  isLoading: boolean;
}

export default function ResponsePanel({ response, isLoading }: ResponsePanelProps) {
    const { t } = useTranslation();

  const getStatusColor = (status: number) => {
    if (status >= 200 && status < 300) return 'bg-green-500';
    if (status >= 300 && status < 400) return 'bg-yellow-500';
    if (status >= 400) return 'bg-red-500';
    return 'bg-gray-500';
  };
  
  const renderBody = () => {
    if (!response?.body) return '';
    try {
      return JSON.stringify(response.body, null, 2);
    } catch (error) {
      return response.body;
    }
  };
  
  if (isLoading) {
    return (
      <div className="flex flex-col h-full items-center justify-center text-muted-foreground">
        <Loader className="animate-spin h-8 w-8 mb-2" />
        <p>{t('apiTester.loadingResponse')}</p>
      </div>
    );
  }

  if (!response) {
    return (
      <div className="flex flex-col h-full items-center justify-center text-muted-foreground">
        <p className='text-lg'>{t('apiTester.noResponseYet')}</p>
        <p>{t('apiTester.noResponseYetDesc')}</p>
      </div>
    );
  }

  return (
    <Card className="h-full border-0 shadow-none">
      <CardContent className="p-2 h-full flex flex-col">
        <div className="flex items-center gap-4 mb-2 p-2">
            <Badge className={`${getStatusColor(response.status)} hover:${getStatusColor(response.status)}`}>
                {t('apiTester.status')}: {response.status} {response.statusText}
            </Badge>
            <Badge variant="outline">{t('apiTester.time')}: {response.duration}ms</Badge>
            <Badge variant="outline">{t('apiTester.size')}: {response.size} B</Badge>
        </div>
        <Tabs defaultValue="body" className="w-full flex-grow flex flex-col">
          <TabsList>
            <TabsTrigger value="body">{t('apiTester.bodyTab')}</TabsTrigger>
            <TabsTrigger value="headers">{t('apiTester.headersTab')}</TabsTrigger>
          </TabsList>
          <TabsContent value="body" className="flex-grow mt-2">
            <pre className="text-xs bg-muted p-4 rounded-md h-full overflow-auto">
              <code>{renderBody()}</code>
            </pre>
          </TabsContent>
          <TabsContent value="headers" className="p-2">
             <pre className="text-xs bg-muted p-4 rounded-md h-full overflow-auto">
              <code>{JSON.stringify(response.headers, null, 2)}</code>
            </pre>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
}
