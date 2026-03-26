import { CommunityPageContent } from '@/components/dashboard/community/community-page-content';

export default function CaregiverCommunityPage() {
  return (
    <>
      <h1 className="font-headline text-3xl font-bold mb-6">Care Circle</h1>
      <p className="text-muted-foreground mb-6">Communicate with other caregivers, professionals, and family members connected to your patient.</p>
      <CommunityPageContent />
    </>
  );
}
