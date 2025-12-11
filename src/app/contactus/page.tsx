
'use client';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/hooks/use-toast';
import { Mail, User, MessageSquare, Phone, Building, LinkIcon } from 'lucide-react';
import { useFirestore } from '@/firebase';
import { addDoc, collection, serverTimestamp } from 'firebase/firestore';

const contactFormSchema = z.object({
  name: z.string().min(2, 'Please enter your full name.'),
  email: z.string().email('Please enter a valid email address.'),
  message: z.string().min(10, 'Message must be at least 10 characters.'),
});

type ContactFormValues = z.infer<typeof contactFormSchema>;

export default function ContactPage() {
  const { toast } = useToast();
  const firestore = useFirestore();

  const form = useForm<ContactFormValues>({
    resolver: zodResolver(contactFormSchema),
    defaultValues: {
      name: '',
      email: '',
      message: '',
    },
  });

  const onSubmit = async (data: ContactFormValues) => {
    if (!firestore) {
      toast({
        title: 'Error',
        description: 'Database not available. Please try again later.',
        variant: 'destructive',
      });
      return;
    }
    try {
      const contactsCollection = collection(firestore, 'contacts');
      await addDoc(contactsCollection, {
        ...data,
        submittedAt: serverTimestamp(),
      });

      toast({
        title: 'Message Sent!',
        description: "Thank you for contacting us. We'll get back to you soon.",
      });
      form.reset();
    } catch (error) {
      console.error('Error sending message:', error);
      toast({
        title: 'Error',
        description: 'Could not send your message. Please try again later.',
        variant: 'destructive',
      });
    }
  };

  const InfoRow = ({ label, children }: { label: string; children: React.ReactNode }) => (
    <div className="flex flex-col sm:flex-row sm:items-start">
      <p className="w-full sm:w-1/3 font-semibold text-foreground">{label}:</p>
      <div className="w-full sm:w-2/3 text-muted-foreground">{children}</div>
    </div>
  );


  return (
    <div className="container mx-auto px-4 py-8 md:py-12">
      <div className="max-w-3xl mx-auto space-y-8">
        <Card className="shadow-lg">
          <CardHeader>
            <CardTitle className="text-3xl md:text-4xl font-bold font-headline text-center">
              Contact Information
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <InfoRow label="Trade Name">Vishla Foods Private Limited</InfoRow>
            <InfoRow label="Brand Name">Crunch Bites</InfoRow>
            <InfoRow label="Contact Number">
              <a href="tel:+916296731835" className="hover:text-primary">+91 6296731835</a>
            </InfoRow>
            <InfoRow label="WhatsApp">
              <a href="https://wa.me/916296731835" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">Click Here to Message Us</a>
            </InfoRow>
            <InfoRow label="Email">
               <a href="mailto:inbox.lyra@gmail.com" className="text-primary hover:underline">inbox.lyra@gmail.com</a>
            </InfoRow>
            <InfoRow label="Physical Address">
              Vishla Foods Private Limited, 11-10-89, Shop No. 3, Sunline Residency Building, Road No. 3, SBI Colony, Kothapet, 500035 Hyderabad TS, India
            </InfoRow>
            <InfoRow label="GSTIN">36AAKCV3043R1ZO</InfoRow>
            <InfoRow label="FSSAI License">13624034000762</InfoRow>
          </CardContent>
        </Card>

        <Card className="shadow-lg">
          <CardHeader className="text-center">
            <CardTitle className="text-3xl md:text-4xl font-bold font-headline">
              Send us a Message
            </CardTitle>
            <CardDescription>
              Have a question or feedback? Drop us a line below!
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Form {...form}>
              <form
                onSubmit={form.handleSubmit(onSubmit)}
                className="space-y-6"
              >
                <FormField
                  control={form.control}
                  name="name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="flex items-center gap-2">
                        <User className="h-4 w-4" /> Full Name
                      </FormLabel>
                      <FormControl>
                        <Input placeholder="Jane Doe" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="flex items-center gap-2">
                        <Mail className="h-4 w-4" /> Email Address
                      </FormLabel>
                      <FormControl>
                        <Input
                          type="email"
                          placeholder="jane.doe@example.com"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="message"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="flex items-center gap-2">
                        <MessageSquare className="h-4 w-4" /> Message
                      </FormLabel>
                      <FormControl>
                        <Textarea
                          placeholder="Your message..."
                          rows={6}
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <Button
                  type="submit"
                  className="w-full"
                  size="lg"
                  disabled={form.formState.isSubmitting}
                >
                  {form.formState.isSubmitting ? 'Sending...' : 'Send Message'}
                </Button>
              </form>
            </Form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
