import { Button } from "@/components/ui/button";
import Image from "next/image";
import Link from "next/link";

export default function LandingPage() {
  return (
    <div className="flex h-screen flex-col bg-background">
      <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur-sm">
        <div className="container flex h-16 items-center justify-between">
          <Link href="/" className="flex items-center gap-2">
            <span className="font-headline text-xl font-bold text-primary md:text-2xl">
              Elderly Solutions
            </span>
          </Link>
          <nav className="flex items-center gap-2">
            <Button variant="ghost" asChild>
              <Link href="/login">Login</Link>
            </Button>
            <Button asChild>
              <Link href="/signup">Get Started</Link>
            </Button>
          </nav>
        </div>
      </header>

      <main className="flex-1 grid place-items-center p-4 sm:p-6 md:p-8">
        <div className="relative w-full h-[70vh] md:h-full rounded-2xl overflow-hidden shadow-lg">
            <Image
                src="https://www.fouroakshealthcare.co.uk/wp-content/uploads/2022/07/iStock-1380983332-1170x740.jpg"
                alt="Supportive caregiver with an elderly person"
                fill
                className="object-cover"
                priority
                data-ai-hint="caregiver elderly person"
            />
            <div className="absolute inset-0 bg-black/40" />
          
          <div className="relative h-full flex flex-col items-center justify-center p-4">
            <div className="max-w-4xl text-center text-white">
              <h1 className="font-headline text-4xl font-bold !leading-tight sm:text-5xl md:text-6xl lg:text-7xl">
                Compassionate Care, Connected.
              </h1>
              <p className="mt-6 max-w-3xl mx-auto text-base text-white/90 sm:text-lg md:text-xl">
                Our platform provides seamless health monitoring, community engagement, and AI-powered assistance to empower caregivers and enhance the well-being of the elderly.
              </p>
              <div className="mt-8 flex justify-center gap-4">
                <Button size="lg" className="h-12 px-8 text-base bg-white text-primary hover:bg-gray-200" asChild>
                  <Link href="/signup">Join for Free</Link>
                </Button>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
