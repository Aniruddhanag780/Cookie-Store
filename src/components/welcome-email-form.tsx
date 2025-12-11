
'use client';

import { useRef } from 'react';
import { useForm, type SubmitHandler } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { Mail } from 'lucide-react';
import { useFirestore } from '@/firebase';
import { addDoc, collection, serverTimestamp } from 'firebase/firestore';

const emailSchema = z.object({
  email: z.string().email({ message: 'Please enter a valid email address.' }),
});

type EmailFormValues = z.infer<typeof emailSchema>;

export default function WelcomeEmailForm() {
  const { toast } = useToast();
  const firestore = useFirestore();
  const formRef = useRef<HTMLFormElement>(null);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset,
  } = useForm<EmailFormValues>({
    resolver: zodResolver(emailSchema),
  });

  const onSubmit: SubmitHandler<EmailFormValues> = async (data) => {
    if (!firestore) {
      toast({
        title: 'Error',
        description: 'Database not available. Please try again later.',
        variant: 'destructive',
      });
      return;
    }

    try {
      const subscriptionsCollection = collection(
        firestore,
        'newsletterSubscriptions'
      );
      await addDoc(subscriptionsCollection, {
        email: data.email,
        subscribedAt: serverTimestamp(),
      });

      toast({
        title: 'Subscribed!',
        description:
          'Thanks for subscribing! You are now on our mailing list.',
      });
      reset();
    } catch (error) {
      console.error('Error subscribing:', error);
      toast({
        title: 'Error',
        description: 'Could not subscribe. Please try again later.',
        variant: 'destructive',
      });
    }
  };

  return (
    <form
      ref={formRef}
      onSubmit={handleSubmit(onSubmit)}
      className="flex flex-col items-center space-y-4"
    >
      <div className="relative w-full">
        <Mail className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
        <Input
          type="email"
          {...register('email')}
          placeholder="Enter your email address"
          className="pl-12 h-12 rounded-full bg-card text-foreground placeholder:text-muted-foreground border-border"
        />
        {errors.email && (
          <p className="text-destructive text-xs mt-1 ml-4">
            {errors.email.message}
          </p>
        )}
      </div>
      <Button
        type="submit"
        disabled={isSubmitting}
        className="w-full bg-primary text-primary-foreground hover:bg-primary/90 rounded-full h-12 font-semibold"
      >
        {isSubmitting ? 'Subscribing...' : 'Subscribe'}
      </Button>
    </form>
  );
}
