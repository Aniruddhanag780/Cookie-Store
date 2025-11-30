'use client';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';
import { ArrowRight } from 'lucide-react';
import Link from 'next/link';

const GoogleIcon = () => (
  <svg className="h-5 w-5" viewBox="0 0 24 24">
    <path
      fill="#4285F4"
      d="M21.35 11.1h-9.1v3.8h5.2c-.3 1.2-1.3 3.3-5.2 3.3-3.1 0-5.7-2.6-5.7-5.7s2.6-5.7 5.7-5.7c1.7 0 3 .7 4.1 1.8l2.9-2.9C19.3 3.3 16.2 2 12.2 2 6.5 2 2 6.5 2 12s4.5 10 10.2 10c6.1 0 9.8-4.4 9.8-9.8 0-.6 0-1.2-.1-1.8z"
    />
  </svg>
);

const MicrosoftIcon = () => (
  <svg className="h-5 w-5" viewBox="0 0 21 21">
    <path fill="#f25022" d="M1 1h9v9H1z" />
    <path fill="#00a4ef" d="M1 11h9v9H1z" />
    <path fill="#7fba00" d="M11 1h9v9h-9z" />
    <path fill="#ffb900" d="M11 11h9v9h-9z" />
  </svg>
);

const GitHubIcon = () => (
  <svg className="h-5 w-5" viewBox="0 0 24 24">
    <path
      fill="currentColor"
      d="M12 2A10 10 0 0 0 2 12c0 4.42 2.87 8.17 6.84 9.5.5.09.68-.22.68-.48v-1.7c-2.78.6-3.37-1.34-3.37-1.34-.46-1.16-1.11-1.47-1.11-1.47-.91-.62.07-.6.07-.6 1 .07 1.53 1.03 1.53 1.03.89 1.52 2.34 1.08 2.91.83.09-.65.35-1.08.63-1.33-2.22-.25-4.55-1.11-4.55-4.94 0-1.1.39-1.99 1.03-2.69-.1-.25-.45-1.27.1-2.64 0 0 .84-.27 2.75 1.02.79-.22 1.65-.33 2.5-.33s1.71.11 2.5.33c1.91-1.29 2.75-1.02 2.75-1.02.55 1.37.2 2.39.1 2.64.64.7 1.03 1.6 1.03 2.69 0 3.84-2.33 4.68-4.57 4.93.36.31.68.92.68 1.85v2.72c0 .27.18.58.69.48A10 10 0 0 0 22 12c0-5.52-4.48-10-10-10z"
    />
  </svg>
);

export default function SignupPage() {
  return (
    <div
      className="flex items-center justify-center min-h-[80dvh] p-4"
      style={{ backgroundColor: '#121212' }}
    >
      <Card
        className="w-full max-w-md border-none"
        style={{ backgroundColor: 'black' }}
      >
        <CardHeader className="text-center">
          <CardTitle className="text-3xl font-bold">Create an account</CardTitle>
          <CardDescription>
            Enter your details to get started
          </CardDescription>
        </CardHeader>
        <CardContent className="grid gap-6">
          <div className="grid gap-4">
            <div className="grid gap-2">
              <Label htmlFor="email">Email Address</Label>
              <Input
                id="email"
                type="email"
                placeholder="m@example.com"
                required
                className="bg-background"
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="password">Password</Label>
              <Input id="password" type="password" required className="bg-background" />
            </div>
          </div>
          <Button className="w-full bg-white text-black hover:bg-gray-200">
            Create account <ArrowRight className="ml-2 h-4 w-4" />
          </Button>

          <div className="flex items-center gap-4">
            <Separator className="flex-1" />
            <span className="text-xs text-muted-foreground">
              OR CONTINUE WITH
            </span>
            <Separator className="flex-1" />
          </div>

          <div className="grid grid-cols-3 gap-3">
            <Button variant="outline" className="gap-2">
              <GoogleIcon /> Google
            </Button>
            <Button variant="outline" className="gap-2">
              <MicrosoftIcon /> Microsoft
            </Button>
            <Button variant="outline" className="gap-2">
              <GitHubIcon /> GitHub
            </Button>
          </div>
        </CardContent>
        <CardFooter className="flex flex-col gap-4 text-center text-xs">
          <p className="text-muted-foreground">
            By creating an account, you agree to our{' '}
            <Link href="#" className="underline hover:text-primary">
              Terms of Service
            </Link>{' '}
            and{' '}
            <Link href="#" className="underline hover:text-primary">
              Privacy Policy
            </Link>
            .
          </p>
          <div className="text-sm text-muted-foreground">
            Already have an account?{' '}
            <Link href="/login" className="underline hover:text-primary font-semibold">
              Login
            </Link>
          </div>
        </CardFooter>
      </Card>
    </div>
  );
}
