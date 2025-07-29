"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const chordProgressions = {
  major: [
    "I-V-vi-IV",
    "I-IV-V-I",
    "vi-IV-I-V",
    "I-vi-IV-V",
  ],
  minor: [
    "i-VI-III-VII",
    "i-iv-v-i",
    "i-iv-VII-III",
    "i-VII-VI-V",
  ],
};

export default function ChordProgressionGenerator() {
  const [key, setKey] = useState("C");
  const [quality, setQuality] = useState("major");
  const [progression, setProgression] = useState("");

  const generateProgression = () => {
    const progressions = chordProgressions[quality];
    const randomProgression = progressions[Math.floor(Math.random() * progressions.length)];
    setProgression(randomProgression);
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center space-x-4">
        <div className="space-y-2">
          <Label htmlFor="key">Key</Label>
          <Input id="key" value={key} onChange={(e) => setKey(e.target.value)} className="w-24" />
        </div>
        <div className="space-y-2">
          <Label htmlFor="quality">Quality</Label>
          <Select value={quality} onValueChange={setQuality}>
            <SelectTrigger className="w-32">
              <SelectValue placeholder="Select quality" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="major">Major</SelectItem>
              <SelectItem value="minor">Minor</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>
      <Button onClick={generateProgression}>Generate Progression</Button>
      {progression && (
        <div className="p-4 bg-gray-100 rounded-md">
          <p className="text-lg font-semibold">{`Generated Progression for ${key} ${quality}:`}</p>
          <p className="text-2xl">{progression}</p>
        </div>
      )}
    </div>
  );
}
