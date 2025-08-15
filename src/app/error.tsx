
'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
  ServerCrash,
  RotateCw,
  ClipboardCopy,
  Check,
  Code,
} from 'lucide-react';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';
import { ScrollArea } from '@/components/ui/scroll-area';
import { useToast } from '@/hooks/use-toast';

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  const { toast } = useToast();
  const [isCopied, setIsCopied] = useState(false);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(error.stack || '');
      setIsCopied(true);
      setTimeout(() => setIsCopied(false), 2000); // Reset after 2 seconds
      toast({
        title: 'Copied to clipboard!',
        description: 'The error stack trace has been copied.',
      });
    } catch (err) {
      toast({
        variant: 'destructive',
        title: 'Copy failed',
        description: 'Could not copy the error to your clipboard.',
      });
    }
  };

  return (
      <main className="flex-1 flex items-center justify-center p-4 font-mono">
        <Card className="max-w-2xl w-full bg-card/50 backdrop-blur-sm border border-destructive/50 shadow-2xl shadow-destructive/10">
          <CardHeader className="text-center">
            <div className="mx-auto bg-destructive/10 rounded-full p-4 w-fit border-2 border-dashed border-destructive/20 animate-pulse">
              <ServerCrash className="h-12 w-12 text-destructive" />
            </div>
            <CardTitle className="text-3xl font-bold text-destructive mt-4">
              500 - System Fault
            </CardTitle>
            <CardDescription className="text-lg">
              A critical error occurred on the server.
            </CardDescription>
          </CardHeader>
          <CardContent className="text-center">
            <p className="text-muted-foreground mb-6">
              Our systems have detected an anomaly. The technical team has
              been notified. You can attempt to reload the page or review the
              error details below.
            </p>

            {error?.stack && (
              <Accordion type="single" collapsible className="w-full mb-6">
                <AccordionItem value="error-details">
                  <AccordionTrigger className="text-base">
                    <div className="flex items-center gap-2">
                      <Code className="h-4 w-4" />
                      <span>Error Stack Trace</span>
                    </div>
                  </AccordionTrigger>
                  <AccordionContent>
                    <div className="bg-muted/50 p-4 rounded-md text-left">
                       <div className="flex justify-end mb-2">
                          <Button
                            variant="ghost"
                            size="sm"
                            className="h-7"
                            onClick={handleCopy}
                          >
                            {isCopied ? (
                              <>
                                <Check className="mr-2 h-4 w-4 text-green-500" />
                                Copied
                              </>
                            ) : (
                              <>
                                <ClipboardCopy className="mr-2 h-4 w-4" />
                                Copy
                              </>
                            )}
                            <span className="sr-only">Copy error log</span>
                          </Button>
                       </div>
                      <ScrollArea className="h-48 border rounded-md p-2">
                        <pre className="text-xs text-muted-foreground whitespace-pre-wrap">
                          {error.stack}
                        </pre>
                      </ScrollArea>
                    </div>
                  </AccordionContent>
                </AccordionItem>
              </Accordion>
            )}

            <Button onClick={() => reset()} size="lg">
              <RotateCw className="mr-2 h-4 w-4" />
              Attempt Recovery
            </Button>
          </CardContent>
        </Card>
      </main>
  );
}
