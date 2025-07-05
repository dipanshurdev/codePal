import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { prisma } from "@/lib/prisma"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { CheckCircle, CreditCard, Zap } from "lucide-react"

export default async function BillingPage() {
  const session = await getServerSession(authOptions)

  const user = await prisma.user.findUnique({
    where: { email: session?.user?.email! },
    include: {
      subscription: true,
    },
  })

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Billing & Subscription</h1>
        <p className="text-slate-400">Manage your subscription and billing information</p>
      </div>

      {/* Current Plan */}
      <Card className="bg-slate-800 border-slate-700">
        <CardHeader>
          <CardTitle className="flex items-center">
            <CreditCard className="mr-2 h-5 w-5" />
            Current Plan
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-between">
            <div>
              <div className="flex items-center space-x-2">
                <Badge className="bg-blue-600">{user?.plan || "FREE"}</Badge>
                <span className="text-lg font-medium">
                  {user?.plan === "FREE" ? "Free Plan" : user?.plan === "PRO" ? "Pro Plan" : "Enterprise Plan"}
                </span>
              </div>
              <p className="text-slate-400 mt-1">{user?.credits} credits remaining</p>
            </div>
            <div className="text-right">
              <p className="text-2xl font-bold">
                ${user?.plan === "FREE" ? "0" : user?.plan === "PRO" ? "19" : "99"}
                <span className="text-sm font-normal">/month</span>
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Usage Stats */}
      <Card className="bg-slate-800 border-slate-700">
        <CardHeader>
          <CardTitle className="flex items-center">
            <Zap className="mr-2 h-5 w-5" />
            Usage This Month
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex justify-between">
              <span>Code Reviews</span>
              <span className="font-medium">5 / {user?.plan === "FREE" ? "10" : "∞"}</span>
            </div>
            <div className="w-full bg-slate-700 rounded-full h-2">
              <div
                className="bg-blue-600 h-2 rounded-full"
                style={{ width: user?.plan === "FREE" ? "50%" : "10%" }}
              ></div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Upgrade Plans */}
      <div className="grid md:grid-cols-3 gap-6">
        <Card className="bg-slate-800 border-slate-700">
          <CardHeader>
            <CardTitle>Free</CardTitle>
            <CardDescription>Perfect for getting started</CardDescription>
            <div className="text-3xl font-bold">
              $0<span className="text-sm font-normal">/month</span>
            </div>
          </CardHeader>
          <CardContent>
            <ul className="space-y-2 mb-6">
              <li className="flex items-center">
                <CheckCircle className="h-4 w-4 text-green-400 mr-2" />
                10 reviews per month
              </li>
              <li className="flex items-center">
                <CheckCircle className="h-4 w-4 text-green-400 mr-2" />
                Basic code analysis
              </li>
              <li className="flex items-center">
                <CheckCircle className="h-4 w-4 text-green-400 mr-2" />5 supported languages
              </li>
            </ul>
            <Button variant="outline" className="w-full bg-transparent" disabled={user?.plan === "FREE"}>
              {user?.plan === "FREE" ? "Current Plan" : "Downgrade"}
            </Button>
          </CardContent>
        </Card>

        <Card className="bg-slate-800 border-blue-500 relative">
          <Badge className="absolute -top-2 left-1/2 transform -translate-x-1/2 bg-blue-600">Most Popular</Badge>
          <CardHeader>
            <CardTitle>Pro</CardTitle>
            <CardDescription>For serious developers</CardDescription>
            <div className="text-3xl font-bold">
              $19<span className="text-sm font-normal">/month</span>
            </div>
          </CardHeader>
          <CardContent>
            <ul className="space-y-2 mb-6">
              <li className="flex items-center">
                <CheckCircle className="h-4 w-4 text-green-400 mr-2" />
                Unlimited reviews
              </li>
              <li className="flex items-center">
                <CheckCircle className="h-4 w-4 text-green-400 mr-2" />
                Advanced AI analysis
              </li>
              <li className="flex items-center">
                <CheckCircle className="h-4 w-4 text-green-400 mr-2" />
                All languages supported
              </li>
              <li className="flex items-center">
                <CheckCircle className="h-4 w-4 text-green-400 mr-2" />
                Priority support
              </li>
            </ul>
            <Button className="w-full bg-blue-600 hover:bg-blue-700" disabled={user?.plan === "PRO"}>
              {user?.plan === "PRO" ? "Current Plan" : "Upgrade to Pro"}
            </Button>
          </CardContent>
        </Card>

        <Card className="bg-slate-800 border-slate-700">
          <CardHeader>
            <CardTitle>Enterprise</CardTitle>
            <CardDescription>For teams and organizations</CardDescription>
            <div className="text-3xl font-bold">
              $99<span className="text-sm font-normal">/month</span>
            </div>
          </CardHeader>
          <CardContent>
            <ul className="space-y-2 mb-6">
              <li className="flex items-center">
                <CheckCircle className="h-4 w-4 text-green-400 mr-2" />
                Everything in Pro
              </li>
              <li className="flex items-center">
                <CheckCircle className="h-4 w-4 text-green-400 mr-2" />
                Team collaboration
              </li>
              <li className="flex items-center">
                <CheckCircle className="h-4 w-4 text-green-400 mr-2" />
                Custom integrations
              </li>
              <li className="flex items-center">
                <CheckCircle className="h-4 w-4 text-green-400 mr-2" />
                Dedicated support
              </li>
            </ul>
            <Button variant="outline" className="w-full bg-transparent" disabled={user?.plan === "ENTERPRISE"}>
              {user?.plan === "ENTERPRISE" ? "Current Plan" : "Contact Sales"}
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
