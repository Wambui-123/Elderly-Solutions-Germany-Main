import { AIChatClient } from "@/components/dashboard/ai-chat-client";
import { data } from "@/lib/data";

export default function KnowledgePage() {
    // In a real app, you would get the current user's role and avatar from a session or context.
    const currentUser = data.users[1]; // Mock: Caregiver

    return (
        <div className="container mx-auto py-6">
            <h1 className="font-headline text-3xl font-bold mb-6">AI Knowledge Hub</h1>
            <AIChatClient role={currentUser.role} userAvatar={currentUser.avatarUrl} />
        </div>
    );
}
