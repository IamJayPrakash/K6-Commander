
'use client';

import type { Dispatch, SetStateAction } from 'react';
import React from 'react';
import { format } from 'date-fns';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
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
  Search,
  ShieldCheck,
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
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '../ui/badge';

interface HistoryPageProps {
  history: HistoryItem[];
  setHistory: Dispatch<SetStateAction<HistoryItem[]>>;
  onLoad: (item: HistoryItem) => void;
  onRerun: (config: TestConfiguration) => void;
}

export default function HistoryPage({
  history,
  setHistory,
  onLoad,
  onRerun,
}: HistoryPageProps) {
  const { toast } = useToast();
  const fileInputRef = React.useRef<HTMLInputElement>(null);

  const handleExport = React.useCallback(() => {
    if (history.length === 0) return;
    try {
      const dataStr = JSON.stringify(history, null, 2);
      const dataBlob = new Blob([dataStr], { type: 'application/json' });
      const url = window.URL.createObjectURL(dataBlob);
      const link = document.createElement('a');
      link.download = `k6-commander-history-${new Date().toISOString()}.json`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);
      toast({
        title: 'History Exported',
        description: 'Your test history has been saved.',
      });
    } catch (error) {
       toast({
        variant: 'destructive',
        title: 'Export Failed',
        description: 'Could not export history.',
      });
    }
  }, [history, toast]);

  const handleImportClick = React.useCallback(() => {
    fileInputRef.current?.click();
  }, []);

  const handleFileChange = React.useCallback((event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        try {
          const content = e.target?.result;
          if (typeof content === 'string') {
            const importedHistory = JSON.parse(content) as HistoryItem[];
            // Basic validation
            if (Array.isArray(importedHistory) && importedHistory.every(item => item.id && item.timestamp && item.config && item.results)) {
              setHistory(importedHistory);
              toast({
                title: 'History Imported',
                description: 'Successfully loaded test history from file.',
              });
            } else {
              throw new Error('Invalid file format. The file must be an array of valid history items.');
            }
          }
        } catch (error) {
          toast({
            variant: 'destructive',
            title: 'Import Failed',
            description: error instanceof Error ? error.message : 'The selected file is not a valid JSON history file.',
          });
        }
      };
      reader.readAsText(file);
    }
    // Reset file input
    if (fileInputRef.current) {
        fileInputRef.current.value = '';
    }
  }, [setHistory, toast]);

  const handleDelete = React.useCallback((id: string) => {
    setHistory(prevHistory => prevHistory.filter((item) => item.id !== id));
  }, [setHistory]);

  const handleDeleteAll = React.useCallback(() => {
    setHistory([]);
    toast({
      title: 'History Cleared',
      description: 'All test runs have been deleted.',
    });
  }, [setHistory, toast]);

  return (
    <>
      <Card className="bg-card/50 backdrop-blur-sm">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-2xl">
            <History className="text-primary" /> Test History
          </CardTitle>
          <CardDescription>
            Review, re-run, or manage your past test sessions.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex justify-between items-center mb-4">
            <div className="flex gap-2">
                <Button variant="outline" onClick={handleImportClick}>
                    <Upload className="mr-2 h-4 w-4" /> Import
                </Button>
                <input
                    type="file"
                    ref={fileInputRef}
                    onChange={handleFileChange}
                    accept=".json"
                    className="hidden"
                />
                <Button variant="outline" onClick={handleExport} disabled={history.length === 0}>
                    <Download className="mr-2 h-4 w-4" /> Export
                </Button>
            </div>
            <AlertDialog>
                <AlertDialogTrigger asChild>
                    <Button variant="destructive" disabled={history.length === 0}>
                    <Trash2 className="mr-2 h-4 w-4" /> Clear All
                    </Button>
                </AlertDialogTrigger>
                <AlertDialogContent>
                    <AlertDialogHeader>
                    <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                    <AlertDialogDescription>
                        This will permanently delete all test runs from your history. This action cannot be undone.
                    </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                    <AlertDialogCancel>Cancel</AlertDialogCancel>
                    <AlertDialogAction onClick={handleDeleteAll} className="bg-destructive hover:bg-destructive/90">Yes, delete all</AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>
          </div>
          <ScrollArea className="h-[50vh] rounded-md border">
            {history.length === 0 ? (
              <div className="flex flex-col items-center justify-center h-full p-4 text-center text-muted-foreground">
                <Info className="mb-2 h-8 w-8" />
                <p>No test history found.</p>
                <p>Run tests to see them here.</p>
              </div>
            ) : (
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead>URL</TableHead>
                            <TableHead>Date</TableHead>
                            <TableHead>Tests Run</TableHead>
                            <TableHead className="text-right">Actions</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {history.map((item) => (
                            <TableRow key={item.id}>
                                <TableCell className="font-medium truncate max-w-xs">{item.config.url}</TableCell>
                                <TableCell>{format(new Date(item.timestamp), "PPp")}</TableCell>
                                <TableCell>
                                  <div className='flex gap-2'>
                                    {item.config.runLoadTest && <Badge variant="outline"><Gauge className="mr-1 h-3 w-3"/>Load</Badge>}
                                    {item.config.runLighthouse && <Badge variant="outline"><ShieldCheck className="mr-1 h-3 w-3"/>Lighthouse</Badge>}
                                    {item.config.runSeo && <Badge variant="outline"><Search className="mr-1 h-3 w-3"/>SEO</Badge>}
                                  </div>
                                </TableCell>
                                <TableCell className="text-right">
                                    <div className="flex items-center justify-end gap-2">
                                        <Button variant="ghost" size="icon" onClick={() => onLoad(item)}><Eye className="h-4 w-4"/></Button>
                                        <Button variant="ghost" size="icon" onClick={() => onRerun(item.config)}><Play className="h-4 w-4"/></Button>
                                        <AlertDialog>
                                            <AlertDialogTrigger asChild>
                                                <Button variant="ghost" size="icon" className="hover:text-destructive"><Trash2 className="h-4 w-4"/></Button>
                                            </AlertDialogTrigger>
                                            <AlertDialogContent>
                                                <AlertDialogHeader>
                                                <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                                                <AlertDialogDescription>
                                                    This action will permanently delete this test run.
                                                </AlertDialogDescription>
                                                </AlertDialogHeader>
                                                <AlertDialogFooter>
                                                <AlertDialogCancel>Cancel</AlertDialogCancel>
                                                <AlertDialogAction onClick={() => handleDelete(item.id)} className="bg-destructive hover:bg-destructive/90">Delete</AlertDialogAction>
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
          </ScrollArea>
        </CardContent>
      </Card>
    </>
  );
}

