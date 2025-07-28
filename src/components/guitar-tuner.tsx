"use client";

import { useState, useEffect, useRef, useCallback } from 'react';
import { PitchDetector } from 'aubiojs';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { motion, AnimatePresence } from 'framer-motion';
import { Mic, MicOff } from 'lucide-react';
import { noteStrings, getNote, getCents } from '@/lib/audio';

const STANDARD_TUNING = ['E2', 'A2', 'D3', 'G3', 'B3', 'E4'].reverse();

export default function GuitarTuner() {
  const [isTuning, setIsTuning] = useState(false);
  const [hasMicPermission, setHasMicPermission] = useState<boolean | null>(null);
  const [note, setNote] = useState<{ name: string; value: number; cents: number; octave: number } | null>(null);
  const audioContextRef = useRef<AudioContext | null>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const analyserNodeRef = useRef<AnalyserNode | null>(null);
  const pitchDetectorRef = useRef<PitchDetector | null>(null);
  const animationFrameRef = useRef<number>();
  const waveformCanvasRef = useRef<HTMLCanvasElement>(null);

  const drawWaveform = useCallback(() => {
    const analyser = analyserNodeRef.current;
    const canvas = waveformCanvasRef.current;
    if (!analyser || !canvas) return;

    const canvasCtx = canvas.getContext('2d');
    if (!canvasCtx) return;

    const bufferLength = analyser.frequencyBinCount;
    const dataArray = new Uint8Array(bufferLength);
    analyser.getByteTimeDomainData(dataArray);

    canvasCtx.fillStyle = 'rgba(0, 0, 0, 0.1)';
    canvasCtx.fillRect(0, 0, canvas.width, canvas.height);
    canvasCtx.lineWidth = 2;
    canvasCtx.strokeStyle = 'hsl(var(--primary))';
    canvasCtx.beginPath();

    const sliceWidth = (canvas.width * 1.0) / bufferLength;
    let x = 0;

    for (let i = 0; i < bufferLength; i++) {
      const v = dataArray[i] / 128.0;
      const y = (v * canvas.height) / 2;

      if (i === 0) {
        canvasCtx.moveTo(x, y);
      } else {
        canvasCtx.lineTo(x, y);
      }
      x += sliceWidth;
    }
    canvasCtx.lineTo(canvas.width, canvas.height / 2);
    canvasCtx.stroke();
  }, []);

  const updatePitch = useCallback((detector: PitchDetector) => {
    const pitch = detector.do(new Float32Array(detector.inputBlockSize));
    if (pitch) {
      const noteData = getNote(pitch);
      if (noteData) {
        const cents = getCents(pitch, noteData.value);
        setNote({ ...noteData, cents });
      }
    }
    drawWaveform();
    animationFrameRef.current = requestAnimationFrame(() => updatePitch(detector));
  }, [drawWaveform]);
  
  const startTuning = async () => {
    if (isTuning) return;
    try {
      if (!audioContextRef.current) {
        audioContextRef.current = new (window.AudioContext || (window as any).webkitAudioContext)();
      }
      const audioContext = audioContextRef.current;

      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      streamRef.current = stream;
      setHasMicPermission(true);

      const source = audioContext.createMediaStreamSource(stream);
      
      const analyser = audioContext.createAnalyser();
      analyser.fftSize = 2048;
      analyserNodeRef.current = analyser;

      const scriptProcessor = audioContext.createScriptProcessor(4096, 1, 1);
      
      const pitchDetector = await new PitchDetector({
        audioContext,
        onPitchChanged: (pitch) => {
          if (pitch) {
            const noteData = getNote(pitch.frequency);
            if (noteData) {
              const cents = getCents(pitch.frequency, noteData.value);
              setNote({ ...noteData, cents });
            }
          }
        },
      });
      pitchDetectorRef.current = pitchDetector;
      
      source.connect(analyser);
      analyser.connect(scriptProcessor);
      scriptProcessor.connect(audioContext.destination);
      
      scriptProcessor.onaudioprocess = (e) => {
        pitchDetector.do(e.inputBuffer.getChannelData(0));
      };

      setIsTuning(true);
    } catch (err) {
      console.error('Error starting tuner:', err);
      setHasMicPermission(false);
    }
  };


  const stopTuning = useCallback(() => {
    if (!isTuning) return;
    if (animationFrameRef.current) {
      cancelAnimationFrame(animationFrameRef.current);
    }
    if (streamRef.current) {
      streamRef.current.getTracks().forEach(track => track.stop());
      streamRef.current = null;
    }
    if (audioContextRef.current && audioContextRef.current.state !== 'closed') {
       audioContextRef.current.close();
       audioContextRef.current = null;
    }
    pitchDetectorRef.current = null;
    setIsTuning(false);
    setNote(null);
  }, [isTuning]);

  useEffect(() => {
    return () => stopTuning();
  }, [stopTuning]);

  const handleToggleTuning = () => {
    if (isTuning) {
      stopTuning();
    } else {
      startTuning();
    }
  };

  const getTuningProgress = (cents: number) => {
    return Math.max(0, 100 - Math.abs(cents));
  };
  
  const getIndicatorPosition = (cents: number) => {
    const pos = 50 + cents;
    return Math.max(0, Math.min(100, pos));
  }
  
  const isTargetNote = (noteName: string) => {
     if (!note) return false;
     return noteName.slice(0, -1) === note.name;
  }

  return (
    <div className="p-4 rounded-lg space-y-4">
      {hasMicPermission === false && (
        <Alert variant="destructive">
          <MicOff className="h-4 w-4" />
          <AlertTitle>Microphone Access Denied</AlertTitle>
          <AlertDescription>
            Please enable microphone access in your browser settings to use the tuner.
          </AlertDescription>
        </Alert>
      )}

      <div className="flex justify-center">
         <Button onClick={handleToggleTuning} size="lg" className="gradient-btn w-full">
            {isTuning ? <MicOff className="mr-2" /> : <Mic className="mr-2" />}
            {isTuning ? 'Stop Tuning' : 'Start Tuning'}
         </Button>
      </div>

      <AnimatePresence>
        {isTuning && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="space-y-4"
          >
            <div className="text-center p-4 bg-black/20 rounded-lg">
              <div className="relative h-24 flex items-center justify-center">
                 <AnimatePresence>
                  {note ? (
                      <motion.div
                        key={note.name + note.octave}
                        initial={{ opacity: 0, scale: 0.5 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.5 }}
                        className="flex items-baseline"
                      >
                        <span className="text-6xl font-bold text-primary">{note.name}</span>
                        <span className="text-2xl text-muted-foreground">{note.octave}</span>
                      </motion.div>
                  ) : (
                    <div className="text-3xl text-muted-foreground">Play a note...</div>
                  )}
                 </AnimatePresence>
              </div>
              <div className="relative h-2 w-full bg-muted rounded-full overflow-hidden mt-2">
                 {note && (
                    <motion.div 
                        className="absolute top-0 h-full bg-primary rounded-full"
                        style={{ left: `${getIndicatorPosition(note.cents)}%`, x: '-50%' }}
                        initial={{ width: 0 }}
                        animate={{ width: '4px' }}
                    />
                 )}
                 <div className="absolute h-full w-1 bg-white/80 left-1/2 -translate-x-1/2" />
              </div>
               <div className="flex justify-between text-xs text-muted-foreground mt-1 px-1">
                  <span>-50</span>
                  <span>Flat</span>
                  <span>In Tune</span>
                  <span>Sharp</span>
                  <span>+50</span>
                </div>
            </div>
            
            <div className="flex justify-around items-center bg-black/20 p-2 rounded-lg">
                {STANDARD_TUNING.map((noteName, i) => (
                    <div key={i} className="text-center">
                       <div className="text-xs text-muted-foreground">({i+1})</div>
                        <div 
                            className={`text-2xl font-bold transition-all duration-200 ${isTargetNote(noteName) ? 'text-primary scale-125' : ''}`}
                            style={{
                                textShadow: isTargetNote(noteName) ? '0 0 15px hsl(var(--primary))' : 'none'
                            }}
                        >
                            {noteName.slice(0,-1)}
                        </div>
                    </div>
                ))}
            </div>

            <canvas ref={waveformCanvasRef} width="300" height="80" className="w-full rounded-lg bg-black/20"></canvas>

          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
