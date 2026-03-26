"use client";

import { AIChatClient } from "@/components/dashboard/ai-chat-client";
import { useUser } from "@/firebase";
import { Loader2, BookOpen } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";


export default function KnowledgePage() {
    const { user, loading } = useUser();

    if (loading) {
        return (
            <div className="flex h-[80vh] items-center justify-center">
                <Loader2 className="h-16 w-16 animate-spin text-primary" />
            </div>
        );
    }

    if (!user) {
        // Should be handled by layout, but as a fallback
        return <p>Please log in to access the AI Knowledge Hub.</p>;
    }


    return (
        <div className="space-y-6">
            <div className="space-y-2">
                 <h1 className="font-headline text-3xl font-bold">Knowledge Hub</h1>
                 <p className="text-muted-foreground">Your center for in-depth information, research, and AI-powered insights.</p>
            </div>
           
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <div className="lg:col-span-2">
                     <AIChatClient role={user.role} userAvatar={user.avatarUrl} isPopup={false} />
                </div>
                <div className="space-y-6">
                    <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                                <BookOpen />
                                Community Resources
                            </CardTitle>
                            <CardDescription>Browse articles and guides shared by the community.</CardDescription>
                        </CardHeader>
                        <CardContent>
                            <p className="text-sm text-muted-foreground">Community resource linking will be implemented here.</p>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </div>
    );
}
