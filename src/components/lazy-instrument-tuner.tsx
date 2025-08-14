"use client";

import React, { Suspense } from 'react';
import { ErrorBoundary } from '@/components/error-boundary';
import { Button } from '@/components/ui/button';

const LazyInstrumentTuner = React.lazy(() => import('./instrument-tuner'));

export default function LazyInstrumentTunerWrapper() {
    return (
        <ErrorBoundary>
            <Suspense 
                fallback={
                    <div className="flex flex-col items-center justify-center p-4">
                        <div className="text-white mb-4">Loading instrument tuner...</div>
                        <Button variant="outline" disabled>Loading audio components</Button>
                    </div>
                }
            >
                <LazyInstrumentTuner />
            </Suspense>
        </ErrorBoundary>
    );
}