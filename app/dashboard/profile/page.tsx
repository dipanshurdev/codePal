import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { prisma } from "@/lib/prisma"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { User, Mail, Calendar, Code } from "lucide-react"

export default async function ProfilePage() {
  const session = await getServerSession(authOptions)

  const user = await prisma.user.findUnique({
    where: { email: session?.user?.email! },
    include: {
      reviews: true,
    },
  })

  const totalReviews = user?.reviews.length || 0
  const completedReviews = user?.reviews.filter((r) => r.status === "COMPLETED").length || 0

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Profile</h1>
        <p className="text-slate-400">Manage your account information</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Profile Info */}
        <Card className="bg-slate-800 border-slate-700 lg:col-span-2">
          <CardHeader>
            <CardTitle className="flex items-center">
              <User className="mr-2 h-5 w-5" />
              Profile Information
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="flex items-center space-x-4">
              <Avatar className="h-20 w-20">
                <AvatarImage src={session?.user?.image || ""} alt={session?.user?.name || ""} />
                <AvatarFallback className="text-2xl">{session?.user?.name?.[0] || "U"}</AvatarFallback>
              </Avatar>
              <div>
                <h2 className="text-2xl font-bold">{session?.user?.name}</h2>
                <p className="text-slate-400 flex items-center">
                  <Mail className="mr-1 h-4 w-4" />
                  {session?.user?.email}
                </p>
                <div className="flex items-center mt-2">
                  <Calendar className="mr-1 h-4 w-4" />
                  <span className="text-sm text-slate-400">Member since {user?.createdAt.toLocaleDateString()}</span>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="text-center p-4 bg-slate-700 rounded-lg">
                <div className="text-2xl font-bold text-blue-400">{totalReviews}</div>
                <div className="text-sm text-slate-400">Total Reviews</div>
              </div>
              <div className="text-center p-4 bg-slate-700 rounded-lg">
                <div className="text-2xl font-bold text-green-400">{completedReviews}</div>
                <div className="text-sm text-slate-400">Completed</div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Account Status */}
        <Card className="bg-slate-800 border-slate-700">
          <CardHeader>
            <CardTitle>Account Status</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm">Plan</span>
                <Badge className="bg-blue-600">{user?.plan || "FREE"}</Badge>
              </div>
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm">Credits</span>
                <span className="font-medium">{user?.credits}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm">Status</span>
                <Badge className="bg-green-600">Active</Badge>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Recent Activity */}
      <Card className="bg-slate-800 border-slate-700">
        <CardHeader>
          <CardTitle className="flex items-center">
            <Code className="mr-2 h-5 w-5" />
            Recent Activity
          </CardTitle>
          <CardDescription>Your latest code reviews</CardDescription>
        </CardHeader>
        <CardContent>
          {user?.reviews.slice(0, 5).map((review) => (
            <div
              key={review.id}
              className="flex items-center justify-between py-3 border-b border-slate-700 last:border-b-0"
            >
              <div>
                <h4 className="font-medium">{review.title}</h4>
                <p className="text-sm text-slate-400">
                  {review.language} • {review.createdAt.toLocaleDateString()}
                </p>
              </div>
              <Badge
                className={
                  review.status === "COMPLETED"
                    ? "bg-green-600"
                    : review.status === "PENDING"
                      ? "bg-yellow-600"
                      : "bg-red-600"
                }
              >
                {review.status}
              </Badge>
            </div>
          ))}
          {!user?.reviews.length && <p className="text-slate-400 text-center py-8">No activity yet</p>}
        </CardContent>
      </Card>
    </div>
  )
}
