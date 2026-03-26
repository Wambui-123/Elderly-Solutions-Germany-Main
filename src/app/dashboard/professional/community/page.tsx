import { CommunityPageContent } from '@/components/dashboard/community/community-page-content';

export default function ProfessionalCommunityPage() {
  return (
    <>
      <h1 className="font-headline text-3xl font-bold mb-6">Consultations</h1>
      <p className="text-muted-foreground mb-6">Securely communicate with other professionals and caregivers.</p>
      <CommunityPageContent />
    </>
  );
}
