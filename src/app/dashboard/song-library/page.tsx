"use client";
import AppLayout from "@/components/layout/app-layout";
import Header from "@/components/layout/header";
import SongLibrary from '@/components/song-library';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Library } from "lucide-react";
import React from 'react';

const SongLibraryPage = () => {
  return (
    <AppLayout>
      <div className="relative min-h-screen bg-cover bg-center" style={{ backgroundImage: "url('/background.png')" }}>
        <div className="absolute inset-0 bg-black bg-opacity-50 backdrop-blur-sm"></div>
        <div className="relative z-10">
          <Header />
          <main className="flex-1 p-4 md:p-8 text-white fade-in-down">
            <Card className="glass-card mb-8">
               <CardHeader>
                <div className="flex items-center space-x-4">
                  <div className="p-3 bg-white/20 rounded-full">
                    <Library className="h-8 w-8 text-white" />
                  </div>
                  <div>
                    <CardTitle className="text-3xl font-bold text-white">Biblioteka Pjesama</CardTitle>
                    <CardDescription className="text-gray-300 text-lg">
                      Upravljajte svojim pjesmama, uvezite nove i pretražite javnu arhivu.
                    </CardDescription>
                  </div>
                </div>
              </CardHeader>
            </Card>
            <SongLibrary />
          </main>
        </div>
      </div>
    </AppLayout>
  );
};

export default SongLibraryPage;
