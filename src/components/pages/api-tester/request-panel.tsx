'use client';

import React from 'react';
import { useForm, useFieldArray } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Button } from '@/components/ui/button';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent } from '@/components/ui/card';
import { Loader, Plus, Send, Trash2 } from 'lucide-react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useTranslation } from 'react-i18next';

const paramSchema = z.object({
  key: z.string(),
  value: z.string(),
});

const formSchema = z.object({
  url: z.string().url('Please enter a valid URL'),
  method: z.enum(['GET', 'POST', 'PUT', 'DELETE', 'PATCH']),
  queryParams: z.array(paramSchema),
  headers: z.array(paramSchema),
  body: z.string().optional(),
});

type ApiFormValues = z.infer<typeof formSchema>;

interface RequestPanelProps {
  onSend: (config: ApiFormValues) => void;
  isLoading: boolean;
}

export default function RequestPanel({ onSend, isLoading }: RequestPanelProps) {
  const { t } = useTranslation();

  const form = useForm<ApiFormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      url: '',
      method: 'GET',
      queryParams: [{ key: '', value: '' }],
      headers: [{ key: '', value: '' }],
      body: '',
    },
  });

  const { fields: queryParamFields, append: appendQueryParam, remove: removeQueryParam } = useFieldArray({
    control: form.control,
    name: 'queryParams',
  });

  const { fields: headerFields, append: appendHeader, remove: removeHeader } = useFieldArray({
    control: form.control,
    name: 'headers',
  });

  const KeyValueTable = ({ fields, onAppend, onRemove, name }: any) => (
    <div className="space-y-2">
      {fields.map((field: any, index: number) => (
        <div key={field.id} className="flex items-center gap-2">
          <FormField
            control={form.control}
            name={`${name}.${index}.key`}
            render={({ field }) => (
              <Input placeholder={t('apiTester.keyPlaceholder')} {...field} />
            )}
          />
          <FormField
            control={form.control}
            name={`${name}.${index}.value`}
            render={({ field }) => (
              <Input placeholder={t('apiTester.valuePlaceholder')} {...field} />
            )}
          />
          <Button
            type="button"
            variant="ghost"
            size="icon"
            onClick={() => onRemove(index)}
          >
            <Trash2 className="h-4 w-4" />
          </Button>
        </div>
      ))}
      <Button
        type="button"
        variant="outline"
        size="sm"
        onClick={() => onAppend({ key: '', value: '' })}
      >
        <Plus className="mr-2 h-4 w-4" /> {t('apiTester.addButton')}
      </Button>
    </div>
  );

  return (
    <Card className="h-full border-0 shadow-none">
      <CardContent className="p-2">
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSend)} className="space-y-4">
            <div className="flex gap-2">
              <FormField
                control={form.control}
                name="method"
                render={({ field }) => (
                  <FormItem>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger className="w-32">
                          <SelectValue placeholder="Method" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {['GET', 'POST', 'PUT', 'PATCH', 'DELETE'].map((method) => (
                          <SelectItem key={method} value={method}>{method}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="url"
                render={({ field }) => (
                  <FormItem className="flex-1">
                    <FormControl>
                      <Input placeholder="https://api.example.com/data" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <Button type="submit" disabled={isLoading} className="w-28">
                {isLoading ? <Loader className="animate-spin h-5 w-5" /> : <><Send className="mr-2 h-4 w-4" /> {t('apiTester.sendButton')}</>}
              </Button>
            </div>
            <Tabs defaultValue="params" className="w-full">
              <TabsList>
                <TabsTrigger value="params">{t('apiTester.paramsTab')}</TabsTrigger>
                <TabsTrigger value="headers">{t('apiTester.headersTab')}</TabsTrigger>
                <TabsTrigger value="body">{t('apiTester.bodyTab')}</TabsTrigger>
              </TabsList>
              <TabsContent value="params" className="p-2">
                <KeyValueTable fields={queryParamFields} onAppend={appendQueryParam} onRemove={removeQueryParam} name="queryParams" />
              </TabsContent>
              <TabsContent value="headers" className="p-2">
                <KeyValueTable fields={headerFields} onAppend={appendHeader} onRemove={removeHeader} name="headers" />
              </TabsContent>
              <TabsContent value="body" className="p-2">
                <FormField
                  control={form.control}
                  name="body"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>{t('apiTester.jsonBodyLabel')}</FormLabel>
                      <FormControl>
                        <Textarea
                          placeholder='{ "key": "value" }'
                          className="font-mono h-48"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </TabsContent>
            </Tabs>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}
