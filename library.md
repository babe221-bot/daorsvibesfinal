# Biblioteka Pesama Komponenta

Ova komponenta je odgovorna za prikazivanje, brisanje i interakciju sa pesmama sačuvanim u vašoj biblioteci.

```javascript
import React, { useState } from 'react';

// --- Modal Component for displaying AI-generated content ---
const Modal = ({ isOpen, onClose, title, children }) => {
    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black bg-opacity-75 flex justify-center items-center z-50 p-4">
            <div className="bg-gray-800 rounded-xl shadow-2xl w-full max-w-2xl border border-gray-700">
                <div className="p-6 border-b border-gray-700 flex justify-between items-center">
                    <h3 className="text-2xl font-bold text-white">{title}</h3>
                    <button onClick={onClose} className="text-gray-400 hover:text-white transition-colors">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                        </svg>
                    </button>
                </div>
                <div className="p-6 max-h-[70vh] overflow-y-auto">
                    {children}
                </div>
            </div>
        </div>
    );
};


const SongLibrary = ({ songs, isAuthReady, isAiLoading, loading, onDeleteSong, onSimplifyChords }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalContent, setModalContent] = useState('');
  const [modalTitle, setModalTitle] = useState('');

  const handleSimplifyClick = async (song) => {
    const simplifiedText = await onSimplifyChords(song);
    if (simplifiedText) {
      setModalTitle(`Simplified Chords for "${song.title}"`);
      setModalContent(simplifiedText);
      setIsModalOpen(true);
    }
  };

  return (
    <div className="p-6 bg-gray-900 bg-opacity-40 rounded-lg border border-gray-700">
      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title={modalTitle}>
          <pre className="bg-gray-900 p-4 rounded-lg text-gray-200 text-sm font-mono whitespace-pre-wrap">{modalContent}</pre>
      </Modal>

      <h2 className="text-2xl font-bold mb-4 text-white">Your Library</h2>
      {!isAuthReady ? <p className="text-gray-400">Connecting...</p> : songs.length === 0 ? <p className="text-gray-400">No songs yet. Add one above!</p> : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {songs.map((song) => (
            <div key={song.id} className="bg-gray-800 bg-opacity-60 p-5 rounded-lg shadow-lg relative border border-gray-700 flex flex-col">
              <h3 className="text-xl font-bold text-white mb-1">{song.title}</h3>
              {song.artist && <p className="text-blue-400 mb-2">{song.artist}</p>}
              <div className="flex-grow max-h-48 overflow-y-auto bg-gray-900 p-3 rounded-md text-gray-300 text-sm font-mono whitespace-pre-wrap border border-gray-700">
                {song.lyricsAndChords}
              </div>
              <div className="mt-4 flex justify-between items-center">
                <p className="text-xs text-gray-500">Added: {song.timestamp ? new Date(song.timestamp.seconds * 1000).toLocaleDateString() : 'N/A'}</p>
                <button 
                  onClick={() => handleSimplifyClick(song)} 
                  disabled={isAiLoading} 
                  className="bg-teal-500 hover:bg-teal-600 text-white font-bold py-2 px-4 rounded-lg shadow-md transition duration-300 ease-in-out transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  ✨ Simplify Chords
                </button>
              </div>
              <button 
                onClick={() => onDeleteSong(song.id)} 
                disabled={loading} 
                className="absolute top-3 right-3 bg-red-600 hover:bg-red-700 text-white p-2 rounded-full shadow-md transition duration-300 ease-in-out transform hover:scale-110 disabled:opacity-50" 
                aria-label="Delete song"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm6 0a1 1 0 11-2 0v6a1 1 0 112 0V8z" clipRule="evenodd" /></svg>
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default SongLibrary;
```

### Kako koristiti

1.  Uvezite `SongLibrary` komponentu u vašu glavnu `App.js` datoteku.
2.  Prosledite sledeće propse:
    *   `songs`: Niz objekata pesama iz vaše Firebase baze.
    *   `isAuthReady`: Boolean koji pokazuje da li je Firebase autentifikacija završena.
    *   `isAiLoading`: Boolean koji pokazuje da li je AI operacija u toku.
    *   `loading`: Boolean koji pokazuje da li je opšte učitavanje u toku.
    *   `onDeleteSong`: Funkcija koja se poziva sa `songId` kada korisnik klikne na dugme za brisanje.
    *   `onSimplifyChords`: Asinhrona funkcija koja se poziva sa `song` objektom i treba da vrati tekst sa pojednostavljenim akordima.
