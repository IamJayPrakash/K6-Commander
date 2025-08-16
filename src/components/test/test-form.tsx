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
import {
  Rocket,
  Trash2,
  Plus,
  Server,
  Settings,
  FileJson,
  ChevronsRightLeft,
  ShieldCheck,
  TestTubeDiagonal,
  ChevronsUpDown,
  Check,
  X,
  History,
  BrainCircuit,
} from 'lucide-react';
import { TEST_PRESETS } from '@/lib/constants';
import type { TestConfiguration, TestPreset } from '@/types';
import { useToast } from '@/hooks/use-toast';
import { Switch } from '../ui/switch';
import { RadioGroup, RadioGroupItem } from '../ui/radio-group';
import { useLocalStorage } from '@/hooks/use-local-storage';
import { Popover, PopoverContent, PopoverTrigger } from '../ui/popover';
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from '../ui/command';
import { cn } from '@/lib/utils';
import { ScrollArea } from '../ui/scroll-area';
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
} from '../ui/alert-dialog';
import type { HistoryItem } from '@/types/index';
import { useTranslation } from 'react-i18next';
import { Gauge } from 'lucide-react';

const stageSchema = z.object({
  duration: z.string().min(1, 'Duration is required'),
  target: z.number().min(0, 'Target VUs must be non-negative'),
});

const headerSchema = z.object({
  key: z.string(),
  value: z.string(),
});

const formSchema = z
  .object({
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
  })
  .refine((data) => data.runLoadTest || data.runLighthouse || data.runSeo, {
    message: 'form.error.atLeastOne',
    path: ['runLoadTest'], // Attach error to a field for visibility
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
  const { t } = useTranslation();
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
          headers: initialValues.headers
            ? Object.entries(initialValues.headers).map(([key, value]) => ({
                key,
                value: String(value),
              }))
            : [],
        }
      : newTestDefaultValues,
  });

  const {
    fields: headerFields,
    append: appendHeader,
    remove: removeHeader,
  } = useFieldArray({
    control: form.control,
    name: 'headers',
  });

  const {
    fields: stageFields,
    append: appendStage,
    remove: removeStage,
  } = useFieldArray({
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
      setRecentUrls((prev) => {
        const newUrls = [url, ...prev.filter((u) => u !== url)];
        return [...new Set(newUrls)].slice(0, 10); // Keep unique and max 10
      });
    }
  };

  const removeRecentUrl = (url: string) => {
    setRecentUrls((prev) => prev.filter((u) => u !== url));
  };

  const clearRecentUrls = () => {
    setRecentUrls([]);
    setPopoverOpen(false);
    toast({
      title: 'Recent URLs cleared',
      description: 'Your list of recent URLs has been cleared.',
    });
  };

  const handleFormSubmit = (data: TestFormValues) => {
    setFormData(data);
    addUrlToRecents(data.url);
    setClearStorageDialogOpen(true);
  };

  const proceedWithTest = async (clearStorage: boolean) => {
    if (!formData) return;

    if (clearStorage) {
      setHistory([]);
      setRecentUrls([]); // Also clear recent URLs
      toast({
        title: t('form.toast.historyClearedTitle'),
        description: t('form.toast.historyClearedDescription'),
      });
    }

    const config: TestConfiguration = {
      ...formData,
      headers: formData.headers.reduce(
        (acc, { key, value }) => {
          if (key) acc[key] = value;
          return acc;
        },
        {} as Record<string, string>
      ),
      vus: formData.vus || 0,
      duration: formData.duration || '',
      stages: formData.stages || [],
      body: formData.body || '',
    };

    const tempTestId = `test-${Date.now()}`;

    toast({
      title: t('form.toast.testStartedTitle'),
      description: t('form.toast.testStartedDescription'),
    });
    onRunTest(tempTestId, config);
  };

  const isLoadTestEnabled = form.watch('runLoadTest');

  return (
    <>
      <Card className="bg-card/50 backdrop-blur-sm" data-testid="test-form-card">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-2xl font-bold">
            <TestTubeDiagonal />
            {t('form.title')}
          </CardTitle>
          <CardDescription>{t('form.description')}</CardDescription>
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
                      <FormItem className="flex flex-col">
                        <FormLabel className="text-lg">{t('form.urlLabel')}</FormLabel>
                        <FormDescription>{t('form.urlDescription')}</FormDescription>
                        <Popover open={popoverOpen} onOpenChange={setPopoverOpen}>
                          <PopoverTrigger asChild>
                            <div className="relative">
                              <Server className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                              <FormControl>
                                <Input
                                  data-testid="url-input"
                                  placeholder={t('form.urlPlaceholder')}
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
                                data-testid="url-popover-trigger"
                                aria-label={t('form.toggleRecentUrlsLabel')}
                              >
                                <ChevronsUpDown className="h-4 w-4 shrink-0 opacity-50" />
                              </Button>
                            </div>
                          </PopoverTrigger>
                          <PopoverContent className="w-[--radix-popover-trigger-width] p-0">
                            <Command>
                              <CommandInput
                                placeholder={t('form.searchUrlPlaceholder')}
                                data-testid="url-search-input"
                              />
                              <CommandList>
                                <CommandEmpty>{t('form.noRecentUrls')}</CommandEmpty>
                                <CommandGroup heading={t('form.recentUrlsHeading')}>
                                  <ScrollArea className="h-48">
                                    {recentUrls.map((url) => (
                                      <CommandItem
                                        key={url}
                                        value={url}
                                        onSelect={(currentValue) => {
                                          form.setValue('url', currentValue);
                                          setPopoverOpen(false);
                                        }}
                                        className="group"
                                        data-testid={`recent-url-item-${url}`}
                                      >
                                        <Check
                                          className={cn(
                                            'mr-2 h-4 w-4',
                                            field.value === url ? 'opacity-100' : 'opacity-0'
                                          )}
                                        />
                                        <span className="truncate flex-1">{url}</span>
                                        <Button
                                          variant="ghost"
                                          size="icon"
                                          className="h-6 w-6 opacity-0 group-hover:opacity-100"
                                          onClick={(e) => {
                                            e.stopPropagation();
                                            removeRecentUrl(url);
                                          }}
                                          data-testid={`remove-recent-url-${url}`}
                                          aria-label={t('form.removeRecentUrlLabel', { url })}
                                        >
                                          <X className="h-4 w-4" />
                                        </Button>
                                      </CommandItem>
                                    ))}
                                  </ScrollArea>
                                </CommandGroup>
                                {recentUrls.length > 0 && (
                                  <CommandGroup className="border-t pt-1">
                                    <CommandItem
                                      onSelect={clearRecentUrls}
                                      className="text-destructive focus:bg-destructive/10 focus:text-destructive justify-center"
                                      data-testid="clear-recent-urls-button"
                                    >
                                      <Trash2 className="mr-2 h-4 w-4" />{' '}
                                      {t('form.clearRecentUrlsButton')}
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
                  <Card className="test-suites bg-card/50" data-testid="test-suites-card">
                    <CardHeader>
                      <CardTitle>{t('form.testSuitesTitle')}</CardTitle>
                      <CardDescription>{t('form.testSuitesDescription')}</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <FormField
                        control={form.control}
                        name="runLoadTest"
                        render={({ field }) => (
                          <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4 shadow-sm bg-background/50">
                            <div className="space-y-0.5">
                              <FormLabel
                                id="load-test-label"
                                className="text-base flex items-center gap-2"
                              >
                                <Gauge />
                                {t('form.k6SwitchLabel')}
                              </FormLabel>
                              <FormDescription id="load-test-desc">
                                {t('form.k6SwitchDescription')}
                              </FormDescription>
                            </div>
                            <FormControl>
                              <Switch
                                data-testid="load-test-switch"
                                checked={field.value}
                                onCheckedChange={field.onChange}
                                aria-labelledby="load-test-label"
                                aria-describedby="load-test-desc"
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
                              <FormLabel
                                id="lighthouse-label"
                                className="text-base flex items-center gap-2"
                              >
                                <ShieldCheck />
                                {t('form.lighthouseSwitchLabel')}
                              </FormLabel>
                              <FormDescription id="lighthouse-desc">
                                {t('form.lighthouseSwitchDescription')}
                              </FormDescription>
                            </div>
                            <FormControl>
                              <Switch
                                data-testid="lighthouse-switch"
                                checked={field.value}
                                onCheckedChange={field.onChange}
                                aria-labelledby="lighthouse-label"
                                aria-describedby="lighthouse-desc"
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
                              <FormLabel
                                id="seo-label"
                                className="text-base flex items-center gap-2"
                              >
                                <BrainCircuit />
                                {t('form.seoSwitchLabel')}
                              </FormLabel>
                              <FormDescription id="seo-desc">
                                {t('form.seoSwitchDescription')}
                              </FormDescription>
                            </div>
                            <FormControl>
                              <Switch
                                data-testid="seo-switch"
                                checked={field.value}
                                onCheckedChange={field.onChange}
                                aria-labelledby="seo-label"
                                aria-describedby="seo-desc"
                              />
                            </FormControl>
                          </FormItem>
                        )}
                      />
                      <FormMessage>
                        {form.formState.errors.runLoadTest?.message &&
                          t(form.formState.errors.runLoadTest.message as any)}
                      </FormMessage>
                    </CardContent>
                  </Card>
                </div>

                {/* Right Column */}
                <div className="space-y-8 mt-8 lg:mt-0">
                  <Card
                    className={`bg-card/50 ${isLoadTestEnabled ? '' : 'opacity-50 pointer-events-none'}`}
                    data-testid="request-config-card"
                  >
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <Settings />
                        {t('form.requestConfigTitle')}
                      </CardTitle>
                      <CardDescription>{t('form.requestConfigDescription')}</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-6">
                      <FormField
                        control={form.control}
                        name="method"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>{t('form.methodLabel')}</FormLabel>
                            <Select
                              onValueChange={field.onChange}
                              defaultValue={field.value}
                              disabled={!isLoadTestEnabled}
                            >
                              <FormControl>
                                <SelectTrigger data-testid="method-select-trigger">
                                  <SelectValue placeholder={t('form.methodPlaceholder')} />
                                </SelectTrigger>
                              </FormControl>
                              <SelectContent>
                                <SelectItem value="GET" data-testid="method-select-get">
                                  GET
                                </SelectItem>
                                <SelectItem value="POST" data-testid="method-select-post">
                                  POST
                                </SelectItem>
                                <SelectItem value="PUT" data-testid="method-select-put">
                                  PUT
                                </SelectItem>
                                <SelectItem value="DELETE" data-testid="method-select-delete">
                                  DELETE
                                </SelectItem>
                                <SelectItem value="PATCH" data-testid="method-select-patch">
                                  PATCH
                                </SelectItem>
                              </SelectContent>
                            </Select>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <div>
                        <FormLabel>{t('form.headersLabel')}</FormLabel>
                        {headerFields.map((field, index) => (
                          <div key={field.id} className="flex items-center gap-2 mt-2">
                            <FormField
                              control={form.control}
                              name={`headers.${index}.key`}
                              render={({ field }) => (
                                <FormItem className="flex-1">
                                  <FormControl>
                                    <Input
                                      data-testid={`header-key-${index}`}
                                      aria-label="Header Key"
                                      placeholder={t('form.headerNamePlaceholder')}
                                      {...field}
                                      disabled={!isLoadTestEnabled}
                                    />
                                  </FormControl>
                                </FormItem>
                              )}
                            />
                            <FormField
                              control={form.control}
                              name={`headers.${index}.value`}
                              render={({ field }) => (
                                <FormItem className="flex-1">
                                  <FormControl>
                                    <Input
                                      data-testid={`header-value-${index}`}
                                      aria-label="Header Value"
                                      placeholder={t('form.headerValuePlaceholder')}
                                      {...field}
                                      disabled={!isLoadTestEnabled}
                                    />
                                  </FormControl>
                                </FormItem>
                              )}
                            />
                            <Button
                              type="button"
                              variant="destructive"
                              size="icon"
                              onClick={() => removeHeader(index)}
                              disabled={!isLoadTestEnabled}
                              aria-label={t('form.removeHeaderLabel', { index: index + 1 })}
                              data-testid={`remove-header-${index}`}
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
                        ))}
                        <Button
                          type="button"
                          variant="outline"
                          size="sm"
                          className="mt-2"
                          onClick={() => appendHeader({ key: '', value: '' })}
                          disabled={!isLoadTestEnabled}
                          data-testid="add-header-button"
                        >
                          <Plus className="mr-2 h-4 w-4" />
                          {t('form.addHeaderButton')}
                        </Button>
                      </div>
                      <FormField
                        control={form.control}
                        name="body"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className="flex items-center gap-2">
                              <FileJson />
                              <span>{t('form.requestBodyLabel')}</span>
                            </FormLabel>
                            <FormControl>
                              <Textarea
                                data-testid="body-textarea"
                                placeholder='{ "key": "value" }'
                                className="font-mono"
                                rows={5}
                                {...field}
                                disabled={!isLoadTestEnabled}
                              />
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
                <Card className="load-test-profile bg-card/50" data-testid="load-test-profile-card">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Gauge />
                      {t('form.loadProfileTitle')}
                    </CardTitle>
                    <CardDescription>{t('form.loadProfileDescription')}</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <FormField
                      control={form.control}
                      name="testPreset"
                      render={({ field }) => (
                        <FormItem className="space-y-3">
                          <FormControl>
                            <RadioGroup
                              onValueChange={(value) => {
                                field.onChange(value);
                                handlePresetChange(value);
                              }}
                              value={field.value}
                              className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-4"
                              aria-label={t('form.loadTestPresetsLabel')}
                            >
                              {Object.entries(TEST_PRESETS).map(([key]) => (
                                <FormItem
                                  key={key}
                                  className="flex items-center space-x-3 space-y-0"
                                >
                                  <FormControl>
                                    <Card
                                      className={`p-4 cursor-pointer hover:border-primary w-full ${field.value === key ? 'border-primary ring-2 ring-primary' : ''}`}
                                      data-testid={`preset-card-${key}`}
                                      onClick={() => {
                                        field.onChange(key);
                                        handlePresetChange(key);
                                      }}
                                    >
                                      <RadioGroupItem
                                        value={key}
                                        id={key}
                                        className="sr-only"
                                        data-testid={`preset-radio-${key}`}
                                      />
                                      <FormLabel
                                        htmlFor={key}
                                        className="font-semibold capitalize text-base cursor-pointer"
                                      >
                                        {t(`presets.${key}`)}
                                      </FormLabel>
                                    </Card>
                                  </FormControl>
                                </FormItem>
                              ))}
                              <FormItem className="flex items-center space-x-3 space-y-0">
                                <FormControl>
                                  <Card
                                    className={`p-4 cursor-pointer hover:border-primary w-full ${field.value === 'custom' ? 'border-primary ring-2 ring-primary' : ''}`}
                                    data-testid="preset-card-custom"
                                     onClick={() => {
                                      field.onChange('custom');
                                      handlePresetChange('custom');
                                    }}
                                  >
                                    <RadioGroupItem
                                      value="custom"
                                      id="custom"
                                      className="sr-only"
                                      data-testid="preset-radio-custom"
                                    />
                                    <FormLabel
                                      htmlFor="custom"
                                      className="font-semibold capitalize text-base cursor-pointer"
                                    >
                                      {t('presets.custom')}
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
                      <Card className="bg-muted/30 mt-6" data-testid="custom-profile-card">
                        <CardHeader>
                          <CardTitle>{t('form.customProfileTitle')}</CardTitle>
                          <CardDescription>{t('form.customProfileDescription')}</CardDescription>
                        </CardHeader>
                        <CardContent>
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <FormField
                              control={form.control}
                              name="vus"
                              render={({ field }) => (
                                <FormItem>
                                  <FormLabel>{t('form.vusLabel')}</FormLabel>
                                  <FormControl>
                                    <Input
                                      type="number"
                                      placeholder={t('form.vusPlaceholder')}
                                      {...field}
                                      onChange={(e) => field.onChange(parseInt(e.target.value, 10))}
                                      data-testid="vus-input"
                                    />
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
                                  <FormLabel>{t('form.durationLabel')}</FormLabel>
                                  <FormControl>
                                    <Input
                                      placeholder={t('form.durationPlaceholder')}
                                      {...field}
                                      data-testid="duration-input"
                                    />
                                  </FormControl>
                                  <FormMessage />
                                </FormItem>
                              )}
                            />
                          </div>
                          <div className="mt-6">
                            <FormLabel>{t('form.stagesLabel')}</FormLabel>
                            <FormDescription>{t('form.stagesDescription')}</FormDescription>
                            {stageFields.map((field, index) => (
                              <div key={field.id} className="flex items-end gap-2 mt-2">
                                <FormField
                                  control={form.control}
                                  name={`stages.${index}.duration`}
                                  render={({ field }) => (
                                    <FormItem className="flex-1">
                                      <FormLabel className="sr-only">
                                        {t('form.stageDurationLabel')}
                                      </FormLabel>
                                      <FormControl>
                                        <Input
                                          placeholder={t('form.stageDurationPlaceholder')}
                                          {...field}
                                          data-testid={`stage-duration-${index}`}
                                        />
                                      </FormControl>
                                      <FormMessage />
                                    </FormItem>
                                  )}
                                />
                                <ChevronsRightLeft className="h-5 w-5 text-muted-foreground mb-2" />
                                <FormField
                                  control={form.control}
                                  name={`stages.${index}.target`}
                                  render={({ field }) => (
                                    <FormItem className="flex-1">
                                      <FormLabel className="sr-only">
                                        {t('form.stageTargetVusLabel')}
                                      </FormLabel>
                                      <FormControl>
                                        <Input
                                          type="number"
                                          placeholder={t('form.stageTargetVusPlaceholder')}
                                          {...field}
                                          onChange={(e) =>
                                            field.onChange(parseInt(e.target.value, 10))
                                          }
                                          data-testid={`stage-target-${index}`}
                                        />
                                      </FormControl>
                                      <FormMessage />
                                    </FormItem>
                                  )}
                                />
                                <Button
                                  type="button"
                                  variant="destructive"
                                  size="icon"
                                  onClick={() => removeStage(index)}
                                  aria-label={t('form.removeStageLabel', { index: index + 1 })}
                                  data-testid={`remove-stage-${index}`}
                                >
                                  <Trash2 className="h-4 w-4" />
                                </Button>
                              </div>
                            ))}
                            <Button
                              type="button"
                              variant="outline"
                              size="sm"
                              className="mt-2"
                              onClick={() => appendStage({ duration: '', target: 0 })}
                              data-testid="add-stage-button"
                            >
                              <Plus className="mr-2 h-4 w-4" />
                              {t('form.addStageButton')}
                            </Button>
                          </div>
                        </CardContent>
                      </Card>
                    )}
                  </CardContent>
                </Card>
              )}

              <div className="flex justify-end pt-8">
                <Button
                  type="submit"
                  size="lg"
                  className="w-full md:w-auto"
                  disabled={form.formState.isSubmitting}
                  data-testid="run-test-button"
                >
                  <Rocket className="mr-2 h-5 w-5" />
                  {form.formState.isSubmitting
                    ? t('form.runningTestButton')
                    : t('form.runTestButton')}
                </Button>
              </div>
            </form>
          </Form>
        </CardContent>
      </Card>
      <AlertDialog open={isClearStorageDialogOpen} onOpenChange={setClearStorageDialogOpen}>
        <AlertDialogContent data-testid="clear-storage-dialog">
          <AlertDialogHeader>
            <AlertDialogTitle className="flex items-center gap-2">
              <History className="h-5 w-5" />
              {t('form.clearHistoryDialog.title')}
            </AlertDialogTitle>
            <AlertDialogDescription>
              {t('form.clearHistoryDialog.description')}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel
              onClick={() => {
                setClearStorageDialogOpen(false);
                proceedWithTest(false);
              }}
              data-testid="dont-clear-button"
            >
              {t('form.clearHistoryDialog.keepButton')}
            </AlertDialogCancel>
            <AlertDialogAction
              className="bg-destructive hover:bg-destructive/90"
              onClick={() => {
                setClearStorageDialogOpen(false);
                proceedWithTest(true);
              }}
              data-testid="clear-and-run-button"
            >
              <Trash2 className="mr-2 h-4 w-4" />
              {t('form.clearHistoryDialog.clearButton')}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
