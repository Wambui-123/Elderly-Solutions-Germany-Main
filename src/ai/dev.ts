'use server';
import { config } from 'dotenv';
config();

import '@/ai/flows/elderly-task-clarification-ai.ts';
import '@/ai/flows/caregiver-ai-health-companion.ts';
import '@/ai/flows/professional-patient-summary-ai.ts';
import '@/ai/flows/medication-identification-ai.ts';
import '@/ai/flows/text-to-speech-ai.ts';
import '@/ai/flows/knowledge-hub-ai.ts';
