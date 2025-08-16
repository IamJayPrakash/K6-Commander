'use client';

import React, { useEffect } from 'react';
import { useForm, useFieldArray, type UseFormReturn } from 'react-hook-form';
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent } from '@/components/ui/card';
import { Download, Loader, Plus, Send, Sparkles, Trash2, Copy } from 'lucide-react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useTranslation } from 'react-i18next';
import CurlImportDialog from './curl-import-dialog';
import { useToast } from '@/hooks/use-toast';

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

export type ApiFormValues = z.infer<typeof formSchema>;

interface RequestPanelProps {
  onSend: (config: ApiFormValues) => void;
  isLoading: boolean;
  initialValues?: Partial<ApiFormValues> | null;
}

const KeyValueTable = ({
  fields,
  onAppend,
  onRemove,
  name,
  form,
}: {
  fields: any[];
  onAppend: (item: { key: string; value: string }) => void;
  onRemove: (index: number) => void;
  name: 'queryParams' | 'headers';
  form: UseFormReturn<ApiFormValues>;
}) => {
  const { t } = useTranslation();
  return (
    <div className="space-y-2">
      {fields.map((field, index) => (
        <div key={field.id} className="flex items-center gap-2">
          <FormField
            control={form.control}
            name={`${name}.${index}.key`}
            render={({ field }) => (
              <Input
                placeholder={name === 'queryParams' ? 'Query Param' : 'Header Name'}
                {...field}
              />
            )}
          />
          <FormField
            control={form.control}
            name={`${name}.${index}.value`}
            render={({ field }) => <Input placeholder="Value" {...field} />}
          />
          <Button
            type="button"
            variant="ghost"
            size="icon"
            onClick={() => onRemove(index)}
            title={`Remove ${name === 'queryParams' ? 'Parameter' : 'Header'}`}
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
};

export default function RequestPanel({ onSend, isLoading, initialValues }: RequestPanelProps) {
  const { t } = useTranslation();
  const { toast } = useToast();

  const form = useForm<ApiFormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: initialValues || {
      url: 'https://jsonplaceholder.typicode.com/posts/1',
      method: 'GET',
      queryParams: [],
      headers: [],
      body: '',
    },
  });

  useEffect(() => {
    form.reset(
      initialValues || {
        url: 'https://jsonplaceholder.typicode.com/posts/1',
        method: 'GET',
        queryParams: [],
        headers: [],
        body: '',
      }
    );
  }, [initialValues, form]);

  const {
    fields: queryParamFields,
    append: appendQueryParam,
    remove: removeQueryParam,
  } = useFieldArray({
    control: form.control,
    name: 'queryParams',
  });

  const {
    fields: headerFields,
    append: appendHeader,
    remove: removeHeader,
  } = useFieldArray({
    control: form.control,
    name: 'headers',
  });

  const handleImport = (values: Partial<ApiFormValues>) => {
    const currentValues = form.getValues();
    form.reset({
      ...currentValues,
      ...values,
      // Ensure arrays are not undefined
      queryParams: values.queryParams || [],
      headers: values.headers || [],
    });
  };

  const handleBeautifyJson = () => {
    const body = form.getValues('body');
    if (!body) return;

    try {
      const parsed = JSON.parse(body);
      const formatted = JSON.stringify(parsed, null, 2);
      form.setValue('body', formatted, { shouldValidate: true });
      toast({ title: t('apiTester.toast.jsonFormatted') });
    } catch (error) {
      toast({
        variant: 'destructive',
        title: t('apiTester.toast.jsonFormatErrorTitle'),
        description: t('apiTester.toast.jsonFormatErrorDescription'),
      });
    }
  };

  const handleCopyToCurl = () => {
    try {
      const values = form.getValues();

      // Validate URL before proceeding
      const urlValidation = z.string().url().safeParse(values.url);
      if (!urlValidation.success) {
        toast({
          variant: 'destructive',
          title: t('apiTester.toast.curlCopyErrorTitle'),
          description: t('apiTester.toast.curlCopyInvalidUrl'),
        });
        return;
      }
      
      const url = new URL(values.url);
      values.queryParams.forEach((param) => {
        if (param.key) {
          url.searchParams.append(param.key, param.value);
        }
      });

      let curlCommand = `curl "${url.toString()}" \\\n  -X ${values.method}`;

      values.headers.forEach((h) => {
        if (h.key) {
          curlCommand += ` \\\n  -H "${h.key}: ${h.value}"`;
        }
      });

      if (values.body && ['POST', 'PUT', 'PATCH'].includes(values.method)) {
        // Escape single quotes in the body
        const escapedBody = values.body.replace(/'/g, "'\\''");
        curlCommand += ` \\\n  --data-raw '${escapedBody}'`;
      }

      navigator.clipboard.writeText(curlCommand);
      toast({
        title: t('apiTester.toast.apiCurlCopiedTitle'),
        description: t('apiTester.toast.apiCurlCopiedDescription'),
      });
    } catch (error: any) {
      toast({
        variant: 'destructive',
        title: t('apiTester.toast.curlCopyErrorTitle'),
        description: error.message || t('apiTester.toast.curlCopyErrorDescription'),
      });
    }
  };

  return (
    <Card className="h-full border-0 shadow-none">
      <CardContent className="p-2 h-full flex flex-col">
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSend)} className="space-y-4 flex flex-col flex-grow">
            <div className="flex flex-wrap gap-2">
              <div className="flex flex-1 min-w-[200px] gap-2">
                <FormField
                  control={form.control}
                  name="method"
                  render={({ field }) => (
                    <FormItem>
                      <Select onValueChange={field.onChange} value={field.value}>
                        <FormControl>
                          <SelectTrigger className="w-32">
                            <SelectValue placeholder="Method" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {['GET', 'POST', 'PUT', 'PATCH', 'DELETE'].map((method) => (
                            <SelectItem key={method} value={method}>
                              {method}
                            </SelectItem>
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
              </div>
              <div className="flex gap-2">
                <CurlImportDialog onImport={handleImport} />
                <Button type="button" variant="outline" onClick={handleCopyToCurl}>
                  <Copy className="mr-2 h-4 w-4" /> {t('apiTester.copyAsCurlButton')}
                </Button>
                <Button type="submit" disabled={isLoading} className="w-28">
                  {isLoading ? (
                    <Loader className="animate-spin h-5 w-5" />
                  ) : (
                    <>
                      <Send className="mr-2 h-4 w-4" /> {t('apiTester.sendButton')}
                    </>
                  )}
                </Button>
              </div>
            </div>
            <Tabs defaultValue="params" className="w-full flex-grow flex flex-col">
              <TabsList>
                <TabsTrigger value="params">{t('apiTester.paramsTab')}</TabsTrigger>
                <TabsTrigger value="headers">{t('apiTester.headersTab')}</TabsTrigger>
                <TabsTrigger value="body">{t('apiTester.bodyTab')}</TabsTrigger>
              </TabsList>
              <TabsContent value="params" className="p-2">
                <KeyValueTable
                  fields={queryParamFields}
                  onAppend={appendQueryParam}
                  onRemove={removeQueryParam}
                  name="queryParams"
                  form={form}
                />
              </TabsContent>
              <TabsContent value="headers" className="p-2">
                <KeyValueTable
                  fields={headerFields}
                  onAppend={appendHeader}
                  onRemove={removeHeader}
                  name="headers"
                  form={form}
                />
              </TabsContent>
              <TabsContent value="body" className="p-2 flex-grow flex flex-col">
                <FormField
                  control={form.control}
                  name="body"
                  render={({ field }) => (
                    <FormItem className="flex-grow flex flex-col">
                      <div className="flex items-center justify-between">
                        <FormLabel>{t('apiTester.jsonBodyLabel')}</FormLabel>
                        <Button
                          type="button"
                          variant="ghost"
                          size="sm"
                          onClick={handleBeautifyJson}
                        >
                          <Sparkles className="mr-2 h-4 w-4" />
                          {t('apiTester.beautifyJsonButton')}
                        </Button>
                      </div>
                      <FormControl>
                        <Textarea
                          placeholder='{ "key": "value" }'
                          className="font-mono flex-grow"
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
