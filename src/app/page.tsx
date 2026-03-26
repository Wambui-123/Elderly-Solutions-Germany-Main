import { Button } from "@/components/ui/button";
import Image from "next/image";
import Link from "next/link";

export default function LandingPage() {
  return (
    <div className="relative flex min-h-screen flex-col items-center justify-center bg-background p-4 md:p-8">
      <Image
        src="https://picsum.photos/seed/hero/1920/1080"
        alt="Supportive caregiver with an elderly person"
        fill
        className="object-cover -z-10"
        data-ai-hint="caregiver elderly person"
      />
      
      <div className="relative flex w-full max-w-5xl flex-col rounded-2xl bg-black/20 p-8 shadow-2xl backdrop-blur-lg md:p-16">
        <header className="absolute top-0 left-0 right-0 z-40 p-4 md:p-6">
          <div className="flex items-center justify-between">
            <Link href="/" className="flex items-center gap-2">
              <span className="font-headline text-2xl font-bold text-white">
                Elderly Solutions
              </span>
            </Link>
            <nav className="flex items-center gap-2 md:gap-4">
              <Button variant="ghost" className="text-white hover:bg-white/10 hover:text-white" asChild>
                <Link href="/login">Login</Link>
              </Button>
              <Button className="bg-white text-primary hover:bg-gray-200" asChild>
                <Link href="/signup">Get Started</Link>
              </Button>
            </nav>
          </div>
        </header>

        <main className="flex flex-1 items-center justify-center text-center text-white pt-20">
          <div className="flex flex-col items-center gap-6">
            <h1 className="font-headline text-5xl font-bold !leading-tight md:text-6xl lg:text-7xl">
              Compassionate Care, Connected.
            </h1>
            <p className="max-w-3xl text-lg text-white/90 md:text-xl">
              Our platform provides seamless health monitoring, community engagement, and AI-powered assistance to empower caregivers and enhance the well-being of the elderly.
            </p>
            <div className="mt-4 flex gap-4">
              <Button size="lg" className="h-12 px-8 text-base bg-white text-primary hover:bg-gray-200" asChild>
                <Link href="/signup">Join for Free</Link>
              </Button>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
