"use client";

import { useState } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Search, SendHorizonal, Users } from "lucide-react";

// Mock data, to be replaced with live data from Firestore
const mockContacts = [
    { id: '2', name: 'Dr. Anna Schmidt', role: 'Professional', avatarUrl: '' },
    { id: '3', name: 'Ingrid Bauer', role: 'Elderly', avatarUrl: '' },
    { id: '4', name: 'Lars Richter', role: 'Caregiver', avatarUrl: '' },
];

export function CommunityPageContent() {
    const [selectedContact, setSelectedContact] = useState(mockContacts[0]);

    return (
        <Card className="h-[75vh] w-full grid grid-cols-1 md:grid-cols-[minmax(200px,_1fr)_3fr]">
            {/* Contacts Sidebar */}
            <div className="flex flex-col border-r">
                <CardHeader className="p-4">
                    <div className="relative">
                        <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                        <Input placeholder="Search..." className="pl-8" />
                    </div>
                </CardHeader>
                <ScrollArea className="flex-grow">
                    <div className="space-y-1 p-2">
                        {mockContacts.map(contact => (
                            <Button 
                                key={contact.id} 
                                variant={contact.id === selectedContact.id ? 'secondary' : 'ghost'} 
                                className="w-full justify-start h-auto py-2"
                                onClick={() => setSelectedContact(contact)}
                            >
                                <div className="flex items-center w-full">
                                    <Avatar className="h-9 w-9">
                                        <AvatarImage src={contact.avatarUrl} alt={contact.name} />
                                        <AvatarFallback>{contact.name.charAt(0)}</AvatarFallback>
                                    </Avatar>
                                    <div className="ml-3 text-left">
                                        <div className="text-sm font-medium">{contact.name}</div>
                                        <div className="text-xs text-muted-foreground">{contact.role}</div>
                                    </div>
                                </div>
                            </Button>
                        ))}
                    </div>
                </ScrollArea>
            </div>

            {/* Chat Area */}
            <div className="flex flex-col">
                {selectedContact ? (
                    <>
                        <CardHeader className="flex flex-row items-center gap-3 border-b">
                            <Avatar>
                                <AvatarImage src={selectedContact.avatarUrl} alt={selectedContact.name} />
                                <AvatarFallback>{selectedContact.name.charAt(0)}</AvatarFallback>
                            </Avatar>
                            <div>
                                <h3 className="text-lg font-semibold">{selectedContact.name}</h3>
                                <p className="text-sm text-muted-foreground">{selectedContact.role}</p>
                            </div>
                        </CardHeader>
                        <CardContent className="flex-1 bg-muted/50 flex items-center justify-center">
                            <div className="text-center text-muted-foreground">
                                <p>This is the beginning of your conversation with {selectedContact.name}.</p>
                                <p className="text-xs">Messages are not yet connected to a live database.</p>
                            </div>
                        </CardContent>
                        <div className="p-4 border-t">
                            <div className="relative">
                                <Input placeholder="Type a message..." className="pr-12" />
                                <Button size="icon" variant="ghost" className="absolute right-1 top-1/2 -translate-y-1/2 h-8 w-8">
                                    <SendHorizonal className="h-4 w-4"/>
                                </Button>
                            </div>
                        </div>
                    </>
                ) : (
                    <div className="flex flex-1 flex-col items-center justify-center text-muted-foreground">
                        <Users className="h-16 w-16 mb-4" />
                        <h3 className="text-lg font-semibold">Select a contact</h3>
                        <p className="text-sm">Choose someone to start a conversation with.</p>
                    </div>
                )}
            </div>
        </Card>
    );
}
