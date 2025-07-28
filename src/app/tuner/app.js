var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (g && (g = 0, op[0] && (_ = 0)), _) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
var _this = this;
// DOM Elements
var startBtn = document.getElementById('start-btn');
var stopBtn = document.getElementById('stop-btn');
var noteDisplay = document.getElementById('note-display');
var freqDisplay = document.getElementById('freq-display');
var needle = document.getElementById('needle');
var statusLight = document.getElementById('status-light');
var targetNoteSelector = document.getElementById('target-note');
var errorMessage = document.getElementById('error-message');
var tunerDisplay = document.getElementById('tuner-display-visual');
var appTitle = document.getElementById('app-title');
var appDescription = document.getElementById('app-description');
var modeSwitches = document.querySelectorAll('input[name="tuner-mode"]');
// Audio processing variables
var mic, analyser;
var isTuning = false;
var currentMode = 'drum';
var noteStrings = ["C", "C#", "D", "D#", "E", "F", "F#", "G", "G#", "A", "A#", "B"];
// --- Note presets for different modes ---
var notePresets = {
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
var guitarNoteFrequencies = notePresets.guitar.filter(function (n) { return n.value !== 'autodetect'; }).map(function (n) { return (__assign(__assign({}, n), { freq: noteToFreq(n.value) })); });
// --- Initialization ---
// Function to set the tuner mode and update UI accordingly
function setTunerMode(mode) {
    currentMode = mode;
    if (isTuning)
        stopTuning();
    // Update title and description
    if (mode === 'drum') {
        appTitle.textContent = 'AI Drum Tuner';
        appDescription.textContent = "Select a target drum note and hit 'Start' to begin tuning.";
    }
    else {
        appTitle.textContent = 'AI Guitar Tuner';
        appDescription.textContent = "Select a target string, or use Autodetect, and hit 'Start'.";
    }
    // Populate the target note dropdown
    targetNoteSelector.innerHTML = '';
    notePresets[currentMode].forEach(function (note) {
        var option = document.createElement('option');
        option.value = note.value;
        option.textContent = note.text;
        targetNoteSelector.appendChild(option);
    });
    resetDisplay();
}
// Function to initialize audio
function initializeAudio() {
    return __awaiter(this, void 0, void 0, function () {
        var error_1;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    _a.trys.push([0, 3, , 4]);
                    return [4 /*yield*/, window.Tone.start()];
                case 1:
                    _a.sent();
                    mic = new window.Tone.UserMedia();
                    return [4 /*yield*/, mic.open()];
                case 2:
                    _a.sent();
                    analyser = new window.Tone.Analyser('fft', 2048); // Increased FFT size for more accuracy
                    mic.connect(analyser);
                    console.log("Microphone and analyser are ready.");
                    errorMessage.textContent = "";
                    return [2 /*return*/, true];
                case 3:
                    error_1 = _a.sent();
                    console.error("Error initializing audio:", error_1);
                    errorMessage.textContent = "Could not access microphone. Please allow microphone access in your browser settings.";
                    return [2 /*return*/, false];
                case 4: return [2 /*return*/];
            }
        });
    });
}
// --- Event Listeners ---
modeSwitches.forEach(function (switchEl) {
    switchEl.addEventListener('change', function (e) {
        setTunerMode(e.target.value);
    });
});
startBtn.addEventListener('click', function () { return __awaiter(_this, void 0, void 0, function () {
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0: return [4 /*yield*/, initializeAudio()];
            case 1:
                if (_a.sent()) {
                    isTuning = true;
                    startBtn.disabled = true;
                    stopBtn.disabled = false;
                    statusLight.classList.add('active');
                    modeSwitches.forEach(function (s) { return s.disabled = true; });
                    targetNoteSelector.disabled = true;
                    tuningLoop();
                }
                return [2 /*return*/];
        }
    });
}); });
stopBtn.addEventListener('click', stopTuning);
function stopTuning() {
    isTuning = false;
    startBtn.disabled = false;
    stopBtn.disabled = true;
    statusLight.classList.remove('active');
    modeSwitches.forEach(function (s) { return s.disabled = false; });
    targetNoteSelector.disabled = false;
    if (mic) {
        mic.close();
    }
    resetDisplay();
}
// --- Core Logic ---
// Main tuning loop
function tuningLoop() {
    if (!isTuning)
        return;
    var fftData = analyser.getValue();
    var sampleRate = mic && mic.context ? mic.context.sampleRate : 44100;
    var fundamentalFreq = findFundamentalFreq(fftData, sampleRate);
    if (fundamentalFreq > 0) {
        var noteData = freqToNote(fundamentalFreq);
        updateUI(noteData, fundamentalFreq);
    }
    requestAnimationFrame(tuningLoop);
}
// Find fundamental frequency from FFT data
function findFundamentalFreq(fftData, sampleRate) {
    var maxVal = -Infinity;
    var maxIndex = -1;
    for (var i = 1; i < fftData.length; i++) {
        if (fftData[i] > maxVal) {
            maxVal = fftData[i];
            maxIndex = i;
        }
    }
    if (maxVal < -70) { // Adjusted amplitude threshold
        return 0;
    }
    var freq = maxIndex * sampleRate / (analyser.size * 2);
    if (freq > 50 && freq < 1200) {
        return freq;
    }
    return 0;
}
// Convert frequency to note and calculate cents difference
function freqToNote(freq) {
    var targetNoteName = targetNoteSelector.value;
    // Autodetect logic for guitar
    if (currentMode === 'guitar' && targetNoteName === 'autodetect') {
        targetNoteSelector.disabled = false; // Allow changing strings while autodetecting
        var closestNote_1 = null;
        var smallestDiff_1 = Infinity;
        guitarNoteFrequencies.forEach(function (noteInfo) {
            var diff = Math.abs(freq - noteInfo.freq);
            if (diff < smallestDiff_1) {
                smallestDiff_1 = diff;
                closestNote_1 = noteInfo.value;
            }
        });
        if (closestNote_1) {
            targetNoteName = closestNote_1;
            // Visually select the detected note in the dropdown
            if (targetNoteSelector.value !== targetNoteName) {
                targetNoteSelector.value = targetNoteName;
            }
        }
        else {
            targetNoteName = 'E4'; // Default fallback
        }
    }
    var noteNum = 12 * (Math.log(freq / 440) / Math.log(2));
    var roundedNoteNum = Math.round(noteNum) + 69;
    var noteName = noteStrings[roundedNoteNum % 12];
    var octave = Math.floor(roundedNoteNum / 12) - 1;
    var targetFreq = noteToFreq(targetNoteName);
    var centsOff = 1200 * Math.log2(freq / targetFreq);
    return { name: noteName, octave: octave, cents: centsOff };
}
// Convert note name (e.g., "A4") to frequency
function noteToFreq(note) {
    var noteParts = note.match(/([A-G]#?)([0-9])/);
    if (!noteParts)
        return 0;
    var keyNumber = noteStrings.indexOf(noteParts[1]);
    var octave = parseInt(noteParts[2], 10);
    var semiTone = (octave - 4) * 12 + keyNumber - 9;
    return 440 * Math.pow(2, semiTone / 12);
}
// --- UI Updates ---
// Update UI elements with new data
function updateUI(noteData, freq) {
    noteDisplay.textContent = "".concat(noteData.name).concat(noteData.octave);
    freqDisplay.textContent = "".concat(freq.toFixed(2), " Hz");
    var rotation = noteData.cents * 0.9;
    rotation = Math.max(-45, Math.min(45, rotation));
    needle.style.transform = "rotate(".concat(rotation, "deg)");
    // Change needle color based on tuning accuracy
    if (Math.abs(noteData.cents) < 5) { // In tune
        needle.style.backgroundColor = '#14d3d3'; // teal-400
        needle.style.boxShadow = '0 0 15px #14d3d3';
    }
    else { // Out of tune
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
    var existingNeedle = document.getElementById('needle');
    tunerDisplay.innerHTML = '';
    if (existingNeedle) {
        tunerDisplay.appendChild(existingNeedle);
    }
    for (var i = -4; i <= 4; i++) {
        var angle = i * 11;
        var tickContainer = document.createElement('div');
        tickContainer.style.cssText = "position: absolute; width: 100%; height: 100%; transform: rotate(".concat(angle, "deg);");
        var tick = document.createElement('div');
        tick.className = 'tick';
        if (i === 0) {
            tick.style.height = '15px';
            tick.style.backgroundColor = '#cbd5e1'; // slate-300
        }
        var tickLabel = document.createElement('div');
        tickLabel.className = 'tick-label';
        tickLabel.textContent = (i * 10).toString();
        tickLabel.style.transform = "rotate(".concat(-angle, "deg) translateX(-50%)");
        tickContainer.appendChild(tick);
        if (i % 2 === 0) {
            tickContainer.appendChild(tickLabel);
        }
        tunerDisplay.appendChild(tickContainer);
    }
}
// --- Initial Setup on Page Load ---
window.onload = function () {
    createTunerTicks();
    setTunerMode('drum'); // Default to drum mode
};
