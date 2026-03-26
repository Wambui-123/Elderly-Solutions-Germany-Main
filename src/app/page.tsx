import { Button } from "@/components/ui/button";
import Image from "next/image";
import Link from "next/link";

export default function LandingPage() {
  return (
    <div className="relative flex flex-col min-h-screen bg-background text-white">
      <Image
        src="https://picsum.photos/seed/hero/1920/1080"
        alt="Supportive caregiver with an elderly person"
        fill
        className="object-cover -z-10 brightness-[.4]"
        data-ai-hint="caregiver elderly person"
      />
      
      <header className="container z-40">
        <div className="flex h-20 items-center justify-between py-6">
          <Link href="/" className="flex items-center gap-2">
            <span className="font-headline text-2xl font-bold">
              Elderly Solutions
            </span>
          </Link>
          <nav className="flex items-center gap-4">
            <Button variant="ghost" className="text-white hover:bg-white/10 hover:text-white" asChild>
              <Link href="/login">Login</Link>
            </Button>
            <Button className="bg-white text-primary hover:bg-gray-200" asChild>
              <Link href="/signup">Get Started</Link>
            </Button>
          </nav>
        </div>
      </header>

      <main className="flex-1 flex items-center justify-center text-center">
        <div className="container flex flex-col gap-6 items-center p-8">
          <h1 className="font-headline text-5xl md:text-6xl lg:text-7xl font-bold !leading-tight">
            Compassionate Care, Connected.
          </h1>
          <p className="text-lg md:text-xl text-white/90 max-w-3xl">
            Our platform provides seamless health monitoring, community engagement, and AI-powered assistance to empower caregivers and enhance the well-being of the elderly.
          </p>
          <div className="flex gap-4 mt-4">
            <Button size="lg" className="bg-white text-primary hover:bg-gray-200 h-12 px-8 text-base" asChild>
              <Link href="/signup">Join for Free</Link>
            </Button>
          </div>
        </div>
      </main>
    </div>
  );
}
