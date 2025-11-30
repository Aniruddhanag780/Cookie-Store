'use server';

import { recommendProducts } from '@/ai/flows/ai-product-recommendations';
import type { RecommendProductsInput } from '@/ai/flows/ai-product-recommendations';
import { products } from '@/lib/products';
import type { Product } from '@/lib/types';
import { z } from 'zod';

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

  const apiKey = process.env.BREVO_API_KEY;
  if (!apiKey) {
    console.error('Brevo API key is not set.');
    return {
      message: '',
      error: 'Email configuration error. Please contact support.',
    };
  }

  try {
    const response = await fetch('https://api.brevo.com/v3/smtp/email', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'api-key': apiKey,
      },
      body: JSON.stringify({
        sender: { email: 'noreply@animecom.com', name: 'AnimEcom' },
        to: [{ email: parsedEmail.data }],
        subject: 'Welcome to AnimEcom!',
        htmlContent: `
          <html>
            <body>
              <h1>Welcome to AnimEcom!</h1>
              <p>Thank you for joining the future of fashion. We're excited to have you with us.</p>
              <p>Explore our latest collection and define your aesthetic.</p>
            </body>
          </html>
        `,
      }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      console.error('Failed to send email:', errorData);
      return {
        message: '',
        error: 'Failed to send email. Please try again later.',
      };
    }

    return {
      message: 'Welcome email sent successfully! Please check your inbox.',
    };
  } catch (error) {
    console.error('Error sending welcome email:', error);
    return {
      message: '',
      error: 'An unexpected error occurred. Please try again.',
    };
  }
}
