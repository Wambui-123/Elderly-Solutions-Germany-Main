
"use client";

import { useEffect, useRef, useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { SendHorizonal, Bot, User, Loader2, Paperclip, X, AlertTriangle, Mic, MicOff, Volume2, Phone } from 'lucide-react';
import Image from 'next/image';

import { caregiverAIHealthCompanion } from '@/ai/flows/caregiver-ai-health-companion';
import { clarifyElderlyTask } from '@/ai/flows/elderly-task-clarification-ai';
import { professionalPatientSummaryAI } from '@/ai/flows/professional-patient-summary-ai';
import { medicationIdentifierAI } from '@/ai/flows/medication-identification-ai';
import { textToSpeechAI } from '@/ai/flows/text-to-speech-ai';

import type { Role } from '@/lib/types';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Form, FormControl, FormField, FormItem } from '@/components/ui/form';
import { Alert, AlertDescription, AlertTitle } from '../ui/alert';
import { Separator } from '../ui/separator';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"
import { DialogTitle as ShadcnDialogTitle } from '../ui/dialog';

type Message = {
  id: string;
  sender: 'user' | 'ai';
  content: string | React.ReactNode;
  textContent: string; // Keep raw text for TTS
};

const chatSchema = z.object({
  prompt: z.string().min(1, 'Message cannot be empty'),
});

type ChatFormValues = z.infer<typeof chatSchema>;

type AIChatClientProps = {
  role: Role;
  userAvatar: string;
  isPopup?: boolean;
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
};

const suggestedPrompts: Record<Role, { title: string; prompt: string; }[]> = {
  elderly: [
    { title: "My schedule?", prompt: "What is on my schedule for today?" },
    { title: "Medication time?", prompt: "When do I take my next medication?" },
    { title: "Explain my task", prompt: "Can you explain my first task for today?" },
    { title: "Fun fact?", prompt: "Tell me a fun fact." },
  ],
  caregiver: [
    { title: "Fall prevention", prompt: "What are some tips for fall prevention?" },
    { title: "Medication reminder", prompt: "How can I best remind my loved one to take their medication?" },
    { title: "Signs of dehydration", prompt: "What are the common signs of dehydration in the elderly?" },
    { title: "Handle sundowning", prompt: "What are some strategies to handle sundowning in dementia patients?" },
  ],
  professional: [
    { title: "Summarize vitals", prompt: "Summarize the patient's vitals for the last 24 hours." },
    { title: "Identify risks", prompt: "Based on the recent logs, are there any immediate risks I should be aware of?" },
    { title: "Drug interaction", prompt: "Check for drug interactions between Warfarin and Ibuprofen." },
  ],
  admin: [
    { title: "System status", prompt: "What is the current system status?" },
  ],
};


const fileToDataUri = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = () => resolve(reader.result as string);
        reader.onerror = reject;
        reader.readAsDataURL(file);
    });
}


export function AIChatClient({ role, userAvatar, isPopup = false }: AIChatClientProps) {
  const [messages, setMessages] = useState<Message[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [imageFile, setImageFile] = useState<File | null>(null);
  
  const [audioUrl, setAudioUrl] = useState<string | null>(null);
  const [activeAudioId, setActiveAudioId] = useState<string | null>(null);
  const [isListening, setIsListening] = useState(false);
  
  const fileInputRef = useRef<HTMLInputElement>(null);
  const audioRef = useRef<HTMLAudioElement>(null);
  const recognitionRef = useRef<any>(null);

  const config = roleConfig[role];

  const form = useForm<ChatFormValues>({
    resolver: zodResolver(chatSchema),
    defaultValues: { prompt: '' },
  });

  useEffect(() => {
    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (SpeechRecognition) {
      const recognition = new SpeechRecognition();
      recognition.continuous = false;
      recognition.interimResults = false;
      recognition.lang = 'en-US';

      recognition.onresult = (event: any) => {
        const transcript = event.results[0][0].transcript;
        form.setValue('prompt', transcript);
        setIsListening(false);
      };

      recognition.onerror = (event: any) => {
        console.error('Speech recognition error', event.error);
        setIsListening(false);
      };
      
      recognition.onend = () => {
         setIsListening(false);
      };

      recognitionRef.current = recognition;
    }
  }, [form]);
  
  useEffect(() => {
    if (audioUrl && audioRef.current) {
        audioRef.current.src = audioUrl;
        audioRef.current.play().catch(e => console.error("Audio play failed", e));
    }
  }, [audioUrl]);

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
    
  const handleListen = () => {
    if (!recognitionRef.current) {
        alert("Speech recognition is not supported in your browser.");
        return;
    }
    if (isListening) {
      recognitionRef.current?.stop();
      setIsListening(false);
    } else {
      recognitionRef.current?.start();
      setIsListening(true);
    }
  };

  const handleSuggestedPrompt = (prompt: string) => {
    form.setValue('prompt', prompt);
    form.handleSubmit(handleSendMessage)();
  };
  
  const handlePlayAudio = async (message: Message) => {
    if (activeAudioId === message.id) {
        if(audioRef.current) {
          audioRef.current.pause();
          audioRef.current.currentTime = 0;
        }
        setActiveAudioId(null);
        return;
    }
    setActiveAudioId(message.id); // Show loading spinner
    try {
        const result = await textToSpeechAI(message.textContent);
        setAudioUrl(result.media);
    } catch(error) {
        console.error("TTS failed", error);
        setActiveAudioId(null);
    }
  };

  const handleSendMessage = async (data: ChatFormValues) => {
    setIsLoading(true);
    let userMessageContent: React.ReactNode = data.prompt;

    if (imagePreview) {
        userMessageContent = (
            <div className="space-y-2">
                <Image src={imagePreview} alt="Uploaded preview" width={100} height={100} className="rounded-md" />
                <p>{data.prompt}</p>
            </div>
        )
    }

    const userMessage: Message = { id: `user-${Date.now()}`, sender: 'user', content: userMessageContent, textContent: data.prompt };
    setMessages((prev) => [...prev, userMessage]);
    form.reset();
    setImageFile(null);
    setImagePreview(null);

    try {
        let aiResponseContent: string | React.ReactNode = "Sorry, I couldn't get a response.";
        let aiResponseText: string = "Sorry, I couldn't get a response.";

        if (imageFile) {
            const dataUri = await fileToDataUri(imageFile);
            const result = await medicationIdentifierAI({ photoDataUri: dataUri, question: data.prompt });
            aiResponseContent = result.identification;
            aiResponseText = result.identification;

        } else if (role === 'professional') {
            const result = await professionalPatientSummaryAI({ patientName: 'Patient X', healthLogs: data.prompt.split('\n') });
            const concernsList = result.concerns && result.concerns.length > 0 ? `Concerns:\n${result.concerns.map(c => `- ${c}`).join('\n')}` : '';
            const highlightsList = result.highlights && result.highlights.length > 0 ? `Highlights:\n${result.highlights.map(h => `- ${h}`).join('\n')}` : '';
            aiResponseText = `Summary: ${result.summary}\n${concernsList}\n${highlightsList}`;
            aiResponseContent = (
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
          const result = await config.action(role === 'caregiver' ? { question: data.prompt } : { query: data.prompt }) as any;
          aiResponseText = result.advice || result.clarification;
          
          if (result.isEmergency) {
             aiResponseContent = (
                <Alert variant="destructive">
                    <AlertTriangle className="h-4 w-4" />
                    <AlertTitle>Potential Emergency Detected</AlertTitle>
                    <AlertDescription className="space-y-2">
                        <p>{result.advice}</p>
                        <AlertDialog>
                            <AlertDialogTrigger asChild>
                                <Button variant="secondary" className="w-full">
                                    <Phone className="mr-2 h-4 w-4" />
                                    Show Emergency Numbers
                                </Button>
                            </AlertDialogTrigger>
                            <AlertDialogContent>
                                <AlertDialogHeader>
                                <AlertDialogTitle>Emergency Contact</AlertDialogTitle>
                                <AlertDialogDescription>
                                    Select a number to call immediately.
                                </AlertDialogDescription>
                                </AlertDialogHeader>
                                <AlertDialogFooter className="flex-col gap-2 sm:flex-col">
                                     <AlertDialogAction asChild className="w-full">
                                        <a href="tel:112">
                                            Call General Emergency - 112
                                        </a>
                                    </AlertDialogAction>
                                     <AlertDialogAction asChild className="w-full">
                                        <a href="tel:110">
                                            Call Police - 110
                                        </a>
                                    </AlertDialogAction>
                                    <AlertDialogCancel>Cancel</AlertDialogCancel>
                                </AlertDialogFooter>
                            </AlertDialogContent>
                        </AlertDialog>
                    </AlertDescription>
                </Alert>
             )
          } else {
             aiResponseContent = result.advice || result.clarification;
          }
        }

        const aiMessage: Message = { id: `ai-${Date.now()}`, sender: 'ai', content: aiResponseContent, textContent: aiResponseText };
        setMessages((prev) => [...prev, aiMessage]);
    } catch (error) {
        console.error("AI action failed:", error);
        const errorMessage: Message = { id: `ai-${Date.now()}`, sender: 'ai', content: 'An error occurred. Please try again.', textContent: 'An error occurred. Please try again.' };
        setMessages((prev) => [...prev, errorMessage]);
    } finally {
        setIsLoading(false);
    }
  };

  return (
    <Card className="flex h-full flex-col">
      <CardHeader>
        <ShadcnDialogTitle asChild>
            <CardTitle className="flex items-center gap-2">
                <Bot />
                {isPopup ? 'AI Assistant' : config.title}
            </CardTitle>
        </ShadcnDialogTitle>
      </CardHeader>
      <CardContent className="flex-grow overflow-hidden">
        <ScrollArea className="h-full pr-4">
          <div className="space-y-4">
            {messages.map((message) => (
              <div
                key={message.id}
                className={`flex items-start gap-2 ${
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
                  {message.content}
                </div>
                 {message.sender === 'ai' && message.textContent && (
                    <Button variant="ghost" size="icon" className="h-8 w-8 shrink-0" onClick={() => handlePlayAudio(message)} disabled={activeAudioId === message.id && isLoading}>
                       {activeAudioId === message.id ? <Loader2 className="h-4 w-4 animate-spin" /> : <Volume2 className="h-4 w-4" />}
                    </Button>
                )}
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
      <CardFooter className="flex flex-col items-start gap-4 border-t pt-4">
         {imagePreview && (
            <div className="relative">
                <Image src={imagePreview} alt="upload preview" width={60} height={60} className="rounded-md"/>
                <Button variant="destructive" size="icon" className="absolute -top-2 -right-2 h-6 w-6 rounded-full" onClick={() => {setImageFile(null); setImagePreview(null)}}>
                    <X className="h-4 w-4" />
                </Button>
            </div>
         )}
         {isPopup && (
            <div className='w-full'>
                 <p className="text-xs font-medium text-muted-foreground mb-2">Suggestions:</p>
                <div className="flex flex-wrap gap-2">
                    {suggestedPrompts[role].map((p, i) => (
                        <Button key={i} size="sm" variant="outline" onClick={() => handleSuggestedPrompt(p.prompt)}>
                            {p.title}
                        </Button>
                    ))}
                </div>
                <Separator className="my-4" />
            </div>
         )}
        <Form {...form}>
            <form onSubmit={form.handleSubmit(handleSendMessage)} className="flex w-full items-start gap-2">
                <input type="file" accept="image/*" ref={fileInputRef} onChange={handleImageChange} className="hidden" />
                 <Button type="button" variant="ghost" size="icon" onClick={() => fileInputRef.current?.click()}>
                    <Paperclip className="h-5 w-5" />
                </Button>
                <Button type="button" variant={isListening ? "destructive" : "ghost"} size="icon" onClick={handleListen}>
                    {isListening ? <MicOff className="h-5 w-5" /> : <Mic className="h-5 w-5" />}
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
        <audio ref={audioRef} className="hidden" onEnded={() => setActiveAudioId(null)} />
      </CardFooter>
    </Card>
  );
}
