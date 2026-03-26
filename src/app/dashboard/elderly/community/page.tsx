import { CommunityPageContent } from '@/components/dashboard/community/community-page-content';

export default function ElderlyCommunityPage() {
    return (
        <>
            <h1 className="font-headline text-3xl font-bold mb-6">Community Hub</h1>
            <p className="text-muted-foreground mb-6">Connect with friends, family, and join community events.</p>
            <CommunityPageContent />
        </>
    );
}
