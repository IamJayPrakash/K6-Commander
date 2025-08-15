
'use client'

import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { ServerCrash, RotateCw } from 'lucide-react'

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  return (
    <html lang="en" className="dark">
      <body>
        <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-black to-[#1a1a1a] p-4">
          <Card className="max-w-lg w-full bg-card/50 backdrop-blur-sm border border-destructive/50">
            <CardHeader className="text-center">
                <div className="mx-auto bg-destructive/20 rounded-full p-4 w-fit">
                    <ServerCrash className="h-12 w-12 text-destructive" />
                </div>
              <CardTitle className="text-3xl font-bold text-destructive mt-4">500 - Internal Server Error</CardTitle>
              <CardDescription>
                A critical error occurred on our end. Please try again.
              </CardDescription>
            </CardHeader>
            <CardContent className="text-center">
              <p className="text-muted-foreground mb-6">
                The technical team has been notified. You can attempt to reload the page.
              </p>
              
              {process.env.NODE_ENV === 'development' && (
                <details className="text-left bg-muted/50 p-4 rounded-md mb-6">
                    <summary className="cursor-pointer font-medium">Error Details</summary>
                    <pre className="mt-2 text-xs text-muted-foreground whitespace-pre-wrap">
                    {error.stack}
                    </pre>
                </details>
              )}

              <Button onClick={() => reset()} size="lg">
                <RotateCw className="mr-2 h-4 w-4" />
                Try Again
              </Button>
            </CardContent>
          </Card>
        </div>
      </body>
    </html>
  )
}
