'use client';

import React, { useState } from 'react';
import type { Dispatch, SetStateAction } from 'react';
import {
  Card,
  CardContent,
  CardHeader,
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
  DialogTrigger,
} from '@/components/ui/dialog';
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
import { ScrollArea } from '@/components/ui/scroll-area';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Plus, History, Trash2, MoreVertical } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';
import type { ApiTestCollection, ApiTestItem } from '@/types/index';
import { cn } from '@/lib/utils';
import { useToast } from '@/hooks/use-toast';
import { v4 as uuidv4 } from 'uuid';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { useTranslation } from 'react-i18next';


interface ApiTestHistoryProps {
  collections: ApiTestCollection[];
  setCollections: Dispatch<SetStateAction<ApiTestCollection[]>>;
  activeCollectionId: string;
  setActiveCollectionId: Dispatch<SetStateAction<string>>;
  onSelectRequest: (item: ApiTestItem | null) => void;
  selectedRequestId?: string | null;
}

const NewCollectionDialog = ({
  onAddCollection,
}: {
  onAddCollection: (name: string) => void;
}) => {
  const [open, setOpen] = useState(false);
  const [name, setName] = useState('');
  const { t } = useTranslation();

  const handleAdd = () => {
    if (name.trim()) {
      onAddCollection(name.trim());
      setName('');
      setOpen(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="ghost" size="icon" title={t('apiTester.newCollectionTitle')}>
          <Plus className="h-4 w-4" />
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{t('apiTester.newCollectionTitle')}</DialogTitle>
          <DialogDescription>{t('apiTester.newCollectionDescription')}</DialogDescription>
        </DialogHeader>
        <div className="py-4">
          <Input
            placeholder="My New API Collection"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
        </div>
        <DialogFooter>
          <Button onClick={handleAdd}>{t('apiTester.createButton')}</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default function ApiTestHistory({
  collections,
  setCollections,
  activeCollectionId,
  setActiveCollectionId,
  onSelectRequest,
  selectedRequestId,
}: ApiTestHistoryProps) {
  const { toast } = useToast();
  const { t } = useTranslation();

  const activeCollection = collections.find((c) => c.id === activeCollectionId);

  const handleAddCollection = (name: string) => {
    const newCollection: ApiTestCollection = {
      id: uuidv4(),
      name,
      requests: [],
    };
    setCollections((prev) => [...prev, newCollection]);
    setActiveCollectionId(newCollection.id);
    toast({ title: t('apiTester.toast.collectionCreated', { name }) });
  };

  const handleDeleteRequest = (e: React.MouseEvent, collectionId: string, requestId: string) => {
    e.stopPropagation();
    setCollections((prev) =>
      prev.map((c) => {
        if (c.id === collectionId) {
          return { ...c, requests: c.requests.filter((r) => r.id !== requestId) };
        }
        return c;
      })
    );
    onSelectRequest(null);
    toast({ title: t('apiTester.toast.requestDeleted') });
  };

  const handleDeleteCollection = (collectionId: string) => {
    if (collectionId === 'default') {
      toast({
        variant: 'destructive',
        title: t('apiTester.toast.cannotDeleteDefault'),
      });
      return;
    }
    setCollections((prev) => prev.filter((c) => c.id !== collectionId));
    setActiveCollectionId('default'); // Switch to default collection
    toast({ title: t('apiTester.toast.collectionDeleted') });
  };

  const handleSelectRequest = (request: ApiTestItem) => {
    onSelectRequest(request);
  };

  return (
    <Card className="h-full flex flex-col border-0 shadow-none">
      <CardHeader className="p-2 border-b">
        <div className="flex items-center gap-1">
          <Select value={activeCollectionId} onValueChange={setActiveCollectionId}>
            <SelectTrigger className="flex-1">
              <SelectValue placeholder={t('apiTester.selectCollectionPlaceholder')} />
            </SelectTrigger>
            <SelectContent>
              {collections.map((c) => (
                <SelectItem key={c.id} value={c.id}>
                  {c.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <NewCollectionDialog onAddCollection={handleAddCollection} />
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon">
                <MoreVertical className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent>
              <AlertDialog>
                <AlertDialogTrigger asChild>
                  <DropdownMenuItem
                    onSelect={(e) => e.preventDefault()}
                    disabled={activeCollectionId === 'default'}
                    className="text-destructive focus:text-destructive"
                  >
                    <Trash2 className="mr-2 h-4 w-4" />
                    {t('apiTester.deleteCollectionButton')}
                  </DropdownMenuItem>
                </AlertDialogTrigger>
                <AlertDialogContent>
                  <AlertDialogHeader>
                    <AlertDialogTitle>{t('apiTester.deleteCollectionDialog.title')}</AlertDialogTitle>
                    <AlertDialogDescription>
                      {t('apiTester.deleteCollectionDialog.description', { name: activeCollection?.name })}
                    </AlertDialogDescription>
                  </AlertDialogHeader>
                  <AlertDialogFooter>
                    <AlertDialogCancel>{t('apiTester.cancelButton')}</AlertDialogCancel>
                    <AlertDialogAction
                      onClick={() => handleDeleteCollection(activeCollectionId)}
                      className="bg-destructive hover:bg-destructive/90"
                    >
                      {t('apiTester.deleteButton')}
                    </AlertDialogAction>
                  </AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialog>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </CardHeader>
      <CardContent className="p-0 flex-grow">
        <ScrollArea className="h-full">
          {activeCollection && activeCollection.requests?.length > 0 ? (
            activeCollection.requests.map((item) => (
              <div
                key={item.id}
                onClick={() => handleSelectRequest(item)}
                className={cn(
                  'group flex justify-between items-start text-left p-2 cursor-pointer hover:bg-muted/50',
                  selectedRequestId === item.id && 'bg-accent/80'
                )}
              >
                <div className="flex-1 overflow-hidden">
                  <div
                    className={cn(
                      'font-mono text-xs rounded-sm px-1 w-fit mb-1',
                      item.request.method === 'GET' && 'bg-blue-900/80 text-blue-300',
                      item.request.method === 'POST' && 'bg-green-900/80 text-green-300',
                      item.request.method === 'PUT' && 'bg-yellow-900/80 text-yellow-300',
                      item.request.method === 'PATCH' && 'bg-orange-900/80 text-orange-300',
                      item.request.method === 'DELETE' && 'bg-red-900/80 text-red-300'
                    )}
                  >
                    {item.request.method}
                  </div>
                  <p className="text-sm truncate" title={item.request.url}>
                    {item.request.url}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    {formatDistanceToNow(new Date(item.createdAt), { addSuffix: true })}
                  </p>
                </div>

                <AlertDialog>
                  <AlertDialogTrigger asChild>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-6 w-6 opacity-0 group-hover:opacity-100 hover:text-destructive"
                      onClick={(e) => e.stopPropagation()}
                      title={t('apiTester.deleteRequestTitle')}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </AlertDialogTrigger>
                  <AlertDialogContent>
                    <AlertDialogHeader>
                      <AlertDialogTitle>{t('apiTester.deleteRequestDialog.title')}</AlertDialogTitle>
                      <AlertDialogDescription>
                       {t('apiTester.deleteRequestDialog.description')}
                      </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                      <AlertDialogCancel>{t('apiTester.cancelButton')}</AlertDialogCancel>
                      <AlertDialogAction
                        onClick={(e) => handleDeleteRequest(e, activeCollection.id, item.id)}
                        className="bg-destructive hover:bg-destructive/90"
                      >
                       {t('apiTester.deleteButton')}
                      </AlertDialogAction>
                    </AlertDialogFooter>
                  </AlertDialogContent>
                </AlertDialog>
              </div>
            ))
          ) : (
            <div className="flex flex-col items-center justify-center h-full text-center text-muted-foreground p-4">
              <History className="h-8 w-8 mb-2" />
              <p className="font-semibold">{t('apiTester.noRequestsTitle')}</p>
              <p className="text-sm">{t('apiTester.noRequestsDescription')}</p>
            </div>
          )}
        </ScrollArea>
      </CardContent>
    </Card>
  );
}