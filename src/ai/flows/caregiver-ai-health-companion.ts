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
  language: z.string().optional().describe('The language for the AI response (e.g., "en", "de"). Default is "en".'),
});
export type CaregiverAIHealthCompanionInput = z.infer<typeof CaregiverAIHealthCompanionInputSchema>;

const CaregiverAIHealthCompanionOutputSchema = z.object({
  advice: z.string().describe('Personalized and relevant advice for the caregiver.'),
  isEmergency: z.boolean().optional().describe('Set to true if the query describes a potential medical emergency.'),
});
export type CaregiverAIHealthCompanionOutput = z.infer<typeof CaregiverAIHealthCompanionOutputSchema>;

export async function caregiverAIHealthCompanion(input: CaregiverAIHealthCompanionInput): Promise<CaregiverAIHealthCompanionOutput> {
  return caregiverAIHealthCompanionFlow(input);
}

const caregiverAIHealthCompanionPrompt = ai.definePrompt({
  name: 'caregiverAIHealthCompanionPrompt',
  input: {schema: CaregiverAIHealthCompanionInputSchema},
  output: {schema: CaregiverAIHealthCompanionOutputSchema},
  prompt: `You are an AI Health Companion designed to assist caregivers. Your role is to provide relevant and personalized advice on managing common elderly conditions and daily care routines.
Your response must be in the language with this ISO 639-1 code: {{{language}}}.

IMPORTANT: If the user's question describes a potential medical emergency (e.g., "my father fell and can't get up", "chest pain", "difficulty breathing", "unconscious"), you MUST set the "isEmergency" flag to true and your advice should be to call emergency services immediately. For all other questions, provide practical, actionable insights.

Caregiver's Question: {{{question}}}

Please analyze the question and provide your response.`,
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
