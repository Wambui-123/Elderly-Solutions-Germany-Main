import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

export default function BillingPage() {
  return (
    <>
      <h1 className="font-headline text-3xl font-bold mb-6">Billing</h1>
      <Card>
        <CardHeader>
          <CardTitle>Billing & Subscriptions</CardTitle>
          <CardDescription>Manage your subscription and payment methods.</CardDescription>
        </CardHeader>
        <CardContent>
          <p>Billing page content will go here.</p>
        </CardContent>
      </Card>
    </>
  );
}
