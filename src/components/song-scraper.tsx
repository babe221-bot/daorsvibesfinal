"use client";
import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";

// This component will be responsible for fetching and analyzing song content from a URL.
function SongScraper({ onSongScraped, isScraping }) {
    const [songUrl, setSongUrl] = useState('');

    const handleScrape = () => {
        // Placeholder for scraping logic
        console.log("Scraping URL:", songUrl);
        // In the future, this will call the AI to fetch and parse the song data
        // and then pass it to the parent component using onSongScraped.
    };

    return (
        <Card>
            <CardHeader><CardTitle>Add Song From URL</CardTitle></CardHeader>
            <CardContent>
                <div className="flex flex-col sm:flex-row gap-4 mb-4">
                    <Input 
                        type="text" 
                        placeholder="Song URL (e.g., raw .txt or .pro file)" 
                        value={songUrl} 
                        onChange={(e) => setSongUrl(e.target.value)} 
                        className="flex-grow"
                    />
                    <Button onClick={handleScrape} disabled={isScraping || !songUrl}>
                        {isScraping ? <Progress value={50} className="w-full" /> : 'Fetch Song'}
                    </Button>
                </div>
            </CardContent>
        </Card>
    );
}

export default SongScraper;
