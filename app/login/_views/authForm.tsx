
"use client";
import { useState } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { z } from "zod"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { Loader2 } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { cn } from "@/lib/utils"
import { LoginFormValues, SignupFormValues } from "@/types/types";
import { loginSchema, signupSchema } from "@/lib/schema";


export default function AuthForm() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const [isSignUp, setIsSignUp] = useState(false)
  const [error, setError] = useState<string>("")
  const [isLoading, setIsLoading] = useState(false)

  // Login form
  const loginForm = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  })

  // Signup form
  const signupForm = useForm<SignupFormValues>({
    resolver: zodResolver(signupSchema),
    defaultValues: {
      email: "",
      password: "",
      confirmPassword: "",
    },
  })

  // Get the active form based on the current mode
  const activeForm = isSignUp ? signupForm : loginForm

  const onSubmit = async (data: LoginFormValues | SignupFormValues) => {
    setError("")
    setIsLoading(true)

    try {
      const endpoint = isSignUp ? "/api/auth/signup" : "/api/auth/login"

      const response = await fetch(endpoint, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      })

      const responseData = await response.json()

      if (!response.ok) {
        throw new Error(responseData.error || `${isSignUp ? "Sign up" : "Log in"} failed`)
      }

      // Get the redirected from URL or default to "/"
      const redirectTo = searchParams.get("redirectedFrom") || "/"
      router.push(redirectTo)
      router.refresh()
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred")
    } finally {
      setIsLoading(false)
    }
  }

  const toggleMode = () => {
    setIsSignUp(!isSignUp)
    setError("")
    loginForm.reset()
    signupForm.reset()
  }

  return (
    <Card className="w-full max-w-md mx-auto">
      <CardHeader>
        <CardTitle>{isSignUp ? "Create an account" : "Welcome back"}</CardTitle>
        <CardDescription>
          {isSignUp
            ? "Enter your details to create a new account"
            : "Enter your credentials to sign in to your account"}
        </CardDescription>
      </CardHeader>
      <CardContent>
        {error && (
          <Alert variant="destructive" className="mb-4">
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        <form onSubmit={activeForm.handleSubmit(onSubmit)} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              type="email"
              disabled={isLoading}
              {...(isSignUp ? signupForm.register("email") : loginForm.register("email"))}
              className={cn(activeForm.formState.errors.email && "border-red-500")}
            />
            {activeForm.formState.errors.email && (
              <p className="text-sm text-red-500">{activeForm.formState.errors.email.message}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="password">Password</Label>
            <Input
              id="password"
              type="password"
              disabled={isLoading}
              {...(isSignUp ? signupForm.register("password") : loginForm.register("password"))}
              className={cn(activeForm.formState.errors.password && "border-red-500")}
            />
            {activeForm.formState.errors.password && (
              <p className="text-sm text-red-500">{activeForm.formState.errors.password.message}</p>
            )}
          </div>

          {isSignUp && (
            <div className="space-y-2">
              <Label htmlFor="confirmPassword">Confirm Password</Label>
              <Input
                id="confirmPassword"
                type="password"
                disabled={isLoading}
                {...signupForm.register("confirmPassword")}
                className={cn(signupForm.formState.errors.confirmPassword && "border-red-500")}
              />
              {signupForm.formState.errors.confirmPassword && (
                <p className="text-sm text-red-500">{signupForm.formState.errors.confirmPassword.message}</p>
              )}
            </div>
          )}

          <Button type="submit" className="w-full" disabled={isLoading}>
            {isLoading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                {isSignUp ? "Creating account..." : "Signing in..."}
              </>
            ) : isSignUp ? (
              "Sign up"
            ) : (
              "Sign in"
            )}
          </Button>
        </form>
      </CardContent>
      <CardFooter className="flex flex-col space-y-4">
        <div className="flex items-center justify-between w-full">
          <span className="text-sm text-muted-foreground">
            {isSignUp ? "Already have an account?" : "Don't have an account?"}
          </span>
          <div className="flex items-center space-x-2">
            <Button className=" cursor-pointer" variant="link" onClick={toggleMode}>{isSignUp ? "Sign in" : "Sign up"}</Button>
          </div>
        </div>
      </CardFooter>
    </Card>
  )
}