import PronadjiAkorde from '@/components/pronadji-akorde';
import React from 'react';
import AppLayout from '@/components/layout/app-layout';
import Header from '@/components/layout/header';
import { Card } from '@/components/ui/card';

const PronadjiAkordePage = () => {
  return (
     <AppLayout>
      <div className="relative min-h-screen bg-cover bg-center" style={{ backgroundImage: "url('/background.png')" }}>
        <div className="absolute inset-0 bg-black bg-opacity-50 backdrop-blur-sm"></div>
        <div className="relative z-10">
          <Header />
          <main className="flex-1 p-4 md:p-8 text-white fade-in-down">
             <Card className="glass-card">
                <PronadjiAkorde />
             </Card>
          </main>
        </div>
      </div>
    </AppLayout>
  );
};

export default PronadjiAkordePage;
