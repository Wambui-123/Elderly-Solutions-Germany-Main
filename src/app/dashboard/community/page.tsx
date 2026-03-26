import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { data } from "@/lib/data";
import { Search, SendHorizonal } from "lucide-react";

export default function CommunityPage() {
    const contacts = [data.users[0], data.users[2], data.users[3]];
    const selectedContact = contacts[1];

    return (
        <div className="container mx-auto py-6">
            <h1 className="font-headline text-3xl font-bold mb-6">Community Hub</h1>
            <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-6 h-[75vh]">
                <Card className="md:col-span-1 lg:col-span-1 flex flex-col">
                    <CardHeader>
                        <CardTitle>Contacts</CardTitle>
                        <div className="relative">
                            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                            <Input placeholder="Search..." className="pl-8" />
                        </div>
                    </CardHeader>
                    <CardContent className="flex-grow p-0">
                        <ScrollArea className="h-full">
                            <div className="space-y-1 p-2">
                                {contacts.map(contact => (
                                     <Button key={contact.id} variant={contact.id === selectedContact.id ? 'secondary' : 'ghost'} className="w-full justify-start h-auto py-2">
                                        <div className="flex items-center w-full">
                                            <Avatar className="h-9 w-9">
                                                <AvatarImage src={contact.avatarUrl} alt={contact.name} />
                                                <AvatarFallback>{contact.name.charAt(0)}</AvatarFallback>
                                            </Avatar>
                                            <div className="ml-3 text-left">
                                                <div className="text-sm font-medium">{contact.name}</div>
                                                <div className="text-xs text-muted-foreground">
                                                    {contact.role}
                                                </div>
                                            </div>
                                        </div>
                                    </Button>
                                ))}
                            </div>
                        </ScrollArea>
                    </CardContent>
                </Card>
                <Card className="md:col-span-2 lg:col-span-3 flex flex-col">
                     <CardHeader className="flex flex-row items-center gap-3">
                         <Avatar>
                            <AvatarImage src={selectedContact.avatarUrl} alt={selectedContact.name} />
                            <AvatarFallback>{selectedContact.name.charAt(0)}</AvatarFallback>
                        </Avatar>
                        <div>
                            <CardTitle>{selectedContact.name}</CardTitle>
                        </div>
                    </CardHeader>
                    <CardContent className="flex-grow bg-muted/50"></CardContent>
                    <div className="p-4 border-t">
                        <div className="relative">
                            <Input placeholder="Type a message..." className="pr-12" />
                            <Button size="icon" variant="ghost" className="absolute right-1 top-1/2 -translate-y-1/2 h-8 w-8">
                                <SendHorizonal className="h-4 w-4"/>
                            </Button>
                        </div>
                    </div>
                </Card>
            </div>
        </div>
    );
}
