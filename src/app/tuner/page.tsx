import React from 'react';

const TunerPage = () => {
  return (
    <html lang="en">
      <head>
        <meta charSet="UTF-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <title>AI Instrument Tuner</title>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="true" />
        <link
          href="https://fonts.googleapis.com/css2?family=Inter:wght@400;600;700&display=swap"
          rel="stylesheet"
        />
        <style>
          {`
            /* --- Base Styles & Modern Theme --- */
            body {
              font-family: 'Inter', sans-serif;
              background-color: #0f172a; /* slate-900 */
              color: #cbd5e1; /* slate-300 */
            }

            /* --- Main Tuner Display (The Dial) --- */
            .tuner-display {
              width: 300px;
              height: 300px;
              border: 4px solid #334155; /* slate-700 */
              border-radius: 50%;
              position: relative;
              margin: 2rem auto;
              background: radial-gradient(circle, #1e293b, #0f172a); /* slate-800 to slate-900 */
              box-shadow: 0 0 30px rgba(20, 211, 211, 0.2), inset 0 0 15px rgba(51, 65, 85, 0.8);
            }

            /* --- The Needle --- */
            .needle {
              width: 3px; /* Slightly thicker */
              height: 140px;
              background-color: #f59e0b; /* amber-500 (out of tune) */
              position: absolute;
              bottom: 50%;
              left: calc(50% - 1.5px);
              transform-origin: bottom;
              transition: all 0.3s cubic-bezier(0.23, 1, 0.32, 1); /* Smoother transition */
              border-radius: 3px;
              box-shadow: 0 0 10px rgba(245, 158, 11, 0.7);
            }

            /* --- Ticks on the Dial --- */
            .tick {
              position: absolute;
              width: 2px;
              height: 8px;
              background-color: #64748b; /* slate-500 */
              top: 2px;
              left: calc(50% - 1px);
              border-radius: 2px;
            }
            .tick-label {
              position: absolute;
              font-size: 11px;
              color: #94a3b8; /* slate-400 */
              top: 18px;
              transform: translateX(-50%);
              font-weight: 600;
            }

            /* --- Text Displays --- */
            .note-display {
              font-size: 4.5rem; /* Larger note */
              font-weight: 700;
              color: #e2e8f0; /* slate-200 */
              text-shadow: 0 0 10px rgba(20, 211, 211, 0.3);
            }
            .freq-display {
              font-size: 1.25rem;
              color: #94a3b8; /* slate-400 */
            }

            /* --- Status Light --- */
            .status-light {
              width: 12px;
              height: 12px;
              border-radius: 50%;
              background-color: #334155; /* slate-700 */
              transition: all 0.3s;
            }
            .status-light.active {
              background-color: #14d3d3; /* cyan-500 */
              box-shadow: 0 0 10px #14d3d3;
            }

            /* --- Custom Styles for Form Elements --- */
            .target-note-selector {
              background-color: #1e293b; /* slate-800 */
              border: 1px solid #475569; /* slate-600 */
              color: #cbd5e1; /* slate-300 */
              padding: 10px;
              border-radius: 8px;
              -webkit-appearance: none;
              appearance: none;
              background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 20 20'%3E%3Cpath stroke='%239ca3af' stroke-linecap='round' stroke-linejoin='round' stroke-width='1.5' d='M6 8l4 4 4-4'/%3E%3C/svg%3E");
              background-position: right 0.5rem center;
              background-repeat: no-repeat;
              background-size: 1.5em 1.5em;
              padding-right: 2.5rem;
            }

            /* --- Modern Segmented Control for Mode Switch --- */
            .tuner-mode-switch {
              display: flex;
              justify-content: center;
              margin-bottom: 1.5rem;
              background-color: #1e293b; /* slate-800 */
              border-radius: 8px;
              padding: 4px;
              border: 1px solid #334155; /* slate-700 */
            }
            .tuner-mode-switch label {
              padding: 8px 16px;
              cursor: pointer;
              transition: all 0.3s ease;
              border-radius: 6px;
              color: #94a3b8; /* slate-400 */
              font-weight: 600;
            }
            .tuner-mode-switch input[type="radio"] {
              display: none;
            }
            .tuner-mode-switch input[type="radio"]:checked + label {
              background-color: #334155; /* slate-700 */
              color: #f1f5f9; /* slate-100 */
            }
          `}
        </style>
      </head>
      <body className="flex flex-col items-center justify-center min-h-screen p-4">
        <div className="text-center mb-8">
          <h1 id="app-title" className="text-3xl md:text-4xl font-bold text-slate-100 mb-2">
            AI Instrument Tuner
          </h1>
          <p id="app-description" className="text-slate-400 max-w-md">
            Select a target note and hit 'Start' to begin tuning.
          </p>
        </div>

        <div className="bg-slate-800/50 backdrop-blur-sm p-6 rounded-2xl shadow-2xl border border-slate-700 w-full max-w-sm">
          <div className="tuner-mode-switch">
            <input type="radio" id="drum-mode" name="tuner-mode" value="drum" defaultChecked />
            <label htmlFor="drum-mode">Drum</label>
            <input type="radio" id="guitar-mode" name="tuner-mode" value="guitar" />
            <label htmlFor="guitar-mode">Guitar</label>
          </div>

          <div className="flex items-center justify-center space-x-3 mb-4">
            <label htmlFor="target-note" className="text-slate-300 font-semibold">
              Target Note:
            </label>
            <select id="target-note" className="target-note-selector"></select>
          </div>

          <div className="tuner-display" id="tuner-display-visual">
            <div className="needle" id="needle"></div>
          </div>

          <div className="text-center my-4">
            <div id="note-display" className="note-display">
              --
            </div>
            <div id="freq-display" className="freq-display">
              0.00 Hz
            </div>
          </div>

          <div className="flex items-center justify-center space-x-4">
            <div id="status-light" className="status-light"></div>
            <button
              id="start-btn"
              className="bg-teal-500 hover:bg-teal-600 disabled:bg-slate-600 text-white font-bold py-3 px-6 rounded-lg transition-colors"
            >
              Start
            </button>
            <button
              id="stop-btn"
              className="bg-slate-600 hover:bg-slate-700 disabled:bg-slate-700/50 disabled:text-slate-500 text-slate-200 font-bold py-3 px-6 rounded-lg transition-colors"
              disabled
            >
              Stop
            </button>
          </div>
        </div>

        <div id="error-message" className="mt-4 text-red-400 text-center"></div>

        <script src="https://unpkg.com/tone@14.7.77/build/Tone.js"></script>
        <script src="./app.js"></script>
      </body>
    </html>
  );
};

export default TunerPage;
