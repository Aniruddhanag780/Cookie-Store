
'use client';

import { useActionState, useEffect, useRef } from 'react';
import { useFormStatus } from 'react-dom';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { sendWelcomeEmail } from '@/app/lib/actions';
import { useToast } from '@/hooks/use-toast';
import { Mail } from 'lucide-react';

const initialState = {
  message: '',
  error: '',
};

function SubmitButton() {
  const { pending } = useFormStatus();
  return (
    <Button type="submit" disabled={pending} className="w-full bg-primary text-primary-foreground hover:bg-primary/90 rounded-full h-12 font-semibold">
      {pending ? 'Subscribing...' : 'Subscribe'}
    </Button>
  );
}

export default function WelcomeEmailForm() {
  const [state, formAction] = useActionState(sendWelcomeEmail, initialState);
  const { toast } = useToast();
  const formRef = useRef<HTMLFormElement>(null);

  useEffect(() => {
    if (state.message) {
      toast({
        title: 'Subscribed!',
        description: state.message,
      });
      formRef.current?.reset();
    }
    if (state.error) {
      toast({
        title: 'Error',
        description: state.error,
        variant: 'destructive',
      });
    }
  }, [state, toast]);

  return (
    <form
      ref={formRef}
      action={formAction}
      className="flex flex-col items-center space-y-4"
    >
      <div className="relative w-full">
         <Mail className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
        <Input
          type="email"
          name="email"
          placeholder="Enter your email address"
          className="pl-12 h-12 rounded-full bg-card text-foreground placeholder:text-muted-foreground border-border"
          required
        />
      </div>
      <SubmitButton />
    </form>
  );
}
