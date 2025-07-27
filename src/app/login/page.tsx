"use client";

import { useEffect, useState } from "react";
import { auth } from "@/lib/firebase";
import { useRouter } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import Image from "next/image";
import * as firebaseui from "firebaseui";
import "firebaseui/dist/firebaseui.css";
import { EmailAuthProvider, GoogleAuthProvider } from "firebase/auth";

export default function LoginPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unregisterAuthObserver = auth.onAuthStateChanged(user => {
      if (user) {
        router.push("/dashboard");
      } else {
        setLoading(false);
        const ui = firebaseui.auth.AuthUI.getInstance() || new firebaseui.auth.AuthUI(auth);
        ui.start("#firebaseui-auth-container", {
          signInFlow: "popup",
          signInOptions: [
            GoogleAuthProvider.PROVIDER_ID,
            EmailAuthProvider.PROVIDER_ID,
          ],
          callbacks: {
            signInSuccessWithAuthResult: function (authResult, redirectUrl) {
              // User successfully signed in.
              // Return type determines whether we continue the redirect automatically
              // or whether we leave that to developer to handle.
              if (authResult.user) {
                router.push("/dashboard");
              }
              return false;
            },
          },
          signInSuccessUrl: "/dashboard",
          tosUrl: "/terms-of-service",
          privacyPolicyUrl: "/privacy-policy",
        });
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
            width={150} 
            height={150} 
            className="mx-auto mb-4 mix-blend-lighten opacity-90"
            style={{ filter: 'drop-shadow(0 0 20px hsl(var(--primary) / 0.7))' }}
          />
          <CardTitle className="text-2xl font-bold text-center">
            Prijavite se na DaorsVibes
          </CardTitle>
        </CardHeader>
        <CardContent>
          {loading ? (
             <div className="space-y-4">
                <div className="h-10 w-full animate-pulse rounded-md bg-muted" />
             </div>
          ) : (
            <div id="firebaseui-auth-container"></div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
