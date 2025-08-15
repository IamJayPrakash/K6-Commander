
'use client';

import React from 'react';
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
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Rocket, Trash2, Plus, Server, Settings, FileJson, ChevronsRightLeft, Search, Gauge, ShieldCheck, TestTubeDiagonal } from 'lucide-react';
import { TEST_PRESETS } from '@/lib/constants';
import type { TestConfiguration, TestPreset } from '@/types';
import { useToast } from '@/hooks/use-toast';
import { Switch } from '../ui/switch';
import { RadioGroup, RadioGroupItem } from '../ui/radio-group';

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

const newTestDefaultValues: Partial<TestFormValues> = {
    url: '',
    method: 'GET' as const,
    headers: [],
    body: '',
    testPreset: 'baseline' as const,
    runLoadTest: true,
    runLighthouse: false,
    runSeo: false,
    ...TEST_PRESETS.baseline,
};

interface TestFormProps {
  initialValues: Partial<TestConfiguration> | null;
  onRunTest: (testId: string, config: TestConfiguration) => void;
}

const getInitialValues = (values: Partial<TestConfiguration> | null): TestFormValues => {
  const defaults = {
    ...newTestDefaultValues,
    ...values,
    headers: values?.headers ? Object.entries(values.headers).map(([key, value]) => ({ key, value: String(value) })) : [],
    vus: values?.vus ?? newTestDefaultValues.vus,
    duration: values?.duration ?? newTestDefaultValues.duration,
    stages: values?.stages ?? newTestDefaultValues.stages,
  };
  return defaults as TestFormValues;
};


export default function TestForm({ initialValues, onRunTest }: TestFormProps) {
  const { toast } = useToast();

  const form = useForm<TestFormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: getInitialValues(initialValues),
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
  
  const isLoadTestEnabled = form.watch('runLoadTest');

  return (
    <Card className="border-none shadow-none">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-2xl font-bold">
          <TestTubeDiagonal />
          New Test Run
        </CardTitle>
        <CardDescription>Configure and launch k6 performance tests.</CardDescription>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
            
            <div className="grid grid-cols-1 lg:grid-cols-2 lg:gap-8">
                {/* Left Column */}
                <div className="space-y-8">
                    <FormField
                      control={form.control}
                      name="url"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-lg">Target Endpoint</FormLabel>
                          <FormDescription>The full URL of the API endpoint or page to test.</FormDescription>
                          <FormControl>
                            <div className="relative">
                              <Server className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                              <Input placeholder="https://your-api.com/v1/users" {...field} className="pl-10 h-11 text-base" />
                            </div>
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                     <FormField
                      control={form.control}
                      name="runLoadTest"
                      render={({ field }) => (
                         <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4 shadow-sm">
                            <div className="space-y-0.5">
                                <FormLabel className="text-base flex items-center gap-2"><Gauge/> k6 Load Test</FormLabel>
                                <FormDescription>Simulate traffic to measure performance under pressure.</FormDescription>
                            </div>
                            <FormControl><Switch checked={field.value} onCheckedChange={field.onChange} /></FormControl>
                        </FormItem>
                      )}
                    />
                </div>

                {/* Right Column */}
                <div className="space-y-8 mt-8 lg:mt-0">
                   <Card className={isLoadTestEnabled ? '' : 'bg-muted/50'}>
                       <CardHeader>
                           <CardTitle className="flex items-center gap-2"><Settings /> Request Configuration</CardTitle>
                           <CardDescription>Define the HTTP request details for the load test.</CardDescription>
                       </CardHeader>
                       <CardContent className="space-y-6">
                            <FormField
                            control={form.control}
                            name="method"
                            render={({ field }) => (
                                <FormItem>
                                <FormLabel>HTTP Method</FormLabel>
                                <Select onValueChange={field.onChange} defaultValue={field.value} disabled={!isLoadTestEnabled}>
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
                                        render={({ field }) => <FormItem className="flex-1"><FormControl><Input placeholder="Header Name" {...field} disabled={!isLoadTestEnabled}/></FormControl></FormItem>}
                                    />
                                        <FormField
                                        control={form.control}
                                        name={`headers.${index}.value`}
                                        render={({ field }) => <FormItem className="flex-1"><FormControl><Input placeholder="Header Value" {...field} disabled={!isLoadTestEnabled}/></FormControl></FormItem>}
                                    />
                                    <Button type="button" variant="destructive" size="icon" onClick={() => removeHeader(index)} disabled={!isLoadTestEnabled}><Trash2 className="h-4 w-4" /></Button>
                                    </div>
                                ))}
                                <Button type="button" variant="outline" size="sm" className="mt-2" onClick={() => appendHeader({ key: '', value: '' })} disabled={!isLoadTestEnabled}>
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
                                        <Textarea placeholder='{ "key": "value" }' className="font-mono" rows={5} {...field} disabled={!isLoadTestEnabled}/>
                                    </FormControl>
                                    <FormMessage />
                                    </FormItem>
                                )}
                            />
                       </CardContent>
                   </Card>
                </div>
            </div>

            {isLoadTestEnabled && (
                <Card>
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2"><Gauge/> Load Test Profile</CardTitle>
                        <CardDescription>Choose a preset or define a custom load profile.</CardDescription>
                    </CardHeader>
                    <CardContent>
                         <FormField
                            control={form.control}
                            name="testPreset"
                            render={({ field }) => (
                                <FormItem className="space-y-3">
                                    <FormControl>
                                        <RadioGroup
                                            onValueChange={handlePresetChange}
                                            defaultValue={field.value}
                                            className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-4"
                                        >
                                            {Object.entries(TEST_PRESETS).map(([key]) => (
                                                 <FormItem key={key} className="flex items-center space-x-3 space-y-0">
                                                    <FormControl>
                                                        <Card className={`p-4 cursor-pointer hover:border-primary w-full ${field.value === key ? 'border-primary shadow-md' : ''}`}>
                                                          <RadioGroupItem value={key} id={key} className="sr-only"/>
                                                            <FormLabel htmlFor={key} className="font-semibold capitalize text-base cursor-pointer">
                                                                {key}
                                                            </FormLabel>
                                                        </Card>
                                                    </FormControl>
                                                </FormItem>
                                            ))}
                                            <FormItem className="flex items-center space-x-3 space-y-0">
                                                <FormControl>
                                                    <Card className={`p-4 cursor-pointer hover:border-primary w-full ${field.value === 'custom' ? 'border-primary shadow-md' : ''}`}>
                                                        <RadioGroupItem value="custom" id="custom" className="sr-only"/>
                                                        <FormLabel htmlFor="custom" className="font-semibold capitalize text-base cursor-pointer">
                                                            Custom
                                                        </FormLabel>
                                                    </Card>
                                                </FormControl>
                                            </FormItem>
                                        </RadioGroup>
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                            />

                        {form.watch('testPreset') === 'custom' && (
                          <Card className="bg-muted/30 mt-6">
                            <CardHeader>
                                <CardTitle>Custom Load Profile</CardTitle>
                                <CardDescription>Manually set Virtual Users (VUs) and duration, or define ramping stages.</CardDescription>
                            </CardHeader>
                            <CardContent>
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
                                 <FormLabel>Ramping Stages</FormLabel>
                                  <FormDescription>Define ramping stages for VUs. This overrides fixed VUs and Duration.</FormDescription>
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
                    </CardContent>
                </Card>
            )}
            
            <div className="flex justify-end pt-8">
                <Button type="submit" size="lg" className="w-full md:w-auto" disabled={form.formState.isSubmitting}>
                <Rocket className="mr-2 h-5 w-5" />
                {form.formState.isSubmitting ? 'Starting Test...' : 'Run Test'}
                </Button>
            </div>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}
