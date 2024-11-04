import React, { useState } from 'react'
import {
  Dialog,
  DialogFooter,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { verifyEmail } from '@/services/userService'
import { useRouter } from 'next/navigation'

interface EmailVerificationDialogProps {
  isOpen: boolean;
  onClose: () => void;
  email: string;
}

const EmailVerificationDialog: React.FC<EmailVerificationDialogProps> = ({
  isOpen,
  onClose,
  email,
}) => {
  const [verificationCode, setVerificationCode] = useState('')
  const [error, setError] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const router = useRouter()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setIsLoading(true)

    try {
      await verifyEmail({ email, code: verificationCode })
      onClose()
      router.push('/')
    } catch (err) {
      setError('Invalid verification code')
    } finally {
      setIsLoading(false)
    }
  }

  const handleOpenChange = (open: boolean) => {
    if (!isLoading) {
      if (!open) {
        setVerificationCode('')
        setError('')
      }
      onClose()
    }
  }

  return (
    <Dialog 
      open={isOpen} 
      onOpenChange={handleOpenChange}
      modal
    >
      <DialogContent 
        className="sm:max-w-[425px] bg-background p-0 gap-0 overflow-hidden"
      >
        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <DialogHeader className="px-6 pt-6 pb-2">
            <DialogTitle className="text-2xl font-semibold">Verify Your Email</DialogTitle>
            <DialogDescription className="text-muted-foreground">
              Please enter the 6-digit verification code sent to {email}
            </DialogDescription>
          </DialogHeader>
          {error && (
            <div className="px-6 text-red-500 text-sm">{error}</div>
          )}
          <div className="px-6">
            <Input
              placeholder="Enter 6-digit code"
              value={verificationCode}
              onChange={(e) => setVerificationCode(e.target.value)}
              maxLength={6}
              pattern="[0-9]{6}"
              required
              className="text-center text-2xl tracking-widest"
            />
          </div>
          <DialogFooter className="px-6 py-4 bg-muted/40">
            <Button type="submit" disabled={isLoading} className="w-full">
              {isLoading ? (
                <div className="flex items-center justify-center gap-2">
                  <div className="w-4 h-4 border-2 border-t-transparent border-white rounded-full animate-spin" />
                  Verifying...
                </div>
              ) : (
                'Verify Email'
              )}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}

export default EmailVerificationDialog