"use client";
import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";

const SongScraper = ({ onSongScraped, isScraping }) => {
  const [url, setUrl] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const callGemini = async (prompt) => {
      const apiKey = ""; // Handled by environment
      const apiUrl = `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${apiKey}`;
      const payload = { contents: [{ role: "user", parts: [{ text: prompt }] }] };
      const response = await fetch(apiUrl, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload)
      });
      if (!response.ok) throw new Error(`API request failed: ${response.status}`);
      const result = await response.json();
      const text = result.candidates?.[0]?.content?.parts?.[0]?.text;
      if (!text) throw new Error("Invalid API response.");
      return text;
  };

  const handleScrape = async () => {
    if (!url) {
      setError("Please enter a URL.");
      return;
    }
    setError('');
    setIsLoading(true);
    try {
      const prompt = `Please extract the song title, artist, and lyrics with chords from the following URL: ${url}. Return the result as a JSON object with keys "title", "artist", and "lyricsAndChords".`;
      const result = await callGemini(prompt);
      const scrapedData = JSON.parse(result);
      onSongScraped(scrapedData);
    } catch (err) {
      console.error("Error scraping song:", err);
      setError("Failed to scrape song data. Please check the URL and try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Card>
        <CardHeader><CardTitle>Add Song From URL</CardTitle></CardHeader>
        <CardContent>
            <div className="space-y-4">
                <Input
                    type="text"
                    placeholder="Enter song URL..."
                    value={url}
                    onChange={(e) => setUrl(e.target.value)}
                    className="flex-grow"
                />
                <Button onClick={handleScrape} disabled={isLoading || isScraping} className="w-full">
                    {isLoading ? 'Scraping...' : 'Scrape Song'}
                </Button>
                {isLoading && <Progress value={50} className="w-full" />}
                {error && <p className="text-destructive text-sm mt-2">{error}</p>}
            </div>
        </CardContent>
    </Card>
  );
};

export default SongScraper;
