
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
  {
    question: 'How fresh are the snacks I receive?',
    answer:
      'Our snacks are made fresh to order in small batches, ensuring you receive the highest quality and freshest product possible.',
  },
  {
    question: 'What is the shelf life of Crunch Bites products?',
    answer:
      "Since we don't use preservatives, our products have a shelf life of 30 days. This ensures you enjoy the freshest, most natural snacks possible.",
  },
  {
    question: 'Do you offer international shipping?',
    answer:
      'Currently, we offer shipping across India. We are working on expanding our reach and plan to offer international shipping soon.',
  },
  {
    question: 'How can I contact you if I have more questions?',
    answer:
      'Feel free to click on the "Chat" button at the bottom right of our website for live assistance. We\'re always happy to help!',
  },
  {
    question: 'Are there any discounts for bulk orders?',
    answer:
      'Yes, we offer discounts for bulk orders. Please contact our customer service team for more information on bulk pricing and discounts.',
  },
  {
    question: 'Do you offer any subscription services?',
    answer:
      'Yes! Browse items in the Ultimate Crunch Boxes category. Below the description, you\'ll find the "Subscribe & Save" option, allowing you to get your monthly box delivered straight to your doorstep, available PAN India!',
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
