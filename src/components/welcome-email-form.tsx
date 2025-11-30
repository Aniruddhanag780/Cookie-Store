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
    <Button type="submit" disabled={pending}>
      {pending ? 'Sending...' : 'Send Welcome Email'}
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
        title: 'Success!',
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
      className="flex max-w-md mx-auto items-center space-x-2"
    >
      <div className="relative flex-1">
         <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
        <Input
          type="email"
          name="email"
          placeholder="your.email@example.com"
          className="pl-10"
          required
        />
      </div>
      <SubmitButton />
    </form>
  );
}
