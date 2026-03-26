'use server';
/**
 * @fileOverview A Genkit flow for generating knowledge hub articles on given topics.
 *
 * - generateKnowledgeArticle - A function that generates an article.
 * - KnowledgeArticleInput - The input type for the function.
 * - KnowledgeArticleOutput - The return type for the function.
 */

import { ai } from '@/ai/genkit';
import { z } from 'genkit';

const KnowledgeArticleInputSchema = z.object({
  topic: z.string().describe('The topic for the article.'),
  language: z.string().optional().describe('The language for the AI response (e.g., "en", "de"). Default is "en".'),
});
export type KnowledgeArticleInput = z.infer<typeof KnowledgeArticleInputSchema>;

const KnowledgeArticleOutputSchema = z.object({
  title: z.string().describe('The title of the article.'),
  introduction: z.string().describe('A brief introduction to the topic.'),
  sections: z.array(z.object({
    heading: z.string().describe('The heading for a section of the article.'),
    content: z.string().describe('The content for that section.'),
  })).describe('The main sections of the article.'),
});
export type KnowledgeArticleOutput = z.infer<typeof KnowledgeArticleOutputSchema>;

export async function generateKnowledgeArticle(input: KnowledgeArticleInput): Promise<KnowledgeArticleOutput> {
  return knowledgeArticleFlow(input);
}

const prompt = ai.definePrompt({
  name: 'knowledgeArticlePrompt',
  input: { schema: KnowledgeArticleInputSchema },
  output: { schema: KnowledgeArticleOutputSchema },
  prompt: `You are an expert content creator for a health and wellness platform for the elderly.
  Your response must be in the language with this ISO 639-1 code: {{{language}}}.
  Generate an informative and easy-to-read article on the topic of '{{{topic}}}'.
  The article should have a clear title, a brief introduction, and at least three sections with distinct headings and detailed content.
  The content should be practical, empathetic, and encouraging.
  Structure the output as a JSON object matching the provided schema.`,
});

const knowledgeArticleFlow = ai.defineFlow(
  {
    name: 'knowledgeArticleFlow',
    inputSchema: KnowledgeArticleInputSchema,
    outputSchema: KnowledgeArticleOutputSchema,
  },
  async (input) => {
    const { output } = await prompt(input);
    if (!output) {
      throw new Error('Failed to generate knowledge article.');
    }
    return output;
  }
);
