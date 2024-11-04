import React, { useState } from 'react'
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useAuth } from '@/contexts/AuthContext'
import { login, register } from '@/services/userService'
import { useRouter } from 'next/navigation'
import EmailVerificationDialog from './EmailVerificationDialog'
import ForgotPasswordDialog from './ForgotPasswordDialog'

interface LoginSignupDialogProps {
  className?: string;
}

const LoginSignupDialog: React.FC<LoginSignupDialogProps> = ({ className }) => {
  const [isOpen, setIsOpen] = useState(false)
  const [isLogin, setIsLogin] = useState(true)
  const [email, setEmail] = useState('')
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [error, setError] = useState('')
  const [showVerification, setShowVerification] = useState(false)
  const [registeredEmail, setRegisteredEmail] = useState('')
  const { setUser } = useAuth()
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(false)
  const [showForgotPassword, setShowForgotPassword] = useState(false)

  const toggleMode = () => {
    setIsLogin(!isLogin)
    setError('')
    setEmail('')
    setUsername('')
    setPassword('')
    setConfirmPassword('')
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setIsLoading(true)

    try {
      if (isLogin) {
        const response = await login({ email, password })
        setUser(response.user)
        setIsOpen(false)
      } else {
        if (password !== confirmPassword) {
          setError('Passwords do not match')
          return
        }
        const response = await register({ email, username, password })
        setRegisteredEmail(email)
        setShowVerification(true)
        setIsOpen(false)
      }
    } catch (err) {
      setError(isLogin ? 'Invalid credentials' : 'Registration failed')
    } finally {
      setIsLoading(false)
    }
  }

  const handleOpenChange = (open: boolean) => {
    if (!isLoading) {
      setIsOpen(open);
      if (className) {
        const event = new CustomEvent('closeDropdownMenu');
        window.dispatchEvent(event);
      }
      if (!open) {
        setError('');
        setEmail('');
        setUsername('');
        setPassword('');
        setConfirmPassword('');
      }
    }
  };

  return (
    <Dialog 
      open={isOpen} 
      onOpenChange={handleOpenChange}
      modal
    >
      <DialogTrigger asChild>
        <Button 
          variant="outline" 
          className={className}
          onClick={(e) => {
            e.stopPropagation();
            setIsOpen(true);
            if (className) {
              e.preventDefault();
            }
          }}
        >
          Login / Sign Up
        </Button>
      </DialogTrigger>
      <DialogContent 
        className="fixed top-[50%] left-[50%] w-[calc(100%-2rem)] max-w-[425px] translate-x-[-50%] translate-y-[-50%] rounded-lg bg-background p-0 shadow-lg sm:w-full z-[100]"
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
            <DialogTitle className="text-2xl font-semibold">{isLogin ? 'Login' : 'Sign Up'}</DialogTitle>
            <DialogDescription className="text-muted-foreground">
              {isLogin ? 'Enter your credentials to login.' : 'Create a new account.'}
            </DialogDescription>
          </DialogHeader>
          {error && (
            <div className="px-6 text-red-500 text-sm">{error}</div>
          )}
          <div className="px-6 flex flex-col gap-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="email" className="text-right">
                Email
              </Label>
              <Input 
                id="email" 
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="col-span-3"
                required
              />
            </div>
            {!isLogin && (
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="username" className="text-right">
                  Username
                </Label>
                <Input 
                  id="username"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  className="col-span-3"
                  required
                />
              </div>
            )}
            <div className="flex flex-col gap-1">
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="password" className="text-right">
                  Password
                </Label>
                <Input 
                  id="password" 
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="col-span-3"
                  required
                />
              </div>
              {isLogin && (
                <div className="grid grid-cols-4">
                  <div className="col-start-2 col-span-3 flex justify-end">
                    <Button
                      type="button"
                      variant="link"
                      className="h-6 px-0 text-xs font-normal text-muted-foreground hover:text-primary"
                      onClick={() => {
                        setShowForgotPassword(true)
                        setIsOpen(false)
                      }}
                    >
                      Forgot password?
                    </Button>
                  </div>
                </div>
              )}
            </div>
            {!isLogin && (
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="confirm-password" className="text-right">
                  Confirm
                </Label>
                <Input 
                  id="confirm-password" 
                  type="password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  className="col-span-3"
                  required={!isLogin}
                />
              </div>
            )}
          </div>
          <DialogFooter className="px-6 py-4 bg-muted/40">
            <div className="flex flex-col-reverse sm:flex-row justify-end gap-2 w-full">
              <Button 
                type="button" 
                variant="outline" 
                onClick={toggleMode} 
                className="w-full sm:w-[200px] h-10 order-1 sm:order-none"
              >
                {isLogin ? 'Need an account?' : 'Have an account?'}
              </Button>
              <Button 
                type="submit" 
                disabled={isLoading} 
                className="w-full sm:w-[140px] h-10 min-w-[140px]"
              >
                {isLoading ? (
                  <div className="flex items-center justify-center gap-2 w-full">
                    <div className="w-4 h-4 border-2 border-t-transparent border-white rounded-full animate-spin" />
                    <span className="truncate">
                      {isLogin ? 'Logging in...' : 'Signing up...'}
                    </span>
                  </div>
                ) : (
                  isLogin ? 'Login' : 'Sign Up'
                )}
              </Button>
            </div>
          </DialogFooter>
        </form>
      </DialogContent>
      {showVerification && (
        <EmailVerificationDialog
          isOpen={showVerification}
          onClose={() => {
            setShowVerification(false)
            setIsOpen(false)
          }}
          email={registeredEmail}
        />
      )}
      {showForgotPassword && (
        <ForgotPasswordDialog
          isOpen={showForgotPassword}
          onClose={() => {
            setShowForgotPassword(false)
            setIsOpen(true)
          }}
        />
      )}
    </Dialog>
  )
}

export default LoginSignupDialog
