'use client';

import type { Dispatch, SetStateAction } from 'react';
import React from 'react';
import { formatDistanceToNow } from 'date-fns';
import {
  SidebarContent,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupLabel,
} from '@/components/ui/sidebar';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import {
  Clock,
  Download,
  History,
  Info,
  Play,
  Trash2,
  Upload,
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

interface HistoryPanelProps {
  history: HistoryItem[];
  setHistory: Dispatch<SetStateAction<HistoryItem[]>>;
  onLoad: (item: HistoryItem) => void;
  onRerun: (config: TestConfiguration) => void;
}

export function HistoryPanel({
  history,
  setHistory,
  onLoad,
  onRerun,
}: HistoryPanelProps) {
  const { toast } = useToast();
  const fileInputRef = React.useRef<HTMLInputElement>(null);
  const [itemToDelete, setItemToDelete] = React.useState<string | null>(null);

  const handleExport = React.useCallback(() => {
    try {
      const dataStr = JSON.stringify(history, null, 2);
      const dataBlob = new Blob([dataStr], { type: 'application/json' });
      const url = window.URL.createObjectURL(dataBlob);
      const link = document.createElement('a');
      link.href = url;
      link.download = 'k6-commander-history.json';
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
            if (Array.isArray(importedHistory)) {
              setHistory(importedHistory);
              toast({
                title: 'History Imported',
                description: 'Successfully loaded test history from file.',
              });
            } else {
              throw new Error('Invalid file format');
            }
          }
        } catch (error) {
          toast({
            variant: 'destructive',
            title: 'Import Failed',
            description: 'The selected file is not valid JSON history file.',
          });
        }
      };
      reader.readAsText(file);
    }
    if (fileInputRef.current) {
        fileInputRef.current.value = '';
    }
  }, [setHistory, toast]);

  const confirmDelete = React.useCallback(() => {
    if(itemToDelete) {
        setHistory(prevHistory => prevHistory.filter((item) => item.id !== itemToDelete));
        setItemToDelete(null);
    }
  }, [itemToDelete, setHistory]);
  
  const handleDeleteAll = React.useCallback(() => {
    setHistory([]);
    toast({
      title: 'History Cleared',
      description: 'All test runs have been deleted.',
    });
  }, [setHistory, toast]);
  
  return (
    <>
      <SidebarHeader>
        <div className="flex items-center justify-center gap-2 p-2">
          <History className="h-6 w-6" />
          <h2 className="text-lg font-semibold tracking-tight">Test History</h2>
        </div>
      </SidebarHeader>
      <ScrollArea className="flex-1">
        <SidebarContent>
          <SidebarMenu>
            {history.length === 0 ? (
              <div className="flex flex-col items-center justify-center p-4 text-center text-sm text-muted-foreground">
                <Info className="mb-2 h-8 w-8" />
                <p>No test history found.</p>
                <p>Run tests to see them here.</p>
              </div>
            ) : (
              history.map((item) => (
                <SidebarMenuItem key={item.id} className="group/menu-item">
                  <SidebarMenuButton
                    className="h-auto flex-col items-start p-2"
                    onClick={() => onLoad(item)}
                    tooltip={{
                      children: 'View Summary',
                      side: 'right',
                      align: 'center',
                    }}
                  >
                    <span className="font-semibold truncate w-full" title={item.config.url}>{item.config.url}</span>
                    <div className="flex items-center gap-2 text-xs text-muted-foreground">
                      <Clock className="h-3 w-3" />
                      <span>
                        {formatDistanceToNow(new Date(item.timestamp), {
                          addSuffix: true,
                        })}
                      </span>
                    </div>
                  </SidebarMenuButton>
                  <div className="absolute right-1 top-1 flex items-center gap-1 opacity-0 group-hover/menu-item:opacity-100 transition-opacity">
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-7 w-7"
                      onClick={() => onRerun(item.config)}
                    >
                      <Play className="h-4 w-4" />
                    </Button>
                    <AlertDialog>
                      <AlertDialogTrigger asChild>
                         <Button variant="ghost" size="icon" className="h-7 w-7 hover:bg-destructive/10 hover:text-destructive" onClick={() => setItemToDelete(item.id)}>
                           <Trash2 className="h-4 w-4" />
                         </Button>
                      </AlertDialogTrigger>
                      <AlertDialogContent>
                        <AlertDialogHeader>
                          <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                          <AlertDialogDescription>
                            This action cannot be undone. This will permanently delete this test run from your local history.
                          </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                          <AlertDialogCancel onClick={() => setItemToDelete(null)}>Cancel</AlertDialogCancel>
                          <AlertDialogAction onClick={confirmDelete} className="bg-destructive hover:bg-destructive/90">Delete</AlertDialogAction>
                        </AlertDialogFooter>
                      </AlertDialogContent>
                    </AlertDialog>
                  </div>
                </SidebarMenuItem>
              ))
            )}
          </SidebarMenu>
        </SidebarContent>
      </ScrollArea>
      <SidebarFooter>
        <SidebarGroup>
          <SidebarGroupLabel>Manage History</SidebarGroupLabel>
          <div className="flex flex-col gap-2">
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
        </SidebarGroup>
      </SidebarFooter>
    </>
  );
}
