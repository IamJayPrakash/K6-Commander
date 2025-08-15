
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
import { Rocket, Trash2, Plus, Server, Settings, FileJson, ChevronsRightLeft, Search, Gauge, ShieldCheck, TestTubeDiagonal, ChevronsUpDown, Check, X, History } from 'lucide-react';
import { TEST_PRESETS } from '@/lib/constants';
import type { TestConfiguration, TestPreset } from '@/types';
import { useToast } from '@/hooks/use-toast';
import { Switch } from '../ui/switch';
import { RadioGroup, RadioGroupItem } from '../ui/radio-group';
import { useLocalStorage } from '@/hooks/use-local-storage';
import { Popover, PopoverContent, PopoverTrigger } from '../ui/popover';
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from '../ui/command';
import { cn } from '@/lib/utils';
import { ScrollArea } from '../ui/scroll-area';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '../ui/alert-dialog';
import type { HistoryItem } from '@/types/index';

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
}).refine(data => data.runLoadTest || data.runLighthouse || data.runSeo, {
    message: "Please select at least one test to run.",
    path: ["runLoadTest"], // Attach error to a field for visibility
});

type TestFormValues = z.infer<typeof formSchema>;

interface TestFormProps {
  initialValues: Partial<TestConfiguration> | null;
  onRunTest: (testId: string, config: TestConfiguration) => void;
  setHistory: (value: HistoryItem[] | ((prev: HistoryItem[]) => HistoryItem[])) => void;
}

const newTestDefaultValues: TestFormValues = {
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

export default function TestForm({ initialValues, onRunTest, setHistory }: TestFormProps) {
  const { toast } = useToast();
  const [recentUrls, setRecentUrls] = useLocalStorage<string[]>('k6-recent-urls', []);
  const [popoverOpen, setPopoverOpen] = React.useState(false);
  const [isClearStorageDialogOpen, setClearStorageDialogOpen] = React.useState(false);
  const [formData, setFormData] = React.useState<TestFormValues | null>(null);

  const form = useForm<TestFormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: initialValues 
        ? {
            ...newTestDefaultValues,
            ...initialValues,
            headers: initialValues.headers ? Object.entries(initialValues.headers).map(([key, value]) => ({ key, value: String(value) })) : [],
          }
        : newTestDefaultValues,
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

  const addUrlToRecents = (url: string) => {
    if (url && z.string().url().safeParse(url).success) {
        setRecentUrls(prev => {
            const newUrls = [url, ...prev.filter(u => u !== url)];
            return [...new Set(newUrls)].slice(0, 10); // Keep unique and max 10
        });
    }
  }

  const removeRecentUrl = (url: string) => {
    setRecentUrls(prev => prev.filter(u => u !== url));
  }

  const clearRecentUrls = () => {
    setRecentUrls([]);
  }

  const handleFormSubmit = (data: TestFormValues) => {
    setFormData(data);
    setClearStorageDialogOpen(true);
  };
  
  const proceedWithTest = async (clearStorage: boolean) => {
    if (!formData) return;
    
    if (clearStorage) {
      setHistory([]);
      toast({
        title: 'History Cleared',
        description: 'Your test history has been cleared.',
      });
    }

    addUrlToRecents(formData.url);

    const config: TestConfiguration = {
      ...formData,
      headers: formData.headers.reduce((acc, { key, value }) => {
        if(key) acc[key] = value;
        return acc;
      }, {} as Record<string, string>),
      vus: formData.vus || 0,
      duration: formData.duration || '',
      stages: formData.stages || [],
      body: formData.body || '',
    };
    
    const tempTestId = `test-${Date.now()}`;
    
    toast({
        title: 'Starting Test(s)...',
        description: 'Your tests have been dispatched.',
    });
    onRunTest(tempTestId, config);
  };
  
  const isLoadTestEnabled = form.watch('runLoadTest');

  return (
    <>
    <Card className="bg-card/50 backdrop-blur-sm">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-2xl font-bold">
          <TestTubeDiagonal />
          New Test Run
        </CardTitle>
        <CardDescription>Configure and launch performance and SEO audits.</CardDescription>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(handleFormSubmit)} className="space-y-8">
            
            <div className="grid grid-cols-1 lg:grid-cols-2 lg:gap-8">
                {/* Left Column */}
                <div className="space-y-8">
                    <FormField
                      control={form.control}
                      name="url"
                      render={({ field }) => (
                        <FormItem className='flex flex-col'>
                          <FormLabel className="text-lg">Target Endpoint</FormLabel>
                          <FormDescription>The full URL of the API endpoint or page to test.</FormDescription>
                           <Popover open={popoverOpen} onOpenChange={setPopoverOpen}>
                                <PopoverTrigger asChild>
                                    <div className="relative">
                                        <Server className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                                        <FormControl>
                                            <Input
                                                placeholder="https://your-api.com/v1/users"
                                                className="pl-10 h-11 text-base"
                                                {...field}
                                            />
                                        </FormControl>
                                        <Button
                                            type="button"
                                            variant="ghost"
                                            role="combobox"
                                            aria-expanded={popoverOpen}
                                            className="absolute right-1 top-1/2 -translate-y-1/2 h-8 w-8 p-0"
                                        >
                                            <ChevronsUpDown className="h-4 w-4 shrink-0 opacity-50" />
                                        </Button>
                                    </div>
                                </PopoverTrigger>
                                <PopoverContent className="w-[--radix-popover-trigger-width] p-0">
                                    <Command>
                                        <CommandInput placeholder="Search or type a new URL..."/>
                                        <CommandList>
                                            <CommandEmpty>No recent URLs found.</CommandEmpty>
                                            <CommandGroup heading="Recent URLs">
                                                <ScrollArea className="h-48">
                                                {recentUrls.map(url => (
                                                    <CommandItem
                                                        key={url}
                                                        value={url}
                                                        onSelect={(currentValue) => {
                                                            form.setValue("url", currentValue);
                                                            setPopoverOpen(false);
                                                        }}
                                                        className="group"
                                                    >
                                                        <Check className={cn("mr-2 h-4 w-4", field.value === url ? "opacity-100" : "opacity-0")} />
                                                        <span className="truncate flex-1">{url}</span>
                                                        <Button variant="ghost" size="icon" className="h-6 w-6 opacity-0 group-hover:opacity-100" onClick={(e) => { e.stopPropagation(); removeRecentUrl(url); }}>
                                                            <X className="h-4 w-4" />
                                                        </Button>
                                                    </CommandItem>
                                                ))}
                                                </ScrollArea>
                                            </CommandGroup>
                                            {recentUrls.length > 0 && (
                                                <CommandGroup className='border-t pt-1'>
                                                    <CommandItem onSelect={clearRecentUrls} className="text-destructive focus:bg-destructive/10 focus:text-destructive justify-center">
                                                        <Trash2 className="mr-2 h-4 w-4"/> Clear all
                                                    </CommandItem>
                                                </CommandGroup>
                                            )}
                                        </CommandList>
                                    </Command>
                                </PopoverContent>
                            </Popover>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                     <Card className='test-suites bg-card/50'>
                        <CardHeader>
                            <CardTitle>Test Suites</CardTitle>
                            <CardDescription>Select which tests you would like to run.</CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <FormField
                                control={form.control}
                                name="runLoadTest"
                                render={({ field }) => (
                                    <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4 shadow-sm bg-background/50">
                                        <div className="space-y-0.5">
                                            <FormLabel className="text-base flex items-center gap-2"><Gauge/> k6 Load Test</FormLabel>
                                            <FormDescription>Simulate traffic to measure performance under pressure.</FormDescription>
                                        </div>
                                        <FormControl>
                                            <Switch
                                                checked={field.value}
                                                onCheckedChange={field.onChange}
                                                aria-labelledby="load-test-label"
                                            />
                                        </FormControl>
                                    </FormItem>
                                )}
                            />
                             <FormField
                                control={form.control}
                                name="runLighthouse"
                                render={({ field }) => (
                                    <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4 shadow-sm bg-background/50">
                                        <div className="space-y-0.5">
                                            <FormLabel className="text-base flex items-center gap-2"><ShieldCheck/> Lighthouse Audit</FormLabel>
                                            <FormDescription>Run Google's Lighthouse to check PWA, SEO, and more.</FormDescription>
                                        </div>
                                        <FormControl>
                                            <Switch
                                                checked={field.value}
                                                onCheckedChange={field.onChange}
                                                aria-labelledby="lighthouse-label"
                                            />
                                        </FormControl>
                                    </FormItem>
                                )}
                            />
                             <FormField
                                control={form.control}
                                name="runSeo"
                                render={({ field }) => (
                                    <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4 shadow-sm bg-background/50">
                                        <div className="space-y-0.5">
                                            <FormLabel className="text-base flex items-center gap-2"><Search/> Basic SEO Check</FormLabel>
                                            <FormDescription>Analyze title, meta description, and other on-page factors.</FormDescription>
                                        </div>
                                        <FormControl>
                                            <Switch
                                                checked={field.value}
                                                onCheckedChange={field.onChange}
                                                aria-labelledby="seo-label"
                                            />
                                        </FormControl>
                                    </FormItem>
                                )}
                            />
                            <FormMessage>{form.formState.errors.runLoadTest?.message}</FormMessage>
                        </CardContent>
                     </Card>
                </div>

                {/* Right Column */}
                <div className="space-y-8 mt-8 lg:mt-0">
                   <Card className={`bg-card/50 ${isLoadTestEnabled ? '' : 'opacity-50 pointer-events-none'}`}>
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
                                        render={({ field }) => <FormItem className="flex-1"><FormControl><Input aria-label="Header Key" placeholder="Header Name" {...field} disabled={!isLoadTestEnabled}/></FormControl></FormItem>}
                                    />
                                        <FormField
                                        control={form.control}
                                        name={`headers.${index}.value`}
                                        render={({ field }) => <FormItem className="flex-1"><FormControl><Input aria-label="Header Value" placeholder="Header Value" {...field} disabled={!isLoadTestEnabled}/></FormControl></FormItem>}
                                    />
                                    <Button type="button" variant="destructive" size="icon" onClick={() => removeHeader(index)} disabled={!isLoadTestEnabled} aria-label={`Remove header ${index + 1}`}><Trash2 className="h-4 w-4" /></Button>
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
                <Card className='load-test-profile bg-card/50'>
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
                                            aria-label="Load test presets"
                                        >
                                            {Object.entries(TEST_PRESETS).map(([key]) => (
                                                 <FormItem key={key} className="flex items-center space-x-3 space-y-0">
                                                    <FormControl>
                                                        <Card className={`p-4 cursor-pointer hover:border-primary w-full ${field.value === key ? 'border-primary ring-2 ring-primary' : ''}`}>
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
                                                    <Card className={`p-4 cursor-pointer hover:border-primary w-full ${field.value === 'custom' ? 'border-primary ring-2 ring-primary' : ''}`}>
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
                                        render={({ field }) => <FormItem className="flex-1"><FormLabel className="sr-only">Stage Duration</FormLabel><FormControl><Input placeholder="Duration (e.g., 1m)" {...field} /></FormControl><FormMessage /></FormItem>}
                                      />
                                      <ChevronsRightLeft className="h-5 w-5 text-muted-foreground mb-2"/>
                                      <FormField
                                        control={form.control}
                                        name={`stages.${index}.target`}
                                        render={({ field }) => <FormItem className="flex-1"><FormLabel className="sr-only">Stage Target VUs</FormLabel><FormControl><Input type="number" placeholder="Target VUs" {...field} onChange={e => field.onChange(parseInt(e.target.value, 10))} /></FormControl><FormMessage /></FormItem>}
                                      />
                                      <Button type="button" variant="destructive" size="icon" onClick={() => removeStage(index)} aria-label={`Remove stage ${index + 1}`}><Trash2 className="h-4 w-4" /></Button>
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
                {form.formState.isSubmitting ? 'Starting Tests...' : `Run Test(s)`}
                </Button>
            </div>
          </form>
        </Form>
      </CardContent>
    </Card>
    <AlertDialog open={isClearStorageDialogOpen} onOpenChange={setClearStorageDialogOpen}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle className="flex items-center gap-2"><History className="h-5 w-5"/>Before you run...</AlertDialogTitle>
          <AlertDialogDescription>
            Would you like to clear your local test history before starting this new run?
            This can be useful to start a session with a clean slate.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel onClick={() => proceedWithTest(false)}>Don't Clear</AlertDialogCancel>
          <AlertDialogAction 
            className='bg-destructive hover:bg-destructive/90' 
            onClick={() => proceedWithTest(true)}>
            <Trash2 className="mr-2 h-4 w-4" /> Clear History & Run
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
    </>
  );
}
