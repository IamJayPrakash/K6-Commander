'use client';

import type { Dispatch, SetStateAction } from 'react';
import React from 'react';
import { format, formatDistanceToNow } from 'date-fns';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import {
  Download,
  History,
  Info,
  Play,
  Trash2,
  Upload,
  Eye,
  Gauge,
  Search as SearchIcon,
  ShieldCheck,
  Clock,
  X,
  BrainCircuit,
} from 'lucide-react';
import type { HistoryItem, TestConfiguration } from '@/types';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog';
import { useToast } from '@/hooks/use-toast';
import { ScrollArea } from '@/components/ui/scroll-area';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Badge } from '../ui/badge';
import { Input } from '../ui/input';
import { useTranslation } from 'react-i18next';
import { useLocalStorage } from '@/hooks/use-local-storage';

interface HistoryPageProps {
  history: HistoryItem[];
  setHistory: (value: HistoryItem[] | ((prev: HistoryItem[]) => HistoryItem[])) => void;
  lastSaved: string | null;
  onLoad: (item: HistoryItem) => void;
  onRerun: (config: TestConfiguration) => void;
}

export default function HistoryPageComponent({
  history,
  setHistory,
  lastSaved,
  onLoad,
  onRerun,
}: HistoryPageProps) {
  const { toast } = useToast();
  const { t } = useTranslation();
  const fileInputRef = React.useRef<HTMLInputElement>(null);
  const [searchQuery, setSearchQuery] = React.useState('');
  // We need to manage recent URLs here as well to clear them.
  const [, setRecentUrls] = useLocalStorage<string[]>('k6-recent-urls', []);

  const filteredHistory = React.useMemo(() => {
    if (!searchQuery) return history;
    return history.filter(
      (item) =>
        item.config.url.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.id.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }, [history, searchQuery]);

  const handleExport = React.useCallback(() => {
    if (history.length === 0) return;
    try {
      const dataStr = JSON.stringify(history, null, 2);
      const dataBlob = new Blob([dataStr], { type: 'application/json' });
      const url = window.URL.createObjectURL(dataBlob);
      const link = document.createElement('a');
      link.download = `k6-commander-history-${new Date().toISOString().split('T')[0]}.json`;
      link.href = url;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);
      toast({
        title: t('history.toast.exportSuccessTitle'),
        description: t('history.toast.exportSuccessDescription'),
      });
    } catch (error) {
      toast({
        variant: 'destructive',
        title: t('history.toast.exportFailTitle'),
        description: t('history.toast.exportFailDescription'),
      });
    }
  }, [history, toast, t]);

  const handleImportClick = React.useCallback(() => {
    fileInputRef.current?.click();
  }, []);

  const handleFileChange = React.useCallback(
    (event: React.ChangeEvent<HTMLInputElement>) => {
      const file = event.target.files?.[0];
      if (file) {
        const reader = new FileReader();
        reader.onload = (e) => {
          try {
            const content = e.target?.result;
            if (typeof content === 'string') {
              const importedHistory = JSON.parse(content) as HistoryItem[];
              // Basic validation
              if (
                Array.isArray(importedHistory) &&
                importedHistory.every(
                  (item) => item.id && item.timestamp && item.config && item.results
                )
              ) {
                setHistory(importedHistory);
                toast({
                  title: t('history.toast.importSuccessTitle'),
                  description: t('history.toast.importSuccessDescription'),
                });
              } else {
                throw new Error(t('history.toast.importInvalidFormat'));
              }
            }
          } catch (error) {
            toast({
              variant: 'destructive',
              title: t('history.toast.importFailTitle'),
              description:
                error instanceof Error ? error.message : t('history.toast.importFailDescription'),
            });
          }
        };
        reader.readAsText(file);
      }
      // Reset file input
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    },
    [setHistory, toast, t]
  );

  const handleDelete = React.useCallback(
    (id: string) => {
      setHistory((prevHistory) => prevHistory.filter((item) => item.id !== id));
      toast({
        title: t('history.toast.deleteSuccessTitle'),
        description: t('history.toast.deleteSuccessDescription'),
      });
    },
    [setHistory, toast, t]
  );

  const handleDeleteAll = React.useCallback(() => {
    setHistory([]);
    setRecentUrls([]); // Also clear recent URLs
    toast({
      title: t('history.toast.clearSuccessTitle'),
      description: t('history.toast.clearSuccessDescription'),
    });
  }, [setHistory, setRecentUrls, toast, t]);

  return (
    <>
      <Card className="bg-card/50 backdrop-blur-sm" data-testid="history-page-card">
        <CardHeader>
          <div className="flex justify-between items-start">
            <div>
              <CardTitle className="flex items-center gap-2 text-2xl">
                <History className="text-primary" /> {t('history.title')}
              </CardTitle>
              <CardDescription>{t('history.description')}</CardDescription>
            </div>
            {lastSaved && (
              <div className="text-xs text-muted-foreground text-right flex-shrink-0">
                <p>{t('history.lastSaved')}:</p>
                <p className="flex items-center gap-1 justify-end">
                  <Clock className="h-3 w-3" />{' '}
                  {formatDistanceToNow(new Date(lastSaved), { addSuffix: true })}
                </p>
              </div>
            )}
          </div>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col md:flex-row justify-between items-center mb-4 gap-4">
            <div className="flex gap-2">
              <Button
                variant="outline"
                onClick={handleImportClick}
                data-testid="import-history-button"
              >
                <Upload className="mr-2 h-4 w-4" /> {t('history.importButton')}
              </Button>
              <input
                type="file"
                ref={fileInputRef}
                onChange={handleFileChange}
                accept=".json"
                className="hidden"
                aria-hidden="true"
                data-testid="import-history-input"
              />
              <Button
                variant="outline"
                onClick={handleExport}
                disabled={history.length === 0}
                data-testid="export-history-button"
              >
                <Download className="mr-2 h-4 w-4" /> {t('history.exportButton')}
              </Button>
            </div>
            <div className="relative w-full md:w-auto md:max-w-xs">
              <SearchIcon className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder={t('history.searchPlaceholder')}
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
                data-testid="history-search-input"
              />
              {searchQuery && (
                <Button
                  variant="ghost"
                  size="icon"
                  className="absolute right-1 top-1/2 -translate-y-1/2 h-7 w-7"
                  onClick={() => setSearchQuery('')}
                  aria-label={t('history.clearSearchLabel')}
                >
                  <X className="h-4 w-4" />
                </Button>
              )}
            </div>
            <AlertDialog>
              <AlertDialogTrigger asChild>
                <Button
                  variant="destructive"
                  disabled={history.length === 0}
                  data-testid="clear-all-history-button"
                >
                  <Trash2 className="mr-2 h-4 w-4" /> {t('history.clearAllButton')}
                </Button>
              </AlertDialogTrigger>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>{t('history.clearAllDialog.title')}</AlertDialogTitle>
                  <AlertDialogDescription>
                    {t('history.clearAllDialog.description')}
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel>{t('history.clearAllDialog.cancel')}</AlertDialogCancel>
                  <AlertDialogAction
                    onClick={handleDeleteAll}
                    className="bg-destructive hover:bg-destructive/90"
                  >
                    {t('history.clearAllDialog.confirm')}
                  </AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          </div>
          <ScrollArea className="h-[50vh] rounded-md border">
            {history.length === 0 ? (
              <div
                className="flex flex-col items-center justify-center h-full p-4 text-center text-muted-foreground"
                data-testid="no-history-message"
              >
                <Info className="mb-2 h-8 w-8" />
                <p className="font-semibold">{t('history.noHistoryMessage')}</p>
                <p className="text-sm">{t('history.noHistoryDescription')}</p>
              </div>
            ) : (
              <Table data-testid="history-table">
                <TableHeader>
                  <TableRow>
                    <TableHead>{t('history.table.url')}</TableHead>
                    <TableHead>{t('history.table.date')}</TableHead>
                    <TableHead>{t('history.table.testsRun')}</TableHead>
                    <TableHead className="text-right">{t('history.table.actions')}</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredHistory.map((item) => (
                    <TableRow key={item.id} data-testid={`history-item-${item.id}`}>
                      <TableCell className="font-medium truncate max-w-xs" title={item.config.url}>
                        {item.config.url}
                      </TableCell>
                      <TableCell>{format(new Date(item.timestamp), 'PPp')}</TableCell>
                      <TableCell>
                        <div className="flex gap-2 flex-wrap">
                          {item.config.runLoadTest && (
                            <Badge variant="outline">
                              <Gauge className="mr-1 h-3 w-3" />
                              {t('form.k6SwitchLabel')}
                            </Badge>
                          )}
                          {item.config.runLighthouse && (
                            <Badge variant="outline">
                              <ShieldCheck className="mr-1 h-3 w-3" />
                              {t('form.lighthouseSwitchLabel')}
                            </Badge>
                          )}
                          {item.config.runSeo && (
                            <Badge variant="outline">
                              <BrainCircuit className="mr-1 h-3 w-3" />
                              {t('form.seoSwitchLabel')}
                            </Badge>
                          )}
                        </div>
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex items-center justify-end gap-1">
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => onLoad(item)}
                            aria-label={t('history.actions.view', { url: item.config.url })}
                            data-testid={`view-history-item-${item.id}`}
                          >
                            <Eye className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => onRerun(item.config)}
                            aria-label={t('history.actions.rerun', { url: item.config.url })}
                            data-testid={`rerun-history-item-${item.id}`}
                          >
                            <Play className="h-4 w-4" />
                          </Button>
                          <AlertDialog>
                            <AlertDialogTrigger asChild>
                              <Button
                                variant="ghost"
                                size="icon"
                                className="hover:text-destructive"
                                aria-label={t('history.actions.delete', { url: item.config.url })}
                                data-testid={`delete-history-item-trigger-${item.id}`}
                              >
                                <Trash2 className="h-4 w-4" />
                              </Button>
                            </AlertDialogTrigger>
                            <AlertDialogContent>
                              <AlertDialogHeader>
                                <AlertDialogTitle>
                                  {t('history.deleteDialog.title')}
                                </AlertDialogTitle>
                                <AlertDialogDescription>
                                  {t('history.deleteDialog.description')}
                                </AlertDialogDescription>
                              </AlertDialogHeader>
                              <AlertDialogFooter>
                                <AlertDialogCancel>
                                  {t('history.deleteDialog.cancel')}
                                </AlertDialogCancel>
                                <AlertDialogAction
                                  onClick={() => handleDelete(item.id)}
                                  className="bg-destructive hover:bg-destructive/90"
                                >
                                  {t('history.deleteDialog.confirm')}
                                </AlertDialogAction>
                              </AlertDialogFooter>
                            </AlertDialogContent>
                          </AlertDialog>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            )}
            {filteredHistory.length === 0 && history.length > 0 && (
              <div
                className="flex flex-col items-center justify-center h-full p-4 text-center text-muted-foreground"
                data-testid="no-search-results-message"
              >
                <Info className="mb-2 h-8 w-8" />
                <p>{t('history.noResultsFound', { query: searchQuery })}</p>
                <Button variant="link" onClick={() => setSearchQuery('')}>
                  {t('history.clearSearch')}
                </Button>
              </div>
            )}
          </ScrollArea>
        </CardContent>
      </Card>
    </>
  );
}
