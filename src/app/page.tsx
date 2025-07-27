
import { Button } from "@/components/ui/button";
import Link from "next/link";

export default function LandingPage() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen text-center p-4">
       <div className="max-w-2xl">
        <h1 className="text-5xl font-bold text-primary animate-fade-in-down">
          Dobrodošli na DaorsVibes
        </h1>
        <p className="mt-4 text-xl text-foreground/80 animate-fade-in-up">
          Vaš ultimativni muzički pratilac za tekstove, akorde i setliste. Unaprijedite svoje svirke pomoću AI alata.
        </p>
        <div className="mt-8 space-x-4 animate-fade-in">
          <Button asChild size="lg" className="gradient-btn">
            <Link href="/login">Prijavite se</Link>
          </Button>
          <Button asChild size="lg" variant="outline">
            <Link href="/dashboard">Idi na kontrolnu ploču</Link>
          </Button>
        </div>
      </div>
    </div>
  );
}
