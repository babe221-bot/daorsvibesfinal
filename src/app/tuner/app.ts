// DOM Elements
const startBtn = document.getElementById('start-btn') as HTMLButtonElement;
const stopBtn = document.getElementById('stop-btn') as HTMLButtonElement;
const noteDisplay = document.getElementById('note-display') as HTMLDivElement;
const freqDisplay = document.getElementById('freq-display') as HTMLDivElement;
const needle = document.getElementById('needle') as HTMLDivElement;
const statusLight = document.getElementById('status-light') as HTMLDivElement;
const targetNoteSelector = document.getElementById('target-note') as HTMLSelectElement;
const errorMessage = document.getElementById('error-message') as HTMLDivElement;
const tunerDisplay = document.getElementById('tuner-display-visual') as HTMLDivElement;
const appTitle = document.getElementById('app-title') as HTMLHeadingElement;
const appDescription = document.getElementById('app-description') as HTMLParagraphElement;
const modeSwitches = document.querySelectorAll('input[name="tuner-mode"]');

// Audio processing variables
let mic: any, analyser: any;
let isTuning = false;
let currentMode = 'drum';
const noteStrings = ["C", "C#", "D", "D#", "E", "F", "F#", "G", "G#", "A", "A#", "B"];

interface NoteData {
    name: string;
    octave: number;
    cents: number;
}

// --- Note presets for different modes ---
const notePresets = {
    drum: [
        { value: 'G3', text: 'G3 (Snare)' },
        { value: 'C3', text: 'C3 (High Tom)' },
        { value: 'G2', text: 'G2 (Low Tom)' },
        { value: 'E2', text: 'E2 (Kick)' }
    ],
    guitar: [
        { value: 'autodetect', text: 'Autodetect' },
        { value: 'E4', text: 'E4 (1st string)' },
        { value: 'B3', text: 'B3 (2nd string)' },
        { value: 'G3', text: 'G3 (3rd string)' },
        { value: 'D3', text: 'D3 (4th string)' },
        { value: 'A2', text: 'A2 (5th string)' },
        { value: 'E2', text: 'E2 (6th string)' }
    ]
};
const guitarNoteFrequencies = notePresets.guitar.filter(n => n.value !== 'autodetect').map(n => ({ ...n, freq: noteToFreq(n.value) }));


// --- Initialization ---

// Function to set the tuner mode and update UI accordingly
function setTunerMode(mode: string) {
    currentMode = mode;
    if (isTuning) stopTuning();

    // Update title and description
    if (mode === 'drum') {
        appTitle.textContent = 'AI Drum Tuner';
        appDescription.textContent = "Select a target drum note and hit 'Start' to begin tuning.";
    } else {
        appTitle.textContent = 'AI Guitar Tuner';
        appDescription.textContent = "Select a target string, or use Autodetect, and hit 'Start'.";
    }

    // Populate the target note dropdown
    targetNoteSelector.innerHTML = '';
    notePresets[currentMode as keyof typeof notePresets].forEach(note => {
        const option = document.createElement('option');
        option.value = note.value;
        option.textContent = note.text;
        targetNoteSelector.appendChild(option);
    });
    resetDisplay();
}

// Function to initialize audio
async function initializeAudio() {
    try {
        await (window as any).Tone.start();
        mic = new (window as any).Tone.UserMedia();
        await mic.open();
        
        analyser = new (window as any).Tone.Analyser('fft', 2048); // Increased FFT size for more accuracy
        mic.connect(analyser);

        console.log("Microphone and analyser are ready.");
        errorMessage.textContent = "";
        return true;
    } catch (error) {
        console.error("Error initializing audio:", error);
        errorMessage.textContent = "Could not access microphone. Please allow microphone access in your browser settings.";
        return false;
    }
}

// --- Event Listeners ---
modeSwitches.forEach(switchEl => {
    switchEl.addEventListener('change', (e) => {
        setTunerMode((e.target as HTMLInputElement).value);
    });
});

startBtn.addEventListener('click', async () => {
    if (await initializeAudio()) {
        isTuning = true;
        startBtn.disabled = true;
        stopBtn.disabled = false;
        statusLight.classList.add('active');
        modeSwitches.forEach(s => (s as HTMLInputElement).disabled = true);
        targetNoteSelector.disabled = true;
        tuningLoop();
    }
});

stopBtn.addEventListener('click', stopTuning);

function stopTuning() {
    isTuning = false;
    startBtn.disabled = false;
    stopBtn.disabled = true;
    statusLight.classList.remove('active');
    modeSwitches.forEach(s => (s as HTMLInputElement).disabled = false);
    targetNoteSelector.disabled = false;
    if (mic) {
        mic.close();
    }
    resetDisplay();
}

// --- Core Logic ---

// Main tuning loop
function tuningLoop() {
    if (!isTuning) return;

    const fftData = analyser.getValue();
    const sampleRate = mic && mic.context ? mic.context.sampleRate : 44100;
    const fundamentalFreq = findFundamentalFreq(fftData, sampleRate);
    
    if (fundamentalFreq > 0) {
        const noteData = freqToNote(fundamentalFreq);
        updateUI(noteData, fundamentalFreq);
    }

    requestAnimationFrame(tuningLoop);
}

// Find fundamental frequency from FFT data
function findFundamentalFreq(fftData: Float32Array, sampleRate: number): number {
    let maxVal = -Infinity;
    let maxIndex = -1;

    for (let i = 1; i < fftData.length; i++) {
        if (fftData[i] > maxVal) {
            maxVal = fftData[i];
            maxIndex = i;
        }
    }
    
    if (maxVal < -70) { // Adjusted amplitude threshold
        return 0;
    }

    const freq = maxIndex * sampleRate / (analyser.size * 2);

    if (freq > 50 && freq < 1200) {
         return freq;
    }
    return 0;
}

// Convert frequency to note and calculate cents difference
function freqToNote(freq: number): NoteData {
    let targetNoteName = targetNoteSelector.value;

    // Autodetect logic for guitar
    if (currentMode === 'guitar' && targetNoteName === 'autodetect') {
        targetNoteSelector.disabled = false; // Allow changing strings while autodetecting
        let closestNote: string | null = null;
        let smallestDiff = Infinity;
        
        guitarNoteFrequencies.forEach(noteInfo => {
            const diff = Math.abs(freq - noteInfo.freq);
            if (diff < smallestDiff) {
                smallestDiff = diff;
                closestNote = noteInfo.value;
            }
        });

        if (closestNote) {
            targetNoteName = closestNote;
            // Visually select the detected note in the dropdown
            if (targetNoteSelector.value !== targetNoteName) {
               targetNoteSelector.value = targetNoteName;
            }
        } else {
           targetNoteName = 'E4'; // Default fallback
        }
    }

    const noteNum = 12 * (Math.log(freq / 440) / Math.log(2));
    const roundedNoteNum = Math.round(noteNum) + 69;
    const noteName = noteStrings[roundedNoteNum % 12];
    const octave = Math.floor(roundedNoteNum / 12) - 1;
    
    const targetFreq = noteToFreq(targetNoteName);
    const centsOff = 1200 * Math.log2(freq / targetFreq);

    return { name: noteName, octave: octave, cents: centsOff };
}

// Convert note name (e.g., "A4") to frequency
function noteToFreq(note: string): number {
    const noteParts = note.match(/([A-G]#?)([0-9])/);
    if (!noteParts) return 0;
    const keyNumber = noteStrings.indexOf(noteParts[1]);
    const octave = parseInt(noteParts[2], 10);
    const semiTone = (octave - 4) * 12 + keyNumber - 9;
    return 440 * Math.pow(2, semiTone / 12);
}

// --- UI Updates ---

// Update UI elements with new data
function updateUI(noteData: NoteData, freq: number) {
    noteDisplay.textContent = `${noteData.name}${noteData.octave}`;
    freqDisplay.textContent = `${freq.toFixed(2)} Hz`;

    let rotation = noteData.cents * 0.9; 
    rotation = Math.max(-45, Math.min(45, rotation));
    needle.style.transform = `rotate(${rotation}deg)`;

    // Change needle color based on tuning accuracy
    if (Math.abs(noteData.cents) < 5) { // In tune
        needle.style.backgroundColor = '#14d3d3'; // teal-400
        needle.style.boxShadow = '0 0 15px #14d3d3';
    } else { // Out of tune
        needle.style.backgroundColor = '#f59e0b'; // amber-500
        needle.style.boxShadow = '0 0 10px #f59e0b';
    }
}

// Reset display to its default state
function resetDisplay() {
    noteDisplay.textContent = '--';
    freqDisplay.textContent = '0.00 Hz';
    needle.style.transform = 'rotate(0deg)';
    needle.style.backgroundColor = '#f59e0b'; // amber-500
    needle.style.boxShadow = '0 0 10px #f59e0b';
}

// Add ticks to the tuner display dynamically
function createTunerTicks() {
    // Clear previous ticks but keep the original needle element
    const existingNeedle = document.getElementById('needle');
    tunerDisplay.innerHTML = '';
    if (existingNeedle) {
        tunerDisplay.appendChild(existingNeedle);
    }

    for (let i = -4; i <= 4; i++) {
        const angle = i * 11;
        const tickContainer = document.createElement('div');
        tickContainer.style.cssText = `position: absolute; width: 100%; height: 100%; transform: rotate(${angle}deg);`;
        
        const tick = document.createElement('div');
        tick.className = 'tick';
        if (i === 0) {
            tick.style.height = '15px';
            tick.style.backgroundColor = '#cbd5e1'; // slate-300
        }
        
        const tickLabel = document.createElement('div');
        tickLabel.className = 'tick-label';
        tickLabel.textContent = (i * 10).toString();
        tickLabel.style.transform = `rotate(${-angle}deg) translateX(-50%)`;
        
        tickContainer.appendChild(tick);
        if (i % 2 === 0) {
            tickContainer.appendChild(tickLabel);
        }
        tunerDisplay.appendChild(tickContainer);
    }
}

// --- Initial Setup on Page Load ---
window.onload = () => {
    createTunerTicks();
    setTunerMode('drum'); // Default to drum mode
};
