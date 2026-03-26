'use server';
/**
 * @fileOverview An AI Health Companion for caregivers to get personalized advice on elderly care.
 *
 * - caregiverAIHealthCompanion - A function that provides AI-powered advice to caregivers.
 * - CaregiverAIHealthCompanionInput - The input type for the caregiverAIHealthCompanion function.
 * - CaregiverAIHealthCompanionOutput - The return type for the caregiverAIHealthCompanion function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const CaregiverAIHealthCompanionInputSchema = z.object({
  question: z.string().describe('The caregiver\'s question regarding elderly conditions or daily care routines.'),
});
export type CaregiverAIHealthCompanionInput = z.infer<typeof CaregiverAIHealthCompanionInputSchema>;

const CaregiverAIHealthCompanionOutputSchema = z.object({
  advice: z.string().describe('Personalized and relevant advice for the caregiver.'),
});
export type CaregiverAIHealthCompanionOutput = z.infer<typeof CaregiverAIHealthCompanionOutputSchema>;

export async function caregiverAIHealthCompanion(input: CaregiverAIHealthCompanionInput): Promise<CaregiverAIHealthCompanionOutput> {
  return caregiverAIHealthCompanionFlow(input);
}

const caregiverAIHealthCompanionPrompt = ai.definePrompt({
  name: 'caregiverAIHealthCompanionPrompt',
  input: {schema: CaregiverAIHealthCompanionInputSchema},
  output: {schema: CaregiverAIHealthCompanionOutputSchema},
  prompt: `You are an AI Health Companion designed to assist caregivers in Germany. Your role is to provide relevant and personalized advice on managing common elderly conditions and daily care routines. Focus on practical, actionable insights, and ensure the advice is tailored to the context of elderly care.

Caregiver's Question: {{{question}}}

Please provide comprehensive advice, addressing all aspects of the caregiver's question.`,
});

const caregiverAIHealthCompanionFlow = ai.defineFlow(
  {
    name: 'caregiverAIHealthCompanionFlow',
    inputSchema: CaregiverAIHealthCompanionInputSchema,
    outputSchema: CaregiverAIHealthCompanionOutputSchema,
  },
  async input => {
    const {output} = await caregiverAIHealthCompanionPrompt(input);
    if (!output) {
      throw new Error('Failed to get advice from the AI Health Companion.');
    }
    return output;
  }
);
