import { CaregiverDashboard } from "@/components/dashboard/overview/caregiver-dashboard";
import { ElderlyDashboard } from "@/components/dashboard/overview/elderly-dashboard";
import { ProfessionalDashboard } from "@/components/dashboard/overview/professional-dashboard";
import { data } from "@/lib/data";

export default function DashboardOverviewPage() {
    // In a real app, user data would come from an auth context or session.
    // Here we'll just cycle through them for demonstration purposes.
    // We will use the Caregiver user by default for a consistent experience.
    const user = data.users[1];

    const renderDashboard = () => {
        switch (user.role) {
            case 'elderly':
                return <ElderlyDashboard user={user} medications={data.medications} />;
            case 'caregiver':
                return <CaregiverDashboard user={user} patients={data.patients} />;
            case 'professional':
                return <ProfessionalDashboard user={user} patients={data.patients} />;
            default:
                return <div>Welcome! Your dashboard is being set up.</div>;
        }
    };

    return (
        <div className="container mx-auto py-6">
            <div className="mb-6">
                <h1 className="font-headline text-3xl font-bold">
                    Welcome back, {user.name.split(' ')[0]}!
                </h1>
                <p className="text-muted-foreground">
                    Here's your overview for today.
                </p>
            </div>
            {renderDashboard()}
        </div>
    );
}
