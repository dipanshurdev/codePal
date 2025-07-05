"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
import { Loader2, Send, Code } from "lucide-react"
import { useToast } from "@/hooks/use-toast"
import dynamic from "next/dynamic"

// Dynamically import Monaco Editor to avoid SSR issues
const MonacoEditor = dynamic(() => import("@monaco-editor/react"), {
  ssr: false,
  loading: () => <div className="h-96 bg-slate-800 rounded-lg animate-pulse" />,
})

const languages = [
  { value: "javascript", label: "JavaScript" },
  { value: "typescript", label: "TypeScript" },
  { value: "python", label: "Python" },
  { value: "java", label: "Java" },
  { value: "cpp", label: "C++" },
  { value: "csharp", label: "C#" },
  { value: "go", label: "Go" },
  { value: "rust", label: "Rust" },
  { value: "php", label: "PHP" },
  { value: "ruby", label: "Ruby" },
]

export default function CodeReviewPage() {
  const [title, setTitle] = useState("")
  const [language, setLanguage] = useState("")
  const [code, setCode] = useState("")
  const [feedback, setFeedback] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const { toast } = useToast()

  const handleSubmit = async () => {
    if (!title || !language || !code) {
      toast({
        title: "Missing Information",
        description: "Please fill in all required fields",
        variant: "destructive",
      })
      return
    }

    setIsLoading(true)

    try {
      const response = await fetch("/api/review", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          title,
          language,
          code,
        }),
      })

      const result = await response.json()

      if (response.ok) {
        setFeedback(result.feedback)
        toast({
          title: "Review Complete!",
          description: "Your code has been analyzed successfully",
        })
      } else {
        throw new Error(result.error)
      }
    } catch (error) {
      toast({
        title: "Review Failed",
        description: "Something went wrong. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Code Review</h1>
        <p className="text-slate-400">Get AI-powered feedback on your code</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Code Input */}
        <Card className="bg-slate-800 border-slate-700">
          <CardHeader>
            <CardTitle className="flex items-center">
              <Code className="mr-2 h-5 w-5" />
              Code Input
            </CardTitle>
            <CardDescription>Paste your code and select the programming language</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label htmlFor="title">Review Title</Label>
              <Input
                id="title"
                placeholder="e.g., Login function optimization"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="bg-slate-700 border-slate-600"
              />
            </div>

            <div>
              <Label htmlFor="language">Programming Language</Label>
              <Select value={language} onValueChange={setLanguage}>
                <SelectTrigger className="bg-slate-700 border-slate-600">
                  <SelectValue placeholder="Select language" />
                </SelectTrigger>
                <SelectContent>
                  {languages.map((lang) => (
                    <SelectItem key={lang.value} value={lang.value}>
                      {lang.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label>Code</Label>
              <div className="border border-slate-600 rounded-lg overflow-hidden">
                <MonacoEditor
                  height="400px"
                  language={language || "javascript"}
                  theme="vs-dark"
                  value={code}
                  onChange={(value) => setCode(value || "")}
                  options={{
                    minimap: { enabled: false },
                    fontSize: 14,
                    lineNumbers: "on",
                    roundedSelection: false,
                    scrollBeyondLastLine: false,
                    automaticLayout: true,
                  }}
                />
              </div>
            </div>

            <Button onClick={handleSubmit} disabled={isLoading} className="w-full bg-blue-600 hover:bg-blue-700">
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Analyzing Code...
                </>
              ) : (
                <>
                  <Send className="mr-2 h-4 w-4" />
                  Review Code
                </>
              )}
            </Button>
          </CardContent>
        </Card>

        {/* AI Feedback */}
        <Card className="bg-slate-800 border-slate-700">
          <CardHeader>
            <CardTitle>AI Feedback</CardTitle>
            <CardDescription>Detailed analysis and suggestions for your code</CardDescription>
          </CardHeader>
          <CardContent>
            {feedback ? (
              <div className="space-y-4">
                <Badge className="bg-green-600">Analysis Complete</Badge>
                <Textarea
                  value={feedback}
                  readOnly
                  className="min-h-[400px] bg-slate-700 border-slate-600"
                  placeholder="AI feedback will appear here..."
                />
              </div>
            ) : (
              <div className="flex items-center justify-center h-96 text-slate-400">
                <div className="text-center">
                  <Code className="h-12 w-12 mx-auto mb-4 opacity-50" />
                  <p>Submit your code to get AI feedback</p>
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
