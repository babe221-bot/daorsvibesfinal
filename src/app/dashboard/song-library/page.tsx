"use client";
import DashboardPageLayout from "@/components/layout/dashboard-page-layout";
import SongLibrary from '@/components/song-library';
import { Card, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Music } from "lucide-react";
import React from 'react';
import { ErrorBoundary } from "@/components/error-boundary";

const SongLibraryPage = () => {
  return (
    <DashboardPageLayout>
      <Card className="glass-card mb-8">
        <CardHeader>
          <div className="flex items-center space-x-4">
            <div className="p-3 bg-white/20 rounded-full">
              <Music className="h-8 w-8 text-white" />
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
      <ErrorBoundary>
        <SongLibrary />
      </ErrorBoundary>
    </DashboardPageLayout>
  );
};

export default SongLibraryPage;
