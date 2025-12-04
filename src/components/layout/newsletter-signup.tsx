import WelcomeEmailForm from '@/components/welcome-email-form';

export default function NewsletterSignup() {
  return (
    <section className="py-12" style={{ backgroundColor: '#1E1E1E' }}>
      <div className="container mx-auto px-4">
        <div className="flex flex-col md:flex-row items-center justify-between gap-8">
          <h2 className="text-3xl md:text-4xl font-bold font-headline text-primary-foreground max-w-sm leading-tight">
            STAY UPTO DATE ABOUT OUR LATEST OFFERS
          </h2>
          <div className="w-full md:max-w-md">
            <WelcomeEmailForm />
          </div>
        </div>
      </div>
    </section>
  );
}
