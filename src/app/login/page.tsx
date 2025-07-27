"use client";

import { useEffect, useState } from "react";
import { auth } from "@/lib/firebase";
import { useRouter } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import Image from "next/image";
import { GoogleAuthProvider, signInWithPopup } from "firebase/auth";
import { Button } from "@/components/ui/button";

export default function LoginPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);

  const handleSignIn = async () => {
    const provider = new GoogleAuthProvider();
    try {
      const result = await signInWithPopup(auth, provider);
      const user = result.user;
      if (user) {
        router.push("/dashboard");
      }
    } catch (error: any) {
      if (error.code === 'auth/popup-closed-by-user') {
        console.log("Sign-in popup closed by user.");
      } else {
        console.error("Error signing in with Google: ", error);
      }
    }
  };

  useEffect(() => {
    const unregisterAuthObserver = auth.onAuthStateChanged(user => {
      if (user) {
        router.push("/dashboard");
      } else {
        setLoading(false);
      }
    });

    return () => unregisterAuthObserver();
  }, [router]);

  return (
    <div className="flex items-center justify-center min-h-screen p-4">
      <Card className="w-full max-w-md glass-card">
        <CardHeader>
          <Image 
            src="/logo.png" 
            alt="DaorsVibes Logo" 
            width={100} 
            height={100} 
            className="mx-auto mb-4 mix-blend-lighten opacity-90"
            style={{ filter: 'drop-shadow(0 0 15px hsl(var(--primary) / 0.7))' }}
          />
          <CardTitle className="text-2xl font-bold text-center">
            Prijavite se na DaorsVibes
          </CardTitle>
        </CardHeader>
        <CardContent>
          {loading ? (
             <div className="space-y-4">
                <Skeleton className="h-10 w-full" />
             </div>
          ) : (
            <Button onClick={handleSignIn} className="w-full">
              Sign in with Google
            </Button>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
