'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function PlacementsRedirectPage() {
  const router = useRouter();

  useEffect(() => {
    router.replace('/student/preparation?tab=placement');
  }, [router]);

  return (
    <div className="flex h-screen items-center justify-center bg-slate-50 text-slate-400 text-xs font-medium">
      Redirecting to Preparation Hub...
    </div>
  );
}
