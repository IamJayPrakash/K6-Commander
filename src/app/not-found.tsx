import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Rocket } from 'lucide-react'

export default function NotFound() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen text-center px-4">
      <div className="max-w-md">
        <div className="relative mb-8">
            <h1 className="text-9xl font-bold text-primary">404</h1>
            <p className="text-2xl font-semibold mt-4">Page Not Found</p>
            <p className="text-muted-foreground mt-2">
                Oops! The page you're looking for seems to have drifted off into the cosmos.
            </p>
        </div>
        
        <Rocket className="w-24 h-24 text-accent animate-pulse mx-auto mb-8" />

        <Button asChild>
          <Link href="/">Return to Home Base</Link>
        </Button>
      </div>
    </div>
  )
}
