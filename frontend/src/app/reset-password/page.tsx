'use client';

import { useSearchParams } from 'next/navigation';
import { Suspense, useEffect } from 'react';
import ResetPasswordDialog from '@/app/reset-password/ResetPasswordDialog';
import { useRouter } from 'next/navigation';

function ResetPasswordContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const token = searchParams?.get('token');

  useEffect(() => {
    if (!token) {
      router.push('/login');
    }
  }, [token, router]);

  if (!token) {
    return null;
  }

  return (
    <div className="min-h-screen">
      <ResetPasswordDialog
        isOpen={true}
        onClose={() => router.push('/login')}
        token={token}
      />
    </div>
  );
}

export default function ResetPasswordPage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <ResetPasswordContent />
    </Suspense>
  );
}
