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
import { resetPassword } from '@/services/userService'
import { useRouter } from 'next/navigation'

interface ResetPasswordDialogProps {
  isOpen: boolean;
  onClose: () => void;
  token: string;
}

const ResetPasswordDialog: React.FC<ResetPasswordDialogProps> = ({
  isOpen,
  onClose,
  token,
}) => {
  const [newPassword, setNewPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [error, setError] = useState('')
  const [success, setSuccess] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const router = useRouter()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')

    if (newPassword !== confirmPassword) {
      setError('Passwords do not match')
      return
    }

    setIsLoading(true)

    try {
      await resetPassword({ token, newPassword });
      setSuccess(true);
      router.push('/');
    } catch (err) {
      setError('Failed to reset password. Please try again.')
    } finally {
      setIsLoading(false)
    }
  }

  const handleClose = () => {
    if (!isLoading) {
      setNewPassword('')
      setConfirmPassword('')
      setError('')
      setSuccess(false)
      onClose()
    }
    router.push('/');
  }

  return (
    <Dialog 
      open={isOpen} 
      onOpenChange={handleClose}
      modal
    >
      <DialogContent 
        className="sm:max-w-[425px] bg-background p-0 gap-0 overflow-hidden"
      >
        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <DialogHeader className="px-6 pt-6 pb-2">
            <DialogTitle className="text-2xl font-semibold">Reset Password</DialogTitle>
            <DialogDescription className="text-muted-foreground">
              {!success 
                ? "Enter your new password."
                : "Your password has been reset successfully. You can now login with your new password."}
            </DialogDescription>
          </DialogHeader>
          
          {error && (
            <div className="px-6 text-red-500 text-sm">{error}</div>
          )}
          
          {!success && (
            <div className="px-6 flex flex-col gap-4">
              <Input
                type="password"
                placeholder="New password"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                required
                className="w-full"
              />
              <Input
                type="password"
                placeholder="Confirm new password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                required
                className="w-full"
              />
            </div>
          )}

          <DialogFooter className="px-6 py-4 bg-muted/40">
            <Button 
              type={success ? "button" : "submit"}
              disabled={isLoading}
              className="w-full"
              onClick={success ? handleClose : undefined}
            >
              {isLoading ? (
                <div className="flex items-center justify-center gap-2">
                  <div className="w-4 h-4 border-2 border-t-transparent border-white rounded-full animate-spin" />
                  Resetting Password...
                </div>
              ) : (
                success ? 'Back to Login' : 'Reset Password'
              )}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}

export default ResetPasswordDialog 