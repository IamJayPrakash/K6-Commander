
'use client';

import React, { useMemo } from 'react';
import { useForm, useFieldArray } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Button } from '@/components/ui/button';
import {
  Form,
  FormControl,
  FormDescription,
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
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Rocket, Trash2, Plus, Server, Settings, FileJson, ChevronsRightLeft, Search, Gauge, ShieldCheck, TestTubeDiagonal } from 'lucide-react';
import { TEST_PRESETS } from '@/lib/constants';
import type { TestConfiguration, TestPreset } from '@/types';
import { useToast } from '@/hooks/use-toast';
import { Switch } from '../ui/switch';

const stageSchema = z.object({
  duration: z.string().min(1, 'Duration is required'),
  target: z.number().min(0, 'Target VUs must be non-negative'),
});

const headerSchema = z.object({
    key: z.string(),
    value: z.string(),
})

const formSchema = z.object({
  url: z.string().url('Please enter a valid URL'),
  method: z.enum(['GET', 'POST', 'PUT', 'DELETE', 'PATCH']),
  headers: z.array(headerSchema),
  body: z.string().optional(),
  testPreset: z.enum(['baseline', 'spike', 'stress', 'soak', 'custom']),
  vus: z.number().min(1, 'At least one VU is required').optional(),
  duration: z.string().min(1, 'Duration is required').optional(),
  stages: z.array(stageSchema).optional(),
  runLoadTest: z.boolean().default(true),
  runLighthouse: z.boolean().default(false),
  runSeo: z.boolean().default(false),
});

type TestFormValues = z.infer<typeof formSchema>;

interface TestFormProps {
  initialValues: Partial<TestConfiguration>;
  onRunTest: (testId: string, config: TestConfiguration) => void;
  onCreateNew: () => void;
}

export default function TestForm({ initialValues, onRunTest, onCreateNew }: TestFormProps) {
  const { toast } = useToast();

  const defaultValues = useMemo(() => {
    const headersArray = initialValues.headers ? Object.entries(initialValues.headers).map(([key, value]) => ({ key, value: String(value) })) : [];
    return {
      url: initialValues.url || '',
      method: initialValues.method || 'GET',
      headers: headersArray,
      body: initialValues.body || '',
      testPreset: initialValues.testPreset || 'baseline',
      runLoadTest: initialValues.runLoadTest !== false,
      runLighthouse: initialValues.runLighthouse || false,
      runSeo: initialValues.runSeo || false,
      stages: initialValues.stages || TEST_PRESETS[initialValues.testPreset || 'baseline'].stages,
      vus: initialValues.vus || TEST_PRESETS[initialValues.testPreset || 'baseline'].vus,
      duration: initialValues.duration || TEST_PRESETS[initialValues.testPreset || 'baseline'].duration,
    };
  }, [initialValues]);

  const form = useForm<TestFormValues>({
    resolver: zodResolver(formSchema),
    defaultValues,
  });


  const { fields: headerFields, append: appendHeader, remove: removeHeader } = useFieldArray({
    control: form.control,
    name: 'headers',
  });

  const { fields: stageFields, append: appendStage, remove: removeStage } = useFieldArray({
    control: form.control,
    name: 'stages',
  });

  const handlePresetChange = (preset: string) => {
    form.setValue('testPreset', preset as TestPreset | 'custom');
    if (preset !== 'custom') {
      const presetConfig = TEST_PRESETS[preset as TestPreset];
      form.setValue('vus', presetConfig.vus);
      form.setValue('duration', presetConfig.duration);
      form.setValue('stages', presetConfig.stages);
    }
  };
  
  const onSubmit = async (data: TestFormValues) => {
    const config: TestConfiguration = {
      ...data,
      headers: data.headers.reduce((acc, { key, value }) => {
        if(key) acc[key] = value;
        return acc;
      }, {} as Record<string, string>),
      // Ensure VUs and duration are correctly set for non-custom presets
      vus: data.testPreset !== 'custom' && data.runLoadTest ? TEST_PRESETS[data.testPreset as TestPreset].vus! : data.vus || 0,
      duration: data.testPreset !== 'custom' && data.runLoadTest ? TEST_PRESETS[data.testPreset as TestPreset].duration! : data.duration || '',
      stages: data.testPreset !== 'custom' && data.runLoadTest ? TEST_PRESETS[data.testPreset as TestPreset].stages! : data.stages || [],
      body: data.body || '',
    };
    
    try {
      const response = await fetch('/api/run-test', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(config),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to start test');
      }

      const { testId } = await response.json();
      toast({
        title: 'Test Started!',
        description: `Test ID: ${testId}`,
      });
      onRunTest(testId, config);

    } catch (error) {
        toast({
            variant: 'destructive',
            title: 'Error starting test',
            description: error instanceof Error ? error.message : 'An unknown error occurred.',
        });
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <TestTubeDiagonal />
          Configure New Test
        </CardTitle>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
            <FormField
              control={form.control}
              name="url"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-lg">Target URL</FormLabel>
                   <FormDescription>Enter the full URL of the page you want to test.</FormDescription>
                  <FormControl>
                    <div className="relative">
                      <Server className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                      <Input placeholder="https://your-website.com/page" {...field} className="pl-10 h-12 text-lg" />
                    </div>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormItem>
                <FormLabel className="text-lg">Test Suites</FormLabel>
                <FormDescription>Select which test suites to run for the URL.</FormDescription>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-2">
                    <FormField
                      control={form.control}
                      name="runLoadTest"
                      render={({ field }) => (
                         <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4">
                            <FormControl><Switch checked={field.value} onCheckedChange={field.onChange} /></FormControl>
                            <div className="space-y-1 leading-none">
                                <FormLabel className="flex items-center gap-2"><Gauge/> Load Test</FormLabel>
                                <FormDescription>Run a k6 load test to measure performance under pressure.</FormDescription>
                            </div>
                        </FormItem>
                      )}
                    />
                     <FormField
                      control={form.control}
                      name="runLighthouse"
                      render={({ field }) => (
                         <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4">
                            <FormControl><Switch checked={field.value} onCheckedChange={field.onChange} /></FormControl>
                            <div className="space-y-1 leading-none">
                                <FormLabel className="flex items-center gap-2"><ShieldCheck/> Lighthouse Audit</FormLabel>
                                <FormDescription>Analyze Performance, SEO, and Accessibility scores.</FormDescription>
                            </div>
                        </FormItem>
                      )}
                    />
                     <FormField
                      control={form.control}
                      name="runSeo"
                      render={({ field }) => (
                         <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4">
                            <FormControl><Switch checked={field.value} onCheckedChange={field.onChange} /></FormControl>
                            <div className="space-y-1 leading-none">
                                <FormLabel className="flex items-center gap-2"><Search/> SEO Analysis</FormLabel>
                                <FormDescription>Check meta tags, sitemap, and other SEO factors.</FormDescription>
                            </div>
                        </FormItem>
                      )}
                    />
                </div>
            </FormItem>


            {form.watch('runLoadTest') && (
                <Accordion type="single" collapsible className="w-full" defaultValue="load-test-config">
                  <AccordionItem value="load-test-config">
                    <AccordionTrigger>
                        <div className="flex items-center gap-2"><Gauge /><span>Load Test Configuration</span></div>
                    </AccordionTrigger>
                    <AccordionContent className="space-y-6 pt-4">
                        <Tabs defaultValue={form.getValues('testPreset')} onValueChange={handlePresetChange} className="w-full">
                          <FormLabel>Test Type</FormLabel>
                          <TabsList className="grid w-full grid-cols-2 md:grid-cols-5 mt-2">
                            <TabsTrigger value="baseline">Baseline</TabsTrigger>
                            <TabsTrigger value="spike">Spike</TabsTrigger>
                            <TabsTrigger value="stress">Stress</TabsTrigger>
                            <TabsTrigger value="soak">Soak</TabsTrigger>
                            <TabsTrigger value="custom">Custom</TabsTrigger>
                          </TabsList>
                        </Tabs>

                        {form.watch('testPreset') === 'custom' && (
                          <Card className="bg-muted/30">
                            <CardContent className="pt-6">
                              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <FormField
                                  control={form.control}
                                  name="vus"
                                  render={({ field }) => (
                                    <FormItem>
                                      <FormLabel>Virtual Users (VUs)</FormLabel>
                                      <FormControl>
                                        <Input type="number" placeholder="e.g., 50" {...field} onChange={e => field.onChange(parseInt(e.target.value, 10))}/>
                                      </FormControl>
                                      <FormMessage />
                                    </FormItem>
                                  )}
                                />
                                <FormField
                                  control={form.control}
                                  name="duration"
                                  render={({ field }) => (
                                    <FormItem>
                                      <FormLabel>Test Duration</FormLabel>
                                      <FormControl>
                                        <Input placeholder="e.g., 10m" {...field}/>
                                      </FormControl>
                                      <FormMessage />
                                    </FormItem>
                                  )}
                                />
                              </div>
                              <div className="mt-6">
                                 <FormLabel>Stages</FormLabel>
                                  <FormDescription>Define ramping stages for VUs. This overrides VUs and Duration.</FormDescription>
                                 {stageFields.map((field, index) => (
                                    <div key={field.id} className="flex items-end gap-2 mt-2">
                                      <FormField
                                        control={form.control}
                                        name={`stages.${index}.duration`}
                                        render={({ field }) => <FormItem className="flex-1"><FormControl><Input placeholder="Duration (e.g., 1m)" {...field} /></FormControl><FormMessage /></FormItem>}
                                      />
                                      <ChevronsRightLeft className="h-5 w-5 text-muted-foreground mb-2"/>
                                      <FormField
                                        control={form.control}
                                        name={`stages.${index}.target`}
                                        render={({ field }) => <FormItem className="flex-1"><FormControl><Input type="number" placeholder="Target VUs" {...field} onChange={e => field.onChange(parseInt(e.target.value, 10))} /></FormControl><FormMessage /></FormItem>}
                                      />
                                      <Button type="button" variant="destructive" size="icon" onClick={() => removeStage(index)}><Trash2 className="h-4 w-4" /></Button>
                                    </div>
                                  ))}
                                  <Button type="button" variant="outline" size="sm" className="mt-2" onClick={() => appendStage({ duration: '', target: 0 })}>
                                    <Plus className="mr-2 h-4 w-4" /> Add Stage
                                  </Button>
                              </div>
                            </CardContent>
                          </Card>
                        )}
                        <Accordion type="multiple" className="w-full">
                          <AccordionItem value="request-details">
                            <AccordionTrigger>
                                <div className="flex items-center gap-2"><Settings /><span>Request Details</span></div>
                            </AccordionTrigger>
                            <AccordionContent className="space-y-6 pt-4">
                              <FormField
                                control={form.control}
                                name="method"
                                render={({ field }) => (
                                  <FormItem>
                                    <FormLabel>HTTP Method</FormLabel>
                                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                                      <FormControl>
                                        <SelectTrigger>
                                          <SelectValue placeholder="Select HTTP method" />
                                        </SelectTrigger>
                                      </FormControl>
                                      <SelectContent>
                                        <SelectItem value="GET">GET</SelectItem>
                                        <SelectItem value="POST">POST</SelectItem>
                                        <SelectItem value="PUT">PUT</SelectItem>
                                        <SelectItem value="DELETE">DELETE</SelectItem>
                                        <SelectItem value="PATCH">PATCH</SelectItem>
                                      </SelectContent>
                                    </Select>
                                    <FormMessage />
                                  </FormItem>
                                )}
                              />
                              <div>
                                <FormLabel>Headers</FormLabel>
                                {headerFields.map((field, index) => (
                                  <div key={field.id} className="flex items-center gap-2 mt-2">
                                    <FormField
                                        control={form.control}
                                        name={`headers.${index}.key`}
                                        render={({ field }) => <FormItem className="flex-1"><FormControl><Input placeholder="Header Name" {...field} /></FormControl></FormItem>}
                                    />
                                     <FormField
                                        control={form.control}
                                        name={`headers.${index}.value`}
                                        render={({ field }) => <FormItem className="flex-1"><FormControl><Input placeholder="Header Value" {...field} /></FormControl></FormItem>}
                                    />
                                    <Button type="button" variant="destructive" size="icon" onClick={() => removeHeader(index)}><Trash2 className="h-4 w-4" /></Button>
                                  </div>
                                ))}
                                <Button type="button" variant="outline" size="sm" className="mt-2" onClick={() => appendHeader({ key: '', value: '' })}>
                                    <Plus className="mr-2 h-4 w-4" /> Add Header
                                </Button>
                              </div>
                               <FormField
                                control={form.control}
                                name="body"
                                render={({ field }) => (
                                  <FormItem>
                                    <FormLabel className="flex items-center gap-2"><FileJson /><span>Request Body</span></FormLabel>
                                    <FormControl>
                                      <Textarea placeholder='{ "key": "value" }' className="font-mono" rows={5} {...field} />
                                    </FormControl>
                                    <FormMessage />
                                  </FormItem>
                                )}
                              />
                            </AccordionContent>
                          </AccordionItem>
                        </Accordion>
                    </AccordionContent>
                  </AccordionItem>
                </Accordion>
            )}
            
            <Button type="submit" size="lg" className="w-full" disabled={form.formState.isSubmitting}>
              <Rocket className="mr-2 h-5 w-5" /> Run Test(s)
            </Button>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}
