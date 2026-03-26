"use client";

import { useRef, useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { SendHorizonal, Bot, User, Loader2, Paperclip, X, AlertTriangle } from 'lucide-react';
import Image from 'next/image';

import { caregiverAIHealthCompanion } from '@/ai/flows/caregiver-ai-health-companion';
import { clarifyElderlyTask } from '@/ai/flows/elderly-task-clarification-ai';
import { professionalPatientSummaryAI } from '@/ai/flows/professional-patient-summary-ai';
import { medicationIdentifierAI } from '@/ai/flows/medication-identification-ai';

import type { Role } from '@/lib/types';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Form, FormControl, FormField, FormItem } from '@/components/ui/form';
import { Alert, AlertDescription, AlertTitle } from '../ui/alert';

type Message = {
  sender: 'user' | 'ai';
  text: string | React.ReactNode;
};

const chatSchema = z.object({
  prompt: z.string().min(1, 'Message cannot be empty'),
});

type ChatFormValues = z.infer<typeof chatSchema>;

type AIChatClientProps = {
  role: Role;
  userAvatar: string;
};

const roleConfig = {
    elderly: {
        title: "Daily Assistant",
        placeholder: "Ask about your schedule or tasks...",
        action: clarifyElderlyTask,
    },
    caregiver: {
        title: "Care Companion",
        placeholder: "Ask for advice on elderly care...",
        action: caregiverAIHealthCompanion,
    },
    professional: {
        title: "Patient Summary AI",
        placeholder: "Enter patient logs for summarization...",
        action: professionalPatientSummaryAI,
    },
    admin: {
        title: "Admin Assistant",
        placeholder: "Admin queries...",
        action: async (input: { query: string }) => ({ clarification: `Admin functionality for "${input.query}" is not yet implemented.` }),
    }
}

const fileToDataUri = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = () => resolve(reader.result as string);
        reader.onerror = reject;
        reader.readAsDataURL(file);
    });
}


export function AIChatClient({ role, userAvatar }: AIChatClientProps) {
  const [messages, setMessages] = useState<Message[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const config = roleConfig[role];

  const form = useForm<ChatFormValues>({
    resolver: zodResolver(chatSchema),
    defaultValues: { prompt: '' },
  });

  const handleImageChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (file) {
            setImageFile(file);
            const reader = new FileReader();
            reader.onloadend = () => {
                setImagePreview(reader.result as string);
            };
            reader.readAsDataURL(file);
        }
    };

  const handleSendMessage = async (data: ChatFormValues) => {
    setIsLoading(true);
    let userMessageText: React.ReactNode = data.prompt;

    // If there's an image, create a combined message
    if (imagePreview) {
        userMessageText = (
            <div className="space-y-2">
                <Image src={imagePreview} alt="Uploaded preview" width={100} height={100} className="rounded-md" />
                <p>{data.prompt}</p>
            </div>
        )
    }

    const userMessage: Message = { sender: 'user', text: userMessageText };
    setMessages((prev) => [...prev, userMessage]);
    form.reset();
    setImageFile(null);
    setImagePreview(null);

    try {
        let aiResponseText: string | React.ReactNode = "Sorry, I couldn't get a response.";

        if (imageFile) {
            // Handle medication identification with image
            const dataUri = await fileToDataUri(imageFile);
            const result = await medicationIdentifierAI({ photoDataUri: dataUri, question: data.prompt });
            aiResponseText = result.identification;

        } else if (role === 'professional') {
            const result = await professionalPatientSummaryAI({ patientName: 'Patient X', healthLogs: data.prompt.split('\n') });
            aiResponseText = (
              <div>
                <p><strong>Summary:</strong> {result.summary}</p>
                {result.concerns && result.concerns.length > 0 && 
                  <>
                    <p className="mt-2"><strong>Concerns:</strong></p>
                    <ul className="list-disc pl-5">{result.concerns.map((c, i) => <li key={i}>{c}</li>)}</ul>
                  </>
                }
                {result.highlights && result.highlights.length > 0 &&
                  <>
                    <p className="mt-2"><strong>Highlights:</strong></p>
                    <ul className="list-disc pl-5">{result.highlights.map((h, i) => <li key={i}>{h}</li>)}</ul>
                  </>
                }
              </div>
            );
        } else {
          // Handle regular text-based queries
          const result = await config.action(role === 'caregiver' ? { question: data.prompt } : { query: data.prompt }) as any;
          
          if (result.isEmergency) {
             aiResponseText = (
                <Alert variant="destructive">
                    <AlertTriangle className="h-4 w-4" />
                    <AlertTitle>Potential Emergency Detected</AlertTitle>
                    <AlertDescription className="space-y-4">
                        <p>{result.advice}</p>
                        <Button asChild>
                            <a href="tel:112">
                                Call Emergency Services (112)
                            </a>
                        </Button>
                    </AlertDescription>
                </Alert>
             )
          } else {
             aiResponseText = result.advice || result.clarification;
          }
        }

        const aiMessage: Message = { sender: 'ai', text: aiResponseText };
        setMessages((prev) => [...prev, aiMessage]);
    } catch (error) {
        console.error("AI action failed:", error);
        const errorMessage: Message = { sender: 'ai', text: 'An error occurred. Please try again.' };
        setMessages((prev) => [...prev, errorMessage]);
    } finally {
        setIsLoading(false);
    }
  };

  return (
    <Card className="flex h-full flex-col">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
            <Bot />
            {config.title}
        </CardTitle>
      </CardHeader>
      <CardContent className="flex-grow overflow-hidden">
        <ScrollArea className="h-[50vh] pr-4">
          <div className="space-y-4">
            {messages.map((message, index) => (
              <div
                key={index}
                className={`flex items-start gap-3 ${
                  message.sender === 'user' ? 'justify-end' : ''
                }`}
              >
                {message.sender === 'ai' && (
                  <Avatar className="h-8 w-8">
                    <AvatarFallback><Bot size={20}/></AvatarFallback>
                  </Avatar>
                )}
                <div
                  className={`max-w-xs rounded-lg p-3 text-sm lg:max-w-md ${
                    message.sender === 'user'
                      ? 'bg-primary text-primary-foreground'
                      : 'bg-muted'
                  }`}
                >
                  {message.text}
                </div>
                {message.sender === 'user' && (
                  <Avatar className="h-8 w-8">
                    <AvatarImage src={userAvatar} />
                    <AvatarFallback><User size={20}/></AvatarFallback>
                  </Avatar>
                )}
              </div>
            ))}
            {isLoading && (
              <div className="flex items-start gap-3">
                 <Avatar className="h-8 w-8">
                    <AvatarFallback><Bot size={20}/></AvatarFallback>
                  </Avatar>
                <div className="max-w-xs rounded-lg bg-muted p-3 text-sm lg:max-w-md">
                    <Loader2 className="h-5 w-5 animate-spin" />
                </div>
              </div>
            )}
          </div>
        </ScrollArea>
      </CardContent>
      <CardFooter className="flex flex-col items-start gap-2">
         {imagePreview && (
            <div className="relative">
                <Image src={imagePreview} alt="upload preview" width={60} height={60} className="rounded-md"/>
                <Button variant="destructive" size="icon" className="absolute -top-2 -right-2 h-6 w-6 rounded-full" onClick={() => {setImageFile(null); setImagePreview(null)}}>
                    <X className="h-4 w-4" />
                </Button>
            </div>
         )}
        <Form {...form}>
            <form onSubmit={form.handleSubmit(handleSendMessage)} className="flex w-full items-start gap-2">
                <input type="file" accept="image/*" ref={fileInputRef} onChange={handleImageChange} className="hidden" />
                 <Button type="button" variant="ghost" size="icon" onClick={() => fileInputRef.current?.click()}>
                    <Paperclip className="h-5 w-5" />
                </Button>
                <FormField
                control={form.control}
                name="prompt"
                render={({ field }) => (
                    <FormItem className="flex-grow">
                    <FormControl>
                        <Textarea
                        placeholder={config.placeholder}
                        className="resize-none"
                        {...field}
                        onKeyDown={(e) => {
                            if (e.key === 'Enter' && !e.shiftKey) {
                            e.preventDefault();
                            form.handleSubmit(handleSendMessage)();
                            }
                        }}
                        />
                    </FormControl>
                    </FormItem>
                )}
                />
                <Button type="submit" size="icon" disabled={isLoading}>
                <SendHorizonal className="h-4 w-4" />
                </Button>
            </form>
        </Form>
      </CardFooter>
    </Card>
  );
}
