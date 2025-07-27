"use client";

import { useEffect, useRef, useState } from "react";
import { auth, firebase } from "@/lib/firebase";
import { useRouter } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import "firebaseui/dist/firebaseui.css";
import type { AuthUI } from "firebaseui";
import { Skeleton } from "@/components/ui/skeleton";

export default function LoginPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);

  // Store the FirebaseUI instance in a ref to prevent re-initialization
  const firebaseUiWidget = useRef<AuthUI | null>(null);
  
  // This effect runs once on component mount
  useEffect(() => {
    // Dynamically import firebaseui to ensure it's only run on the client
    import("firebaseui").then(firebaseui => {
      // Get or create a new FirebaseUI instance
      const ui = firebaseui.auth.AuthUI.getInstance() || new firebaseui.auth.AuthUI(auth);
      firebaseUiWidget.current = ui;

      const uiConfig = {
        signInFlow: "popup",
        signInSuccessUrl: "/dashboard",
        signInOptions: [
          firebase.auth.GoogleAuthProvider.PROVIDER_ID,
          firebase.auth.EmailAuthProvider.PROVIDER_ID,
        ],
        callbacks: {
          // This is called when the UI is shown
          uiShown: () => {
            setLoading(false);
          },
          // This is called on sign-in success
          signInSuccessWithAuthResult: () => {
            router.push("/dashboard");
            // Return false to prevent the default redirect
            return false;
          },
        },
      };
      
      // Start the FirebaseUI widget
      ui.start("#firebaseui-auth-container", uiConfig);
    });
  }, [router]);

  // This effect handles auth state changes
  useEffect(() => {
    const unregisterAuthObserver = auth.onAuthStateChanged(user => {
      if (user) {
        // If user is signed in, redirect to dashboard
        router.push("/dashboard");
      }
    });

    // Cleanup the listener and reset the widget on unmount
    return () => {
      unregisterAuthObserver();
      firebaseUiWidget.current?.reset();
    };
  }, [router]);

  return (
    <div className="flex items-center justify-center min-h-screen p-4">
      <Card className="w-full max-w-md glass-card">
        <CardHeader>
          <CardTitle className="text-2xl font-bold text-center">
            Prijavite se na DaorsVibes
          </CardTitle>
        </CardHeader>
        <CardContent>
          {loading && (
             <div className="space-y-4">
                <Skeleton className="h-10 w-full" />
                <Skeleton className="h-10 w-full" />
                <div className="flex items-center space-x-2">
                    <Skeleton className="h-4 flex-grow" />
                    <Skeleton className="h-4 w-12" />
                    <Skeleton className="h-4 flex-grow" />
                </div>
                 <Skeleton className="h-10 w-full" />
             </div>
          )}
          <div id="firebaseui-auth-container" />
        </CardContent>
      </Card>
    </div>
  );
}
