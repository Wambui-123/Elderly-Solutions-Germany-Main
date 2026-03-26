"use client";

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { SendHorizonal, Bot, User, Loader2 } from 'lucide-react';

import { caregiverAIHealthCompanion } from '@/ai/flows/caregiver-ai-health-companion';
import { elderlyTaskClarification } from '@/ai/flows/elderly-task-clarification-ai';
import { professionalPatientSummaryAI } from '@/ai/flows/professional-patient-summary-ai';

import type { Role } from '@/lib/types';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Form, FormControl, FormField, FormItem } from '@/components/ui/form';

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
        action: elderlyTaskClarification,
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

export function AIChatClient({ role, userAvatar }: AIChatClientProps) {
  const [messages, setMessages] = useState<Message[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const config = roleConfig[role];

  const form = useForm<ChatFormValues>({
    resolver: zodResolver(chatSchema),
    defaultValues: { prompt: '' },
  });

  const handleSendMessage = async (data: ChatFormValues) => {
    setIsLoading(true);
    const userMessage: Message = { sender: 'user', text: data.prompt };
    setMessages((prev) => [...prev, userMessage]);
    form.reset();

    try {
        let aiResponseText: string | React.ReactNode = "Sorry, I couldn't get a response.";
        if (role === 'professional') {
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
          const result = await config.action(role === 'caregiver' ? { question: data.prompt } : { query: data.prompt });
          aiResponseText = (result as any).advice || (result as any).clarification;
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
      <CardFooter>
        <Form {...form}>
            <form onSubmit={form.handleSubmit(handleSendMessage)} className="flex w-full items-start gap-2">
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
