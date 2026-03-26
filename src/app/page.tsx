import { Icons } from "@/components/icons";
import { Button } from "@/components/ui/button";
import Image from "next/image";
import Link from "next/link";
import { HeartPulse, Users, ShieldCheck } from "lucide-react";

export default function LandingPage() {
  return (
    <div className="flex flex-col min-h-screen bg-background">
      <header className="container z-40 bg-background">
        <div className="flex h-20 items-center justify-between py-6">
          <Link href="/" className="flex items-center gap-2">
            <Icons.logo className="h-8 w-8 text-primary" />
            <span className="font-headline text-xl font-bold">
              Elderly Solutions
            </span>
          </Link>
          <nav className="flex items-center gap-4">
            <Button variant="ghost" asChild>
              <Link href="/login">Login</Link>
            </Button>
            <Button asChild>
              <Link href="/signup">Get Started</Link>
            </Button>
          </nav>
        </div>
      </header>

      <main className="flex-1">
        <section className="container grid lg:grid-cols-2 gap-12 items-center py-12 md:py-24">
          <div className="flex flex-col gap-4">
            <h1 className="font-headline text-4xl md:text-5xl lg:text-6xl font-bold">
              Compassionate Care, Connected.
            </h1>
            <p className="text-lg text-muted-foreground max-w-lg">
              Our platform provides seamless health monitoring, community engagement, and AI-powered assistance to empower caregivers and enhance the well-being of the elderly.
            </p>
            <div className="flex gap-4 mt-4">
              <Button size="lg" asChild>
                <Link href="/signup">Join for Free</Link>
              </Button>
              <Button size="lg" variant="outline" asChild>
                <Link href="#features">Learn More</Link>
              </Button>
            </div>
          </div>
          <div className="relative h-80 lg:h-[400px] w-full">
            <Image
              src="https://picsum.photos/seed/landing/1200/800"
              alt="Caregiver assisting an elderly person"
              fill
              className="rounded-lg object-cover"
              data-ai-hint="caregiver elderly person"
            />
          </div>
        </section>

        <section id="features" className="bg-muted py-20 lg:py-24">
          <div className="container">
            <div className="text-center mb-12">
              <h2 className="font-headline text-3xl md:text-4xl font-bold">Why Choose Us?</h2>
              <p className="text-lg text-muted-foreground mt-2 max-w-2xl mx-auto">
                Everything you need to provide and receive the best care.
              </p>
            </div>
            <div className="grid md:grid-cols-3 gap-8">
              <div className="flex flex-col items-center text-center p-6 bg-card rounded-lg border">
                <div className="p-3 bg-primary/10 rounded-full mb-4">
                  <HeartPulse className="h-8 w-8 text-primary" />
                </div>
                <h3 className="font-bold text-xl mb-2">Smart Health Tracking</h3>
                <p className="text-muted-foreground">
                  Monitor vital signs and medication adherence with our intuitive health dashboard. Keep professionals informed with AI-generated summaries.
                </p>
              </div>
              <div className="flex flex-col items-center text-center p-6 bg-card rounded-lg border">
                 <div className="p-3 bg-primary/10 rounded-full mb-4">
                  <Users className="h-8 w-8 text-primary" />
                </div>
                <h3 className="font-bold text-xl mb-2">Community Hub</h3>
                <p className="text-muted-foreground">
                  Stay connected with family, caregivers, and friends through secure messaging, reducing isolation and fostering a supportive network.
                </p>
              </div>
              <div className="flex flex-col items-center text-center p-6 bg-card rounded-lg border">
                 <div className="p-3 bg-primary/10 rounded-full mb-4">
                  <ShieldCheck className="h-8 w-8 text-primary" />
                </div>
                <h3 className="font-bold text-xl mb-2">AI-Powered Assistance</h3>
                <p className="text-muted-foreground">
                  Get instant, reliable answers to care-related questions and clarify daily tasks with our specialized AI companions for every user role.
                </p>
              </div>
            </div>
          </div>
        </section>

         <section className="container py-20 lg:py-24">
            <div className="bg-primary text-primary-foreground rounded-lg p-10 lg:p-16 text-center">
                 <h2 className="font-headline text-3xl md:text-4xl font-bold">Ready to Get Started?</h2>
                 <p className="text-lg mt-2 mb-6 max-w-2xl mx-auto">
                    Join our community today and experience a new standard of elderly care.
                 </p>
                 <Button size="lg" variant="secondary" asChild>
                    <Link href="/signup">Create Your Account</Link>
                 </Button>
            </div>
         </section>

      </main>

      <footer className="bg-muted border-t">
        <div className="container flex flex-col sm:flex-row items-center justify-between py-6 gap-4">
          <div className="flex items-center gap-2">
            <Icons.logo className="h-6 w-6 text-primary" />
            <span className="font-bold">Elderly Solutions</span>
          </div>
          <p className="text-sm text-muted-foreground">
            © {new Date().getFullYear()} Elderly Solutions. All rights reserved.
          </p>
        </div>
      </footer>
    </div>
  );
}
