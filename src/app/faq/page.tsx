
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';
import { Box } from 'lucide-react';

const faqItems = [
  {
    question: 'How long will it take for my order to be delivered?',
    answer:
      'Once your order is picked up by the shipping company from us, delivery to Metro Cities take 2-5 days and for Non Metro Cities 3-6 days.',
  },
  {
    question: 'What are the available pack sizes?',
    answer:
      'Most of our products come in 200-gram packs, except for Cornflakes, which is only available in 150-gram packs.',
  },
];

export default function FaqPage() {
  return (
    <div className="container mx-auto max-w-3xl px-4 py-8 md:py-12">
      <div className="text-center mb-12">
        <p className="text-sm font-semibold uppercase tracking-wider text-muted-foreground">FAQ'S</p>
        <h1 className="text-4xl md:text-5xl font-bold font-headline mt-2">
          Frequently Asked Questions
        </h1>
      </div>

      <Accordion type="single" collapsible className="w-full space-y-4">
        {faqItems.map((item, index) => (
          <AccordionItem key={index} value={`item-${index}`} className="border-b-2 pb-4">
            <AccordionTrigger className="text-left text-xl md:text-2xl font-semibold hover:no-underline">
              <div className="flex items-start gap-4">
                <Box className="h-8 w-8 text-primary mt-1 flex-shrink-0" />
                <span>{item.question}</span>
              </div>
            </AccordionTrigger>
            <AccordionContent className="pt-2 text-base text-muted-foreground pl-12">
              {item.answer}
            </AccordionContent>
          </AccordionItem>
        ))}
      </Accordion>
    </div>
  );
}
