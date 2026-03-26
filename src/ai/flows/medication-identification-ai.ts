'use server';
/**
 * @fileOverview An AI agent for identifying medication from an image.
 *
 * - medicationIdentifierAI - A function that handles the medication identification process.
 * - MedicationIdentifierAIInput - The input type for the medicationIdentifierAI function.
 * - MedicationIdentifierAIOutput - The return type for the medicationIdentifierAI function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const MedicationIdentifierAIInputSchema = z.object({
  photoDataUri: z
    .string()
    .describe(
      "A photo of a pill or medication, as a data URI that must include a MIME type and use Base64 encoding. Expected format: 'data:<mimetype>;base64,<encoded_data>'."
    ),
  question: z.string().optional().describe('An optional question from the user about the medication.'),
});
export type MedicationIdentifierAIInput = z.infer<typeof MedicationIdentifierAIInputSchema>;

const MedicationIdentifierAIOutputSchema = z.object({
  identification: z.string().describe("The AI's identification of the medication, including a disclaimer."),
});
export type MedicationIdentifierAIOutput = z.infer<typeof MedicationIdentifierAIOutputSchema>;

export async function medicationIdentifierAI(input: MedicationIdentifierAIInput): Promise<MedicationIdentifierAIOutput> {
  return medicationIdentifierAIFlow(input);
}

const prompt = ai.definePrompt({
  name: 'medicationIdentifierAIPrompt',
  input: {schema: MedicationIdentifierAIInputSchema},
  output: {schema: MedicationIdentifierAIOutputSchema},
  prompt: `You are an AI assistant helping a user identify medication from a photo. Your task is to analyze the image and provide information about the likely medication shown.

IMPORTANT: You must include the following disclaimer at the beginning of your response, enclosed in a markdown block quote:
> **Disclaimer:** I am an AI assistant. This information is for identification purposes only and is not a substitute for professional medical advice. Always consult with a qualified healthcare provider or pharmacist before taking any medication.

User's question: "{{{question}}}"

Photo of the medication:
{{media url=photoDataUri}}

Please provide your identification of the medication below the disclaimer.`,
});

const medicationIdentifierAIFlow = ai.defineFlow(
  {
    name: 'medicationIdentifierAIFlow',
    inputSchema: MedicationIdentifierAIInputSchema,
    outputSchema: MedicationIdentifierAIOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
