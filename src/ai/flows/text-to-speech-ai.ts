'use server';
/**
 * @fileOverview A Genkit flow for converting text to speech.
 *
 * - textToSpeechAI - Converts a string of text into a WAV audio data URI.
 * - TextToSpeechAIInput - The input type for the textToSpeechAI function.
 * - TextToSpeechAIOutput - The return type for the textToSpeechAI function.
 */
import { ai } from '@/ai/genkit';
import { z } from 'genkit';
import wav from 'wav';

export const TextToSpeechAIInputSchema = z.string();
export type TextToSpeechAIInput = z.infer<typeof TextToSpeechAIInputSchema>;

export const TextToSpeechAIOutputSchema = z.object({
  media: z.string().describe('The audio data URI.'),
});
export type TextToSpeechAIOutput = z.infer<typeof TextToSpeechAIOutputSchema>;

async function toWav(
  pcmData: Buffer,
  channels = 1,
  rate = 24000,
  sampleWidth = 2
): Promise<string> {
  return new Promise((resolve, reject) => {
    const writer = new wav.Writer({
      channels,
      sampleRate: rate,
      bitDepth: sampleWidth * 8,
    });

    const bufs: any[] = [];
    writer.on('error', reject);
    writer.on('data', function (d) {
      bufs.push(d);
    });
    writer.on('end', function () {
      resolve(Buffer.concat(bufs).toString('base64'));
    });

    writer.write(pcmData);
    writer.end();
  });
}

const textToSpeechFlow = ai.defineFlow(
  {
    name: 'textToSpeechFlow',
    inputSchema: TextToSpeechAIInputSchema,
    outputSchema: TextToSpeechAIOutputSchema,
  },
  async (query) => {
    const { media } = await ai.generate({
      model: 'googleai/gemini-2.5-flash-preview-tts',
      config: {
        responseModalities: ['AUDIO'],
        speechConfig: {
          voiceConfig: {
            prebuiltVoiceConfig: { voiceName: 'Algenib' },
          },
        },
      },
      prompt: query,
    });

    if (!media) {
      throw new Error('No media returned from TTS model');
    }

    const audioBuffer = Buffer.from(
      media.url.substring(media.url.indexOf(',') + 1),
      'base64'
    );
    
    return {
      media: 'data:audio/wav;base64,' + await toWav(audioBuffer),
    };
  }
);


export async function textToSpeechAI(input: TextToSpeechAIInput): Promise<TextToSpeechAIOutput> {
  return textToSpeechFlow(input);
}
