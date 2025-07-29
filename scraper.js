import React, { useState } from 'react';

const Scraper = ({ onSongExtracted, loading, isAiLoading }) => {
  const [songUrl, setSongUrl] = useState('');
  const [extractedContent, setExtractedContent] = useState('');
  const [songTitle, setSongTitle] = useState('');
  const [songArtist, setSongArtist] = useState('');
  const [error, setError] = useState('');
  const [message, setMessage] = useState('');

  const callGemini = async (prompt, jsonSchema = null) => {
      // FIX: Reverted model to gemini-2.0-flash to resolve 403 Forbidden error.
      const apiUrl = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent`;
      
      const payload = {
          contents: [{ role: "user", parts: [{ text: prompt }] }],
          ...(jsonSchema && {
              generationConfig: {
                  responseMimeType: "application/json",
                  responseSchema: jsonSchema,
              }
          })
      };

      const response = await fetch(apiUrl, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload)
      });

      if (!response.ok) {
          throw new Error(`API request failed with status: ${response.status}`);
      }
      const result = await response.json();
      const text = result.candidates?.[0]?.content?.parts?.[0]?.text;
      if (!text) {
          throw new Error("Invalid API response format.");
      }
      return text;
  };

  const handleDownloadAndExtract = async () => {
    if (!songUrl) { setError("Please enter a song URL."); return; }
    setError('');
    setMessage('');
    setExtractedContent('');
    try {
        const prompt = `Please fetch the raw text content from the following URL and return only the text content. Do not add any commentary or formatting. URL: ${songUrl}`;
        const text = await callGemini(prompt);
        setExtractedContent(text);
        setMessage("Content extracted. You can now save it or use AI to detect the title and artist.");
    } catch (err) {
      console.error("Error fetching content:", err);
      setError(`Failed to fetch content. The URL might be invalid or inaccessible. Error: ${err.message}`);
    }
  };
  
  const handleDetectTitleAndArtist = async () => {
      if (!extractedContent) { setError("No content to analyze."); return; }
      setError('');
      setMessage('');
      try {
          const prompt = `Analyze the following song lyrics and chords to identify the song title and artist. 

${extractedContent}`;
          const schema = {
              type: "OBJECT",
              properties: {
                  title: { type: "STRING" },
                  artist: { type: "STRING" }
              },
              required: ["title", "artist"]
          };
          const resultText = await callGemini(prompt, schema);
          const resultJson = JSON.parse(resultText);
          setSongTitle(resultJson.title || '');
          setSongArtist(resultJson.artist || '');
          setMessage("✨ Title and artist detected!");
      } catch (err) {
          console.error("Error detecting info:", err);
          setError("Could not auto-detect song info. Please enter it manually.");
      }
  };

  const handleSave = () => {
    if (!songTitle || !extractedContent) {
      setError("Title and content are required to save.");
      return;
    }
    onSongExtracted({
      title: songTitle,
      artist: songArtist,
      lyricsAndChords: extractedContent,
      url: songUrl,
    });
    // Reset form
    setSongUrl('');
    setSongTitle('');
    setSongArtist('');
    setExtractedContent('');
    setMessage('Song passed to library for saving!');
    setError('');
  };

  return (
    <div className="mb-8 p-6 bg-gray-900 bg-opacity-40 rounded-lg border border-gray-700">
      <h2 className="text-2xl font-bold mb-4 text-white">Add New Song</h2>
      {error && <div className="bg-red-500 bg-opacity-80 p-4 rounded-lg mb-4 text-center">{error}</div>}
      {message && <div className="bg-green-500 bg-opacity-80 p-4 rounded-lg mb-4 text-center">{message}</div>}
      <div className="flex flex-col sm:flex-row gap-4 mb-4">
        <input 
          type="text" 
          placeholder="Song URL (e.g., raw .txt or .pro file)" 
          value={songUrl} 
          onChange={(e) => setSongUrl(e.target.value)} 
          className="flex-grow p-3 rounded-lg bg-gray-700 border border-gray-600 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 text-white"
        />
        <button 
          onClick={handleDownloadAndExtract} 
          disabled={loading || !songUrl} 
          className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-6 rounded-lg shadow-md transition duration-300 ease-in-out transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          Fetch Content
        </button>
      </div>

      {extractedContent && (
        <div className="mt-6 p-4 bg-gray-900 bg-opacity-50 rounded-lg border border-gray-700">
          <h3 className="text-xl font-semibold mb-3 text-white">Edit & Save</h3>
          <textarea 
            value={extractedContent} 
            onChange={(e) => setExtractedContent(e.target.value)} 
            rows="10" 
            className="w-full p-3 rounded-lg bg-gray-800 text-gray-200 border border-gray-600 focus:outline-none focus:ring-2 focus:ring-green-500 font-mono"
          ></textarea>
          <div className="mt-4 flex flex-col sm:flex-row gap-4">
            <input 
              type="text" 
              placeholder="Song Title (Required)" 
              value={songTitle} 
              onChange={(e) => setSongTitle(e.target.value)} 
              className="flex-grow p-3 rounded-lg bg-gray-700 border border-gray-600 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-green-500 text-white"
            />
            <input 
              type="text" 
              placeholder="Artist (Optional)" 
              value={songArtist} 
              onChange={(e) => setSongArtist(e.target.value)} 
              className="flex-grow p-3 rounded-lg bg-gray-700 border border-gray-600 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-green-500 text-white"
            />
          </div>
          <div className="mt-4 flex flex-col sm:flex-row gap-4 justify-end">
              <button 
                onClick={handleDetectTitleAndArtist} 
                disabled={isAiLoading || !extractedContent} 
                className="bg-purple-600 hover:bg-purple-700 text-white font-bold py-3 px-6 rounded-lg shadow-md transition duration-300 ease-in-out transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                ✨ Auto-detect Info
              </button>
              <button 
                onClick={handleSave} 
                disabled={loading || !songTitle || !extractedContent} 
                className="bg-green-600 hover:bg-green-700 text-white font-bold py-3 px-6 rounded-lg shadow-md transition duration-300 ease-in-out transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Save to Library
              </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Scraper;
