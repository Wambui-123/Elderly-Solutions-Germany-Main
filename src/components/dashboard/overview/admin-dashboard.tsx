import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import type { User } from '@/lib/types';

interface AdminDashboardProps {
  user: User;
}

export function AdminDashboard({ user }: AdminDashboardProps) {
  return (
    <div className="grid gap-6">
      <Card>
        <CardHeader>
          <CardTitle>Admin Dashboard</CardTitle>
        </CardHeader>
        <CardContent>
          <p>Welcome, {user.name}. Here you can manage users, settings, and monitor the platform.</p>
          {/* More admin-specific components would go here */}
        </CardContent>
      </Card>
    </div>
  );
}
