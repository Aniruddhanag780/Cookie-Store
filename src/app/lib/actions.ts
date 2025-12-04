'use server';

import { recommendProducts } from '@/ai/flows/ai-product-recommendations';
import type { RecommendProductsInput } from '@/ai/flows/ai-product-recommendations';
import { products } from '@/lib/products';
import type { Product } from '@/lib/types';
import { z } from 'zod';
import nodemailer from 'nodemailer';

export async function getRecommendedProducts(
  input: RecommendProductsInput
): Promise<Product[]> {
  try {
    const { recommendedProducts } = await recommendProducts(input);
    const recommendedNames = recommendedProducts
      .split(',')
      .map((name) => name.trim().toLowerCase());

    // Filter the main product list to find matches
    const matchingProducts = products.filter((product) =>
      recommendedNames.includes(product.name.toLowerCase())
    );

    // To ensure we always return some products for the demo,
    // if AI returns no matches, return a few random ones.
    if (matchingProducts.length > 0) {
      return matchingProducts;
    } else {
      return [...products].sort(() => 0.5 - Math.random()).slice(0, 4);
    }
  } catch (error) {
    console.error('Error getting product recommendations:', error);
    // Fallback to random products on error
    return [...products].sort(() => 0.5 - Math.random()).slice(0, 4);
  }
}

const emailSchema = z.string().email({ message: 'Invalid email address.' });

const brevoTemplateBodies: Record<number, { subject: string; htmlContent: string }> = {
    5: {
      subject: 'Welcome to AnimEcom!',
      htmlContent: `
        <h1>Welcome to AnimEcom!</h1>
        <p>Thanks for signing up for our newsletter.</p>
        <p>You'll be the first to know about our latest offers and new futuristic apparel.</p>
      `,
    },
};

export async function sendWelcomeEmail(
  prevState: any,
  formData: FormData
): Promise<{ message: string; error?: string }> {
  const email = formData.get('email');

  const parsedEmail = emailSchema.safeParse(email);
  if (!parsedEmail.success) {
    return {
      message: '',
      error: parsedEmail.error.errors[0].message,
    };
  }

  const { SMTP_HOST, SMTP_PORT, SMTP_USER, SMTP_PASSWORD } = process.env;

  if (!SMTP_HOST || !SMTP_PORT || !SMTP_USER || !SMTP_PASSWORD) {
    console.error('SMTP environment variables are not set.');
    return {
      message: '',
      error: 'Email configuration error. Please contact support.',
    };
  }

  const transporter = nodemailer.createTransport({
    host: SMTP_HOST,
    port: parseInt(SMTP_PORT, 10),
    secure: parseInt(SMTP_PORT, 10) === 465, // true for 465, false for other ports
    auth: {
      user: SMTP_USER,
      pass: SMTP_PASSWORD,
    },
  });

  const templateId = 5;
  const templateBody = brevoTemplateBodies[templateId];

  if (!templateBody) {
      return {
          message: '',
          error: `Email template #${templateId} not found.`
      }
  }


  const mailOptions = {
    from: '"AnimEcom" <sender@example.com>',
    to: parsedEmail.data,
    subject: templateBody.subject,
    html: templateBody.htmlContent,
  };

  try {
    await transporter.sendMail(mailOptions);
    return {
      message: 'Welcome email sent successfully! Please check your inbox.',
    };
  } catch (error: any) {
    console.error('Error sending welcome email:', error.message);
    return {
      message: '',
      error: 'An unexpected error occurred. Please try again.',
    };
  }
}
