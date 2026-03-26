'use server';
/**
 * @fileOverview An AI chatbot designed to clarify daily check-in questions or medication schedule details for elderly users.
 *
 * - clarifyElderlyTask - A function that handles the AI's clarification process.
 * - ElderlyTaskClarificationInput - The input type for the clarifyElderlyTask function.
 * - ElderlyTaskClarificationOutput - The return type for the clarifyElderlyTask function.
 */

import { ai } from '@/ai/genkit';
import { z } from 'genkit';

const ElderlyTaskClarificationInputSchema = z.object({
  query: z.string().describe("The elderly user's question regarding daily check-in questions or medication schedules."),
});
export type ElderlyTaskClarificationInput = z.infer<typeof ElderlyTaskClarificationInputSchema>;

const ElderlyTaskClarificationOutputSchema = z.object({
  clarification: z.string().describe("The AI's clear and helpful explanation or clarification."),
});
export type ElderlyTaskClarificationOutput = z.infer<typeof ElderlyTaskClarificationOutputSchema>;

export async function clarifyElderlyTask(input: ElderlyTaskClarificationInput): Promise<ElderlyTaskClarificationOutput> {
  return elderlyTaskClarificationFlow(input);
}

const prompt = ai.definePrompt({
  name: 'elderlyTaskClarificationPrompt',
  input: { schema: ElderlyTaskClarificationInputSchema },
  output: { schema: ElderlyTaskClarificationOutputSchema },
  prompt: `You are a kind, patient, and helpful AI assistant designed to support elderly users of the "Elderly Solutions Germany" application.
Your main goal is to clarify questions related to their daily health check-ins and medication schedules.
Please provide clear, concise, and easy-to-understand explanations. Avoid jargon and be empathetic.

User's question: "{{{query}}}"

Please provide a helpful clarification or explanation.`,
});

const elderlyTaskClarificationFlow = ai.defineFlow(
  {
    name: 'elderlyTaskClarificationFlow',
    inputSchema: ElderlyTaskClarificationInputSchema,
    outputSchema: ElderlyTaskClarificationOutputSchema,
  },
  async (input) => {
    const { output } = await prompt(input);
    return output!;
  }
);
