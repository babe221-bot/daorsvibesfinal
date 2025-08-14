"use client";

import React, { Suspense } from 'react';
import { ErrorBoundary } from '@/components/error-boundary';
import { Button } from '@/components/ui/button';

const LazyMetronome = React.lazy(() => import('./metronome').then(module => ({ default: module.Metronome })));

export default function LazyMetronomeWrapper() {
    return (
        <ErrorBoundary>
            <Suspense 
                fallback={
                    <div className="flex flex-col items-center justify-center p-4">
                        <div className="text-white mb-4">Loading metronome...</div>
                        <Button variant="outline" disabled>Loading audio components</Button>
                    </div>
                }
            >
                <LazyMetronome />
            </Suspense>
        </ErrorBoundary>
    );
}