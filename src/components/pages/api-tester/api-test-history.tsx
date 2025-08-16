'use client';

import React, { useState } from 'react';
import type { Dispatch, SetStateAction } from 'react';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from '@/components/ui/collapsible';
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
import { ScrollArea } from '@/components/ui/scroll-area';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Folder, Plus, History, ChevronsUpDown, Trash2 } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';
import type { ApiTestCollection, ApiTestItem } from '@/types/index';
import { cn } from '@/lib/utils';
import { useToast } from '@/hooks/use-toast';
import { v4 as uuidv4 } from 'uuid';

interface ApiTestHistoryProps {
  collections: ApiTestCollection[];
  setCollections: Dispatch<SetStateAction<ApiTestCollection[]>>;
  activeCollectionId: string;
  setActiveCollectionId: Dispatch<SetStateAction<string>>;
  onSelectRequest: (item: ApiTestItem | null) => void;
}

const NewCollectionDialog = ({
  onAddCollection,
}: {
  onAddCollection: (name: string) => void;
}) => {
  const [open, setOpen] = useState(false);
  const [name, setName] = useState('');

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
        <Button variant="ghost" size="icon">
          <Plus className="h-4 w-4" />
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Create New Collection</DialogTitle>
          <DialogDescription>
            Collections help you group related API requests.
          </DialogDescription>
        </DialogHeader>
        <div className="py-4">
          <Input
            placeholder="My New API Collection"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
        </div>
        <DialogFooter>
          <Button onClick={handleAdd}>Create</Button>
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
}: ApiTestHistoryProps) {
  const { toast } = useToast();
  const [selectedRequestId, setSelectedRequestId] = useState<string | null>(null);

  const activeCollection = collections.find((c) => c.id === activeCollectionId) || collections[0];

  const handleAddCollection = (name: string) => {
    const newCollection: ApiTestCollection = {
      id: uuidv4(),
      name,
      requests: [],
    };
    setCollections((prev) => [...prev, newCollection]);
    setActiveCollectionId(newCollection.id);
    toast({ title: `Collection "${name}" created!` });
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
  };

  const handleSelectRequest = (request: ApiTestItem) => {
    onSelectRequest(request);
    setSelectedRequestId(request.id);
  };

  return (
    <Card className="h-full flex flex-col border-0 shadow-none">
      <CardHeader className="p-2 border-b">
        <div className="flex items-center gap-2">
          <Select value={activeCollectionId} onValueChange={setActiveCollectionId}>
            <SelectTrigger className="flex-1">
              <SelectValue placeholder="Select a collection" />
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
        </div>
      </CardHeader>
      <CardContent className="p-0 flex-grow">
        <ScrollArea className="h-full">
          {activeCollection && activeCollection.requests.length > 0 ? (
            activeCollection.requests.map((item) => (
              <div
                key={item.id}
                onClick={() => handleSelectRequest(item)}
                className={cn(
                  'group flex justify-between items-start text-left p-2 cursor-pointer hover:bg-accent',
                  selectedRequestId === item.id && 'bg-accent/80'
                )}
              >
                <div className="flex-1 overflow-hidden">
                  <div
                    className={cn(
                      'font-mono text-xs rounded-sm px-1 w-fit mb-1',
                      item.request.method === 'GET' && 'bg-blue-500/20 text-blue-300',
                      item.request.method === 'POST' && 'bg-green-500/20 text-green-300',
                      item.request.method === 'PUT' && 'bg-yellow-500/20 text-yellow-300',
                      item.request.method === 'PATCH' && 'bg-orange-500/20 text-orange-300',
                      item.request.method === 'DELETE' && 'bg-red-500/20 text-red-300'
                    )}
                  >
                    {item.request.method}
                  </div>
                  <p className="text-sm truncate" title={item.name}>
                    {item.name}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    {formatDistanceToNow(new Date(item.createdAt), { addSuffix: true })}
                  </p>
                </div>
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-6 w-6 opacity-0 group-hover:opacity-100"
                  onClick={(e) => handleDeleteRequest(e, activeCollection.id, item.id)}
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            ))
          ) : (
            <div className="flex flex-col items-center justify-center h-full text-center text-muted-foreground p-4">
              <History className="h-8 w-8 mb-2" />
              <p className="font-semibold">No Requests Yet</p>
              <p className="text-sm">Your sent requests will appear here.</p>
            </div>
          )}
        </ScrollArea>
      </CardContent>
    </Card>
  );
}
