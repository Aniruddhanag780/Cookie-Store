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
import { ArrowRight, Eye, EyeOff } from 'lucide-react';
import Link from 'next/link';
import { useForm, type SubmitHandler } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useAuth } from '@/firebase';
import {
  createUserWithEmailAndPassword,
  signInWithPopup,
  GoogleAuthProvider,
  GithubAuthProvider,
  OAuthProvider,
} from 'firebase/auth';
import { useToast } from '@/hooks/use-toast';
import { useRouter } from 'next/navigation';
import { useState, useRef } from 'react';
import ReCAPTCHA from 'react-google-recaptcha';

const GoogleIcon = () => (
  <svg className="h-5 w-5" viewBox="0 0 533.5 544.3">
    <path
      d="M533.5 278.4c0-18.5-1.5-37.1-4.7-55.3H272.1v104.8h147c-6.1 33.8-25.7 63.7-54.4 82.7v68h87.7c51.5-47.4 81.1-117.4 81.1-200.2z"
      fill="#4285f4"
    />
    <path
      d="M272.1 544.3c73.4 0 135.3-24.1 180.4-65.7l-87.7-68c-24.4 16.6-55.9 26-92.6 26-71 0-131.2-47.9-152.8-112.3H28.9v70.1c46.2 91.9 140.3 149.9 243.2 149.9z"
      fill="#34a853"
    />
    <path
      d="M119.3 324.3c-11.4-33.8-11.4-70.4 0-104.2V150H28.9c-38.6 76.9-38.6 167.5 0 244.4l90.4-70.1z"
      fill="#fbbc05"
    />
    <path
      d="M272.1 107.7c38.8-.6 76.3 14 104.4 40.8l77.7-77.7C405 24.6 339.7-.8 272.1 0 169.2 0 75.1 58 28.9 150l90.4 70.1c21.5-64.5 81.8-112.4 152.8-112.4z"
      fill="#ea4335"
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

const signupSchema = z
  .object({
    email: z.string().email({ message: 'Please enter a valid email.' }),
    password: z
      .string()
      .min(6, { message: 'Password must be at least 6 characters.' }),
    confirmPassword: z.string(),
    recaptcha: z.string().min(1, { message: 'Please complete the reCAPTCHA.' }),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords don't match",
    path: ['confirmPassword'],
  });

type SignupFormValues = z.infer<typeof signupSchema>;

export default function SignupPage() {
  const auth = useAuth();
  const { toast } = useToast();
  const router = useRouter();
  const [showPassword, setShowPassword] = useState(false);
  const recaptchaRef = useRef<ReCAPTCHA>(null);

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors, isSubmitting },
  } = useForm<SignupFormValues>({
    resolver: zodResolver(signupSchema),
    defaultValues: {
        email: '',
        password: '',
        confirmPassword: '',
        recaptcha: '',
    }
  });

  const onSubmit: SubmitHandler<SignupFormValues> = async (data) => {
    try {
      await createUserWithEmailAndPassword(auth, data.email, data.password);
      toast({
        title: 'Account Created!',
        description: 'You can now log in with your new account.',
      });
      router.push('/login');
    } catch (error: any) {
      console.error(error);
      recaptchaRef.current?.reset();
      setValue('recaptcha', '');
      toast({
        title: 'Sign Up Failed',
        description: error.message || 'An unexpected error occurred.',
        variant: 'destructive',
      });
    }
  };

  const handleMicrosoftSignIn = async () => {
    const provider = new OAuthProvider('microsoft.com');
    try {
      await signInWithPopup(auth, provider);
      toast({
        title: 'Account Created!',
        description: 'Welcome!',
      });
      router.push('/account');
    } catch (error: any) {
      console.error(error);
      toast({
        title: 'Sign Up Failed',
        description: error.message || 'Could not sign up with Microsoft.',
        variant: 'destructive',
      });
    }
  };

  const handleGoogleSignIn = async () => {
    const provider = new GoogleAuthProvider();
    try {
      await signInWithPopup(auth, provider);
      toast({
        title: 'Account Created!',
        description: 'Welcome!',
      });
      router.push('/account');
    } catch (error: any) {
      console.error(error);
      toast({
        title: 'Sign Up Failed',
        description: error.message || 'Could not sign up with Google.',
        variant: 'destructive',
      });
    }
  };

  const handleGitHubSignIn = async () => {
    const provider = new GithubAuthProvider();
    try {
      await signInWithPopup(auth, provider);
      toast({
        title: 'Account Created!',
        description: 'Welcome!',
      });
      router.push('/account');
    } catch (error: any) {
      console.error(error);
      toast({
        title: 'Sign Up Failed',
        description: error.message || 'Could not sign up with GitHub.',
        variant: 'destructive',
      });
    }
  };
  
  const siteKey = process.env.NEXT_PUBLIC_RECAPTCHA_SITE_KEY;

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
        <CardContent>
          <form onSubmit={handleSubmit(onSubmit)} className="grid gap-6">
            <div className="grid gap-4">
              <div className="grid gap-2">
                <Label htmlFor="email">Email Address</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="m@example.com"
                  {...register('email')}
                  className="bg-white text-black"
                />
                 {errors.email && <p className="text-destructive text-xs">{errors.email.message}</p>}
              </div>
              <div className="grid gap-2">
                <Label htmlFor="password">Password</Label>
                 <div className="relative">
                  <Input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    {...register('password')}
                    className="bg-white text-black pr-10"
                  />
                   <button
                    type="button"
                    onClick={() => setShowPassword((prev) => !prev)}
                    className="absolute inset-y-0 right-0 flex items-center pr-3 text-black"
                  >
                    {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                  </button>
                </div>
                {errors.password && <p className="text-destructive text-xs">{errors.password.message}</p>}
              </div>
              <div className="grid gap-2">
                <Label htmlFor="confirmPassword">Confirm Password</Label>
                <Input
                  id="confirmPassword"
                  type="password"
                  {...register('confirmPassword')}
                  className="bg-white text-black"
                />
                {errors.confirmPassword && <p className="text-destructive text-xs">{errors.confirmPassword.message}</p>}
              </div>

               {siteKey ? (
                <div className="grid gap-2">
                  <ReCAPTCHA
                    ref={recaptchaRef}
                    sitekey={siteKey}
                    onChange={(token) => setValue('recaptcha', token || '')}
                    theme="dark"
                  />
                  {errors.recaptcha && <p className="text-destructive text-xs">{errors.recaptcha.message}</p>}
                </div>
              ) : (
                 <p className="text-destructive text-xs">reCAPTCHA site key not configured.</p>
              )}


            </div>
            <Button type="submit" disabled={isSubmitting} className="w-full bg-white text-black hover:bg-gray-200">
              {isSubmitting ? 'Creating Account...' : 'Create account'} <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </form>

          <div className="flex items-center gap-4 mt-6">
            <Separator className="flex-1" />
            <span className="text-xs text-muted-foreground">
              OR CONTINUE WITH
            </span>
            <Separator className="flex-1" />
          </div>

          <div className="grid grid-cols-3 gap-3 mt-6">
            <Button variant="outline" className="gap-2" onClick={handleGoogleSignIn}>
              <GoogleIcon /> Google
            </Button>
            <Button variant="outline" className="gap-2" onClick={handleMicrosoftSignIn}>
              <MicrosoftIcon /> Microsoft
            </Button>
            <Button variant="outline" className="gap-2" onClick={handleGitHubSignIn}>
              <GitHubIcon /> GitHub
            </Button>
          </div>
        </CardContent>
        <CardFooter className="flex flex-col gap-4 text-center text-xs">
          <p className="text-muted-foreground">
            By creating an account, you agree to our{' '}
            <Link href="#" className="underline text-blue-500">
              Terms of Service
            </Link>{' '}
            and{' '}
            <Link href="#" className="underline text-blue-500">
              Privacy Policy
            </Link>
            .
          </p>
          <div className="text-sm text-muted-foreground">
            Already have an account?{' '}
            <Link href="/login" className="underline text-blue-500 font-semibold">
              Login
            </Link>
          </div>
        </CardFooter>
      </Card>
    </div>
  );
}
