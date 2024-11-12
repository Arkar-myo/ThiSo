import React from 'react'
import { useRouter } from 'next/navigation';

const Footer: React.FC = () => {
  const router = useRouter();
  return (
    <footer className="py-6 w-full shrink-0 px-4 md:px-6 border-t">
      <div className="container flex flex-col sm:flex-row items-center justify-between gap-4">
        <p className="text-xs text-gray-500">© 2024 ThiSo. All rights reserved.</p>
        <nav className="flex gap-4 sm:gap-6">
          <button onClick={() => router.push('/privacy-policy')} className="text-xs hover:underline underline-offset-4 text-gray-500">
            Privacy Policy
          </button>
          <button onClick={() => router.push('/terms-of-service')} className="text-xs hover:underline underline-offset-4 text-gray-500">
            Terms of Service
          </button>

        </nav>
      </div>
    </footer>
  )
}

export default Footer
