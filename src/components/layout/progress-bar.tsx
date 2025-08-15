'use client';

import { useEffect } from 'react';
import { usePathname, useSearchParams } from 'next/navigation';
import NProgress from 'nprogress';

export function ProgressBar() {
  const pathname = usePathname();
  const searchParams = useSearchParams();

  useEffect(() => {
    NProgress.configure({ showSpinner: false });

    const handleStart = () => NProgress.start();
    const handleStop = () => NProgress.done();

    // We use a timeout to avoid a flash of the progress bar on fast page loads
    const timer = setTimeout(() => {
        handleStop();
    }, 500);

    handleStart();

    return () => {
      clearTimeout(timer);
      handleStop();
    };
  }, [pathname, searchParams]);

  return null;
}
