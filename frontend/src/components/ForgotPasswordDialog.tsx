import React, { useState } from 'react'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { requestPasswordReset } from '@/services/userService'

interface ForgotPasswordDialogProps {
  isOpen: boolean;
  onClose: () => void;
}

const ForgotPasswordDialog: React.FC<ForgotPasswordDialogProps> = ({
  isOpen,
  onClose,
}) => {
  const [email, setEmail] = useState('')
  const [error, setError] = useState('')
  const [success, setSuccess] = useState(false)
  const [isLoading, setIsLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setIsLoading(true)

    try {
      const baseUri = window.location.origin;
      await requestPasswordReset({ email, frontendBaseUri: baseUri })
      setSuccess(true)
    } catch (err) {
      setError('Failed to send reset instructions. Please try again.')
    } finally {
      setIsLoading(false)
    }
  }

  const handleClose = () => {
    if (!isLoading) {
      setEmail('')
      setError('')
      setSuccess(false)
      onClose()
    }
  }

  return (
    <Dialog 
      open={isOpen} 
      onOpenChange={handleClose}
      modal
    >
      <DialogContent 
        className="fixed top-[50%] left-[50%] w-[calc(100%-2rem)] max-w-[425px] translate-x-[-50%] translate-y-[-50%] rounded-lg bg-background p-0 shadow-lg sm:w-full"
        onPointerDownOutside={(e) => {
          if (isLoading) {
            e.preventDefault();
          }
        }}
        onEscapeKeyDown={(e) => {
          if (isLoading) {
            e.preventDefault();
          }
        }}
      >
        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <DialogHeader className="px-6 pt-6 pb-2">
            <DialogTitle className="text-2xl font-semibold">Reset Password</DialogTitle>
            <DialogDescription className="text-muted-foreground">
              {!success 
                ? "Enter your email address and we'll send you instructions to reset your password."
                : "Password reset instructions have been sent to your email."}
            </DialogDescription>
          </DialogHeader>
          
          {error && (
            <div className="px-6 text-red-500 text-sm">{error}</div>
          )}
          
          {!success && (
            <div className="px-6">
              <Input
                type="email"
                placeholder="Enter your email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="w-full"
              />
            </div>
          )}

          <DialogFooter className="px-6 py-4 bg-muted/40">
            <div className="flex flex-col-reverse sm:flex-row gap-2 w-full">
              <Button 
                type="button" 
                variant="outline" 
                onClick={handleClose}
                className="w-full sm:w-auto"
              >
                Back to Login
              </Button>
              {!success && (
                <Button 
                  type="submit" 
                  disabled={isLoading} 
                  className="w-full sm:w-auto"
                >
                  {isLoading ? (
                    <div className="flex items-center justify-center gap-2">
                      <div className="w-4 h-4 border-2 border-t-transparent border-white rounded-full animate-spin" />
                      Sending...
                    </div>
                  ) : (
                    'Send Reset Instructions'
                  )}
                </Button>
              )}
            </div>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}

export default ForgotPasswordDialog