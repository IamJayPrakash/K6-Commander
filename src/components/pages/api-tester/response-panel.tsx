'use client';

import React from 'react';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Loader, Clipboard, Check, Clock, Server, Database } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { useToast } from '@/hooks/use-toast';

interface ResponsePanelProps {
  response: any;
  isLoading: boolean;
}

export default function ResponsePanel({ response, isLoading }: ResponsePanelProps) {
  const { t } = useTranslation();
  const { toast } = useToast();
  const [isCopied, setIsCopied] = React.useState(false);

  const getStatusColor = (status: number | string) => {
    if (typeof status !== 'number') return 'bg-gray-500';
    if (status >= 200 && status < 300) return 'bg-green-500';
    if (status >= 300 && status < 400) return 'bg-yellow-500';
    if (status >= 400) return 'bg-red-500';
    return 'bg-gray-500';
  };

  const renderBody = () => {
    if (!response?.body) return '';
    if (typeof response.body === 'object') {
      try {
        return JSON.stringify(response.body, null, 2);
      } catch (error) {
        return String(response.body);
      }
    }
    return String(response.body);
  };

  const handleCopy = () => {
    const bodyToCopy = renderBody();
    navigator.clipboard.writeText(bodyToCopy).then(
      () => {
        setIsCopied(true);
        toast({ title: t('apiTester.toast.apiBodyCopied') });
        setTimeout(() => setIsCopied(false), 2000);
      },
      (err) => {
        toast({
          variant: 'destructive',
          title: t('apiTester.toast.apiCopyErrorTitle'),
          description: err.message,
        });
      }
    );
  };

  if (isLoading) {
    return (
      <div
        className="flex flex-col h-full items-center justify-center text-muted-foreground"
        data-testid="response-loading"
        role="status"
        aria-live="polite"
      >
        <Loader className="animate-spin h-8 w-8 mb-2" />
        <p>{t('apiTester.loadingResponse')}</p>
      </div>
    );
  }

  if (!response) {
    return (
      <div
        className="flex flex-col h-full items-center justify-center text-muted-foreground text-center"
        data-testid="no-response-message"
      >
        <p className="text-lg font-semibold">{t('apiTester.noResponseYet')}</p>
        <p className="text-sm">{t('apiTester.noResponseYetDesc')}</p>
      </div>
    );
  }

  return (
    <Card className="h-full border-0 shadow-none" data-testid="response-panel-card">
      <CardContent className="p-2 h-full flex flex-col">
        <div
          className="flex flex-wrap items-center gap-4 mb-2 p-2"
          data-testid="response-status-badges"
        >
          <Badge
            className={`${getStatusColor(response.status)} hover:${getStatusColor(
              response.status
            )} flex items-center gap-1.5`}
            data-testid="response-status-badge"
          >
            <Server className="h-3.5 w-3.5" />
            <span>
              {t('apiTester.status')}: {response.status} {response.statusText}
            </span>
          </Badge>
          <Badge variant="outline" data-testid="response-time-badge" className="flex items-center gap-1.5">
            <Clock className="h-3.5 w-3.5" />
            <span>
              {t('apiTester.time')}: {response.duration}ms
            </span>
          </Badge>
          <Badge variant="outline" data-testid="response-size-badge" className="flex items-center gap-1.5">
            <Database className="h-3.5 w-3.5" />
            <span>
              {t('apiTester.size')}: {response.size} B
            </span>
          </Badge>
        </div>
        <Tabs defaultValue="body" className="w-full flex-grow flex flex-col">
          <TabsList data-testid="response-panel-tabs">
            <TabsTrigger value="body" data-testid="response-body-tab-trigger">
              {t('apiTester.bodyTab')}
            </TabsTrigger>
            <TabsTrigger value="headers" data-testid="response-headers-tab-trigger">
              {t('apiTester.headersTab')}
            </TabsTrigger>
          </TabsList>
          <TabsContent
            value="body"
            className="flex-grow mt-2 relative"
            data-testid="response-body-tab-content"
          >
            <Button
              variant="ghost"
              size="icon"
              className="absolute top-2 right-2 h-7 w-7"
              onClick={handleCopy}
              disabled={!response?.body}
              data-testid="copy-response-body-button"
              aria-label={t('apiTester.copyBodyAriaLabel')}
            >
              {isCopied ? (
                <Check className="h-4 w-4 text-green-500" />
              ) : (
                <Clipboard className="h-4 w-4" />
              )}
            </Button>
            <pre className="text-xs bg-muted p-4 rounded-md h-full overflow-auto">
              <code>{renderBody()}</code>
            </pre>
          </TabsContent>
          <TabsContent
            value="headers"
            className="p-2 flex-grow"
            data-testid="response-headers-tab-content"
          >
            <pre className="text-xs bg-muted p-4 rounded-md h-full overflow-auto">
              <code>{JSON.stringify(response.headers, null, 2)}</code>
            </pre>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
}