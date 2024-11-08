import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { changePassword, User } from "@/services/userService";
import { useRouter } from "next/navigation";
import { useState } from "react";

// const ProfileInfo = ({ user }: { user: User }) => (
//     <Card className="mb-8">
//         <CardHeader>
//             <CardTitle>Account Information</CardTitle>
//         </CardHeader>
//         <p className="h-[1px] w-full bg-muted-foreground opacity-25 mb-6"></p>
//         <CardContent className="space-y-4">
//             <div className="flex flex-col sm:flex-row items-center gap-4">
//                 {/* <div className="relative h-20 w-20">
//             <Image
//               src={user.avatarUrl || "/placeholder.svg?height=80&width=80"}
//               alt="Profile"
//               className="rounded-full object-cover"
//               width={80}
//               height={80}
//             />
//           </div> */}
//                 <div className="text-center sm:text-left">
//                     <h3 className="text-xl font-semibold">{user.username}</h3>
//                     <p className="text-sm text-muted-foreground">{user.email}</p>
//                 </div>
//             </div>
//             <Button onClick={()=>handleChangePassword()} variant="outline" className="w-full sm:w-auto">Change Password</Button>
//         </CardContent>
//     </Card>
// )

export default function ProfileInfo({ user }: { user: User }) {
    const router = useRouter();
    const [error, setError] = useState('')
    const [success, setSuccess] = useState(false)
    const [isLoading, setIsLoading] = useState(false)
    const handleChangePassword = async (e: React.FormEvent) => {
        e.preventDefault()
        setError('')
        setIsLoading(true)

        try {
            const { token } = await changePassword();
            setSuccess(true);
            router.push(`/reset-password?token=${encodeURIComponent(token)}`);
        } catch (err) {
            setError('Failed to reset password. Please try again.')
        } finally {
            setIsLoading(false)
        }
    }
    return (
        <Card className="mb-8">
            <CardHeader>
                <CardTitle>Account Information</CardTitle>
            </CardHeader>
            <p className="h-[1px] w-full bg-muted-foreground opacity-25 mb-6"></p>
            <CardContent className="space-y-4">
                <div className="flex flex-col sm:flex-row items-center gap-4">
                    {/* <div className="relative h-20 w-20">
            <Image
              src={user.avatarUrl || "/placeholder.svg?height=80&width=80"}
              alt="Profile"
              className="rounded-full object-cover"
              width={80}
              height={80}
            />
          </div> */}
                    <div className="text-center sm:text-left">
                        <h3 className="text-xl font-semibold">{user.username}</h3>
                        <p className="text-sm text-muted-foreground">{user.email}</p>
                    </div>
                </div>
                <Button onClick={(e) => handleChangePassword(e)} variant="outline" className="w-full sm:w-auto">Change Password</Button>
            </CardContent>
        </Card>
    )
}

// export default ProfileInfo;