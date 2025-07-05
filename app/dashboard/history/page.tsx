import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { prisma } from "@/lib/prisma"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Eye, Calendar, Code } from "lucide-react"
import Link from "next/link"

export default async function HistoryPage() {
  const session = await getServerSession(authOptions)

  const user = await prisma.user.findUnique({
    where: { email: session?.user?.email! },
    include: {
      reviews: {
        orderBy: { createdAt: "desc" },
      },
    },
  })

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Review History</h1>
        <p className="text-slate-400">View all your past code reviews</p>
      </div>

      {user?.reviews.length ? (
        <div className="grid gap-4">
          {user.reviews.map((review) => (
            <Card key={review.id} className="bg-slate-800 border-slate-700">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle className="flex items-center">
                      <Code className="mr-2 h-5 w-5" />
                      {review.title}
                    </CardTitle>
                    <CardDescription className="flex items-center mt-2">
                      <Calendar className="mr-1 h-4 w-4" />
                      {review.createdAt.toLocaleDateString()} • {review.language}
                    </CardDescription>
                  </div>
                  <div className="flex items-center space-x-2">
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
                    <Button variant="outline" size="sm" asChild>
                      <Link href={`/dashboard/history/${review.id}`}>
                        <Eye className="mr-1 h-4 w-4" />
                        View
                      </Link>
                    </Button>
                  </div>
                </div>
              </CardHeader>
              {review.feedback && (
                <CardContent>
                  <p className="text-slate-300 line-clamp-3">{review.feedback.substring(0, 200)}...</p>
                </CardContent>
              )}
            </Card>
          ))}
        </div>
      ) : (
        <Card className="bg-slate-800 border-slate-700">
          <CardContent className="text-center py-12">
            <Code className="h-12 w-12 mx-auto mb-4 text-slate-400" />
            <h3 className="text-lg font-medium mb-2">No reviews yet</h3>
            <p className="text-slate-400 mb-4">Start your first code review to see it here</p>
            <Button className="bg-blue-600 hover:bg-blue-700" asChild>
              <Link href="/dashboard/review">Start Review</Link>
            </Button>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
