
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
