"use client";

import { useState, useMemo } from "react";
import { useUser, useFirestore, useCollection, useDoc, useMemoFirebase } from '@/firebase';
import { collection, query, where, orderBy, addDoc, serverTimestamp, doc, writeBatch } from 'firebase/firestore';
import type { User, Conversation, Message } from '@/lib/types';
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Search, SendHorizonal, Users, Loader2, MessageSquare } from "lucide-react";
import { formatDistanceToNow } from 'date-fns';

// Component to render a single conversation in the list
function ConversationListItem({ conversation, isSelected, onSelect, currentUserId }: { conversation: Conversation, isSelected: boolean, onSelect: (id: string) => void, currentUserId: string }) {
    const firestore = useFirestore();

    // Find the other participant's ID for 1:1 chats
    const otherParticipantId = useMemo(() => {
        if (conversation.isGroupChat || !currentUserId) return null;
        return conversation.participantIds.find(id => id !== currentUserId);
    }, [conversation, currentUserId]);

    const otherUserDocRef = useMemoFirebase(() => {
        if (!otherParticipantId) return null;
        return doc(firestore, 'user_profiles', otherParticipantId);
    }, [firestore, otherParticipantId]);

    const { data: otherUserData, isLoading } = useDoc<User>(otherUserDocRef);

    const displayName = conversation.isGroupChat ? conversation.name : otherUserData?.name || "Loading...";
    const avatarUrl = conversation.isGroupChat ? '' : otherUserData?.avatarUrl;
    const fallback = displayName ? displayName.charAt(0) : '?';

    if(isLoading && !otherUserData) return (
        <div className="flex items-center gap-4 p-2 h-16">
            <Loader2 className="h-5 w-5 animate-spin" />
            <span className="text-sm text-muted-foreground">Loading...</span>
        </div>
    );

    return (
        <Button 
            variant={isSelected ? 'secondary' : 'ghost'} 
            className="w-full justify-start h-auto py-2"
            onClick={() => onSelect(conversation.id)}
        >
            <div className="flex items-center w-full">
                <Avatar className="h-9 w-9">
                    <AvatarImage src={avatarUrl} alt={displayName} />
                    <AvatarFallback>{fallback}</AvatarFallback>
                </Avatar>
                <div className="ml-3 text-left">
                    <div className="text-sm font-medium">{displayName}</div>
                    {/* Maybe show last message preview here in the future */}
                </div>
            </div>
        </Button>
    );
}

// Component to display the chat window for a selected conversation
function ChatWindow({ conversationId, currentUser }: { conversationId: string, currentUser: User }) {
    const firestore = useFirestore();
    const [newMessage, setNewMessage] = useState('');
    const [isSending, setIsSending] = useState(false);

    const messagesQuery = useMemoFirebase(() => {
        return query(
            collection(firestore, 'conversations', conversationId, 'messages'),
            orderBy('timestamp', 'asc')
        );
    }, [firestore, conversationId]);

    const { data: messages, isLoading: messagesLoading } = useCollection<Message>(messagesQuery);
    
    const conversationDocRef = useMemoFirebase(() => doc(firestore, 'conversations', conversationId), [firestore, conversationId]);
    const { data: conversation, isLoading: conversationLoading } = useDoc<Conversation>(conversationDocRef);

    const otherParticipantId = useMemo(() => {
        if (!conversation || conversation.isGroupChat || !currentUser) return null;
        return conversation.participantIds.find(id => id !== currentUser.id);
    }, [conversation, currentUser]);

    const otherUserDocRef = useMemoFirebase(() => {
        if (!otherParticipantId) return null;
        return doc(firestore, 'user_profiles', otherParticipantId);
    }, [firestore, otherParticipantId]);

    const { data: otherUserData, isLoading: otherUserLoading } = useDoc<User>(otherUserDocRef);

    const handleSendMessage = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!newMessage.trim() || isSending) return;

        setIsSending(true);

        const conversationRef = doc(firestore, 'conversations', conversationId);
        const messagesColRef = collection(conversationRef, 'messages');
        const batch = writeBatch(firestore);
        const newMessageRef = doc(messagesColRef);

        batch.set(newMessageRef, {
            senderId: currentUser.id,
            content: newMessage,
            timestamp: serverTimestamp(),
            conversationId: conversationId
        });

        batch.update(conversationRef, {
            updatedAt: serverTimestamp()
        });

        try {
            await batch.commit();
            setNewMessage('');
        } catch (error) {
            console.error("Failed to send message: ", error);
            // Optionally, show a toast error
        } finally {
            setIsSending(false);
        }
    };
    
    const isLoading = messagesLoading || conversationLoading || otherUserLoading;
    
    const headerDetails = useMemo(() => {
        if (!conversation) return { name: "Loading...", avatarUrl: '', fallback: '?' };
        if (conversation.isGroupChat) return { name: conversation.name, avatarUrl: '', fallback: conversation.name.charAt(0) };
        return { name: otherUserData?.name || "Chat", avatarUrl: otherUserData?.avatarUrl || '', fallback: otherUserData?.name?.charAt(0) || '?' };
    }, [conversation, otherUserData]);


    return (
        <div className="flex flex-col h-full">
            <CardHeader className="flex flex-row items-center gap-3 border-b">
                 <Avatar>
                    <AvatarImage src={headerDetails.avatarUrl} alt={headerDetails.name} />
                    <AvatarFallback>{headerDetails.fallback}</AvatarFallback>
                </Avatar>
                <div>
                    <h3 className="text-lg font-semibold">{headerDetails.name}</h3>
                </div>
            </CardHeader>
            <CardContent className="flex-1 overflow-hidden p-0">
                <ScrollArea className="h-full p-4">
                    {messagesLoading ? (
                         <div className="flex h-full items-center justify-center">
                            <Loader2 className="h-8 w-8 animate-spin text-primary" />
                        </div>
                    ) : (
                        <div className="space-y-4">
                            {messages?.map(message => {
                                const isSender = message.senderId === currentUser.id;
                                const timestamp = (message.timestamp as any)?.seconds 
                                    ? new Date((message.timestamp as any).seconds * 1000) 
                                    : new Date();
                                return (
                                     <div key={message.id} className={`flex items-end gap-2 ${isSender ? 'justify-end' : 'justify-start'}`}>
                                        {!isSender && (
                                            <Avatar className="h-8 w-8">
                                                <AvatarImage src={otherUserData?.avatarUrl || undefined} />
                                                <AvatarFallback>{otherUserData?.name.charAt(0)}</AvatarFallback>
                                            </Avatar>
                                        )}
                                        <div className={`flex flex-col gap-1 ${isSender ? 'items-end' : 'items-start'}`}>
                                            <div className={`max-w-xs rounded-lg p-3 text-sm lg:max-w-md ${isSender ? 'bg-primary text-primary-foreground' : 'bg-muted'}`}>
                                                {message.content}
                                            </div>
                                            <p className="text-xs text-muted-foreground px-1">
                                                {formatDistanceToNow(timestamp, { addSuffix: true })}
                                            </p>
                                        </div>
                                         {isSender && (
                                            <Avatar className="h-8 w-8">
                                                <AvatarImage src={currentUser?.avatarUrl} />
                                                <AvatarFallback>{currentUser?.name.charAt(0)}</AvatarFallback>
                                            </Avatar>
                                        )}
                                    </div>
                                )
                            })}
                        </div>
                    )}
                </ScrollArea>
            </CardContent>
            <div className="p-4 border-t">
                <form onSubmit={handleSendMessage} className="relative">
                    <Input 
                        placeholder="Type a message..." 
                        className="pr-12" 
                        value={newMessage}
                        onChange={(e) => setNewMessage(e.target.value)}
                        disabled={isSending}
                    />
                    <Button type="submit" size="icon" variant="ghost" className="absolute right-1 top-1/2 -translate-y-1/2 h-8 w-8" disabled={isSending}>
                        {isSending ? <Loader2 className="h-4 w-4 animate-spin" /> : <SendHorizonal className="h-4 w-4"/>}
                    </Button>
                </form>
            </div>
        </div>
    );
}

export function CommunityPageContent() {
    const { user, loading: userLoading } = useUser();
    const firestore = useFirestore();
    const [selectedConversationId, setSelectedConversationId] = useState<string | null>(null);

    const conversationsQuery = useMemoFirebase(() => {
        if (!user) return null;
        return query(
            collection(firestore, 'conversations'),
            where('participantIds', 'array-contains', user.id),
            orderBy('updatedAt', 'desc')
        );
    }, [firestore, user]);

    const { data: conversations, isLoading: conversationsLoading } = useCollection<Conversation>(conversationsQuery);
    
    const isLoading = userLoading || conversationsLoading;

    if (isLoading && !conversations) {
        return (
             <Card className="h-[75vh] w-full flex items-center justify-center">
                <Loader2 className="h-10 w-10 animate-spin text-primary" />
            </Card>
        );
    }
    
    if (!user) {
        return (
             <Card className="h-[75vh] w-full flex items-center justify-center">
                <p>Please log in to see your community hub.</p>
            </Card>
        );
    }

    return (
        <Card className="h-[75vh] w-full grid grid-cols-1 md:grid-cols-[minmax(250px,_1fr)_3fr]">
            {/* Conversations Sidebar */}
            <div className="flex flex-col border-r bg-muted/50">
                <CardHeader className="p-4">
                    <div className="relative">
                        <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                        <Input placeholder="Search conversations..." className="pl-8" />
                    </div>
                </CardHeader>
                <ScrollArea className="flex-grow">
                    <div className="space-y-1 p-2">
                        {conversationsLoading && !conversations ? (
                             <div className="p-4 text-center text-sm text-muted-foreground">
                                <Loader2 className="mx-auto h-6 w-6 animate-spin" />
                            </div>
                        ) : conversations && conversations.length > 0 ? (
                            conversations.map(convo => (
                                <ConversationListItem 
                                    key={convo.id}
                                    conversation={convo}
                                    isSelected={selectedConversationId === convo.id}
                                    onSelect={setSelectedConversationId}
                                    currentUserId={user.id}
                                />
                            ))
                        ) : (
                            <div className="p-8 text-center text-sm text-muted-foreground">
                                No conversations yet.
                            </div>
                        )}
                    </div>
                </ScrollArea>
            </div>

            {/* Chat Area */}
            {selectedConversationId ? (
                <ChatWindow conversationId={selectedConversationId} currentUser={user} />
            ) : (
                <div className="hidden md:flex flex-1 flex-col items-center justify-center text-muted-foreground p-8 text-center">
                    <MessageSquare className="h-16 w-16 mb-4" />
                    <h3 className="text-lg font-semibold">Select a conversation</h3>
                    <p className="text-sm">Choose one of your conversations to see the messages.</p>
                </div>
            )}
        </Card>
    );
}
