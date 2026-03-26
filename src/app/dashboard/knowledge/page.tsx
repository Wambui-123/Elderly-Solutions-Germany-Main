"use client";

import { AIChatClient } from "@/components/dashboard/ai-chat-client";
import { useUser } from "@/firebase";
import { Loader2 } from "lucide-react";

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
        <>
            <h1 className="font-headline text-3xl font-bold mb-6">AI Knowledge Hub</h1>
            <AIChatClient role={user.role} userAvatar={user.avatarUrl} />
        </>
    );
}
