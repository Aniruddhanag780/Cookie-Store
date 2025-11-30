'use server';
/**
 * @fileOverview An AI-powered product recommendation system.
 *
 * - recommendProducts - A function that recommends products based on user history.
 * - RecommendProductsInput - The input type for the recommendProducts function.
 * - RecommendProductsOutput - The return type for the recommendProducts function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const RecommendProductsInputSchema = z.object({
  browsingHistory: z
    .string()
    .describe('The user browsing history as a string of product names.'),
  purchaseHistory: z
    .string()
    .describe('The user purchase history as a string of product names.'),
});
export type RecommendProductsInput = z.infer<typeof RecommendProductsInputSchema>;

const RecommendProductsOutputSchema = z.object({
  recommendedProducts: z
    .string()
    .describe('A comma-separated list of recommended product names.'),
});
export type RecommendProductsOutput = z.infer<typeof RecommendProductsOutputSchema>;

export async function recommendProducts(input: RecommendProductsInput): Promise<RecommendProductsOutput> {
  return recommendProductsFlow(input);
}

const prompt = ai.definePrompt({
  name: 'recommendProductsPrompt',
  input: {schema: RecommendProductsInputSchema},
  output: {schema: RecommendProductsOutputSchema},
  prompt: `Based on the user's browsing history: {{{browsingHistory}}} and purchase history: {{{purchaseHistory}}}, recommend a list of products that the user might be interested in.  Return a comma-separated list of product names.`,
});

const recommendProductsFlow = ai.defineFlow(
  {
    name: 'recommendProductsFlow',
    inputSchema: RecommendProductsInputSchema,
    outputSchema: RecommendProductsOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
