'use server';
/**
 * @fileOverview A Genkit flow for summarizing a patient's recent health logs and highlighting concerns for medical professionals.
 *
 * - professionalPatientSummaryAI - A function that generates a summary of patient health logs.
 * - ProfessionalPatientSummaryAIInput - The input type for the professionalPatientSummaryAI function.
 * - ProfessionalPatientSummaryAIOutput - The return type for the professionalPatientSummaryAI function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

// Input Schema
const ProfessionalPatientSummaryAIInputSchema = z.object({
  patientName: z.string().describe("The name of the patient."),
  healthLogs: z.array(z.string()).describe("A list of recent health log entries for the patient. Each entry should be a concise summary of a health event or measurement, including date/time, type of log (e.g., vital, medication, general note), and the value/details."),
});
export type ProfessionalPatientSummaryAIInput = z.infer<typeof ProfessionalPatientSummaryAIInputSchema>;

// Output Schema
const ProfessionalPatientSummaryAIOutputSchema = z.object({
  summary: z.string().describe("A concise summary of the patient's overall health status based on the provided logs."),
  concerns: z.array(z.string()).optional().describe("A list of potential concerns or significant changes identified from the health logs."),
  highlights: z.array(z.string()).optional().describe("A list of key positive or stable points from the health logs."),
});
export type ProfessionalPatientSummaryAIOutput = z.infer<typeof ProfessionalPatientSummaryAIOutputSchema>;

// Prompt Definition
const professionalPatientSummaryPrompt = ai.definePrompt({
  name: 'professionalPatientSummaryPrompt',
  input: {schema: ProfessionalPatientSummaryAIInputSchema},
  output: {schema: ProfessionalPatientSummaryAIOutputSchema},
  prompt: `You are an AI assistant specialized in summarizing patient health records for medical professionals. Your goal is to provide a concise overview of a patient's recent health status, highlighting any significant changes or potential concerns.

Patient Name: {{{patientName}}}

Recent Health Logs:
{{#each healthLogs}}
- {{{this}}}
{{/each}}

Please analyze the provided health logs and generate:
1. A brief summary of the patient's overall health status.
2. A list of any significant changes observed in the logs (e.g., changes in vital signs, medication adherence, new symptoms).
3. A list of any potential concerns or red flags that a medical professional should be aware of.
4. A list of any positive or stable highlights.

Structure your response as a JSON object matching the provided schema, ensuring all fields are populated as accurately as possible. If there are no concerns or highlights, provide an empty array for those fields.`,
});

// Flow Definition
const professionalPatientSummaryAIFlow = ai.defineFlow(
  {
    name: 'professionalPatientSummaryAIFlow',
    inputSchema: ProfessionalPatientSummaryAIInputSchema,
    outputSchema: ProfessionalPatientSummaryAIOutputSchema,
  },
  async (input) => {
    const {output} = await professionalPatientSummaryPrompt(input);
    return output!;
  }
);

// Wrapper function
export async function professionalPatientSummaryAI(
  input: ProfessionalPatientSummaryAIInput
): Promise<ProfessionalPatientSummaryAIOutput> {
  return professionalPatientSummaryAIFlow(input);
}
