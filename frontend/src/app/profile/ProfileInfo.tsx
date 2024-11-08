'use client'

import { useState } from "react"
import { useRouter } from "next/navigation"
import { User, changePassword } from "@/services/userService"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
// import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Loader2, Key } from "lucide-react"
import { toast } from "sonner"

export default function ProfileInfo({ user }: { user: User }) {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);

  const handleChangePassword = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)

    try {
      const { token } = await changePassword()
      router.push(`/reset-password?token=${encodeURIComponent(token)}`)
    } catch (err) {
      toast.error("Failed to reset password. Please try again.");
    }
  }

  return (
    <Card className="mb-8 overflow-hidden">
      <CardHeader className="bg-muted/50 pb-4">
        <CardTitle className="text-2xl font-bold">Account Information</CardTitle>
      </CardHeader>
      <CardContent className="pt-6">
        <div className="flex flex-col sm:flex-row items-center gap-6">
          {/* <Avatar className="h-24 w-24">
            <AvatarImage src={user.avatarUrl} alt={user.username} />
            <AvatarFallback>{user.username.slice(0, 2).toUpperCase()}</AvatarFallback>
          </Avatar> */}
          <div className="text-center sm:text-left space-y-1">
            <h3 className="text-2xl font-semibold">{user.username}</h3>
            <p className="text-muted-foreground">{user.email}</p>
          </div>
        </div>
        <div className="mt-8">
          <Button
            onClick={handleChangePassword}
            variant="outline"
            className="w-full sm:w-auto"
            disabled={isLoading}
          >
            {isLoading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Sending Reset Link
              </>
            ) : (
              <>
                <Key className="mr-2 h-4 w-4" />
                Change Password
              </>
            )}
          </Button>
        </div>
      </CardContent>
      {isLoading && (
        <div className="fixed inset-0 flex items-center justify-center bg-background/50 backdrop-blur-sm z-50 overflow-hidden">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
      )}
    </Card>
  )
}