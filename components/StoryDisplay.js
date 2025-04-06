import { useState, useEffect, useRef } from 'react';
import AdBanner from './AdBanner';

const StoryDisplay = ({ story, audioUrl, onDownload, onShare }) => {
  console.log("StoryDisplay otrzymał props:", { story, audioUrl });
  const audioRef = useRef(null);
  
  // Funkcja sprawdzająca audio po załadowaniu komponentu
  useEffect(() => {
    if (audioUrl && audioRef.current) {
      console.log("Próba odtworzenia audio z URL:", audioUrl);
      
      // Dodaj nasłuchiwanie na różne zdarzenia audio
      const audio = audioRef.current;
      
      const logEvent = (event) => console.log(`Audio event: ${event.type}`);
      
      audio.addEventListener('loadstart', logEvent);
      audio.addEventListener('loadeddata', logEvent);
      audio.addEventListener('canplay', logEvent);
      audio.addEventListener('play', logEvent);
      audio.addEventListener('error', (e) => {
        console.error("Błąd audio:", e);
        console.error("Kod błędu:", audio.error ? audio.error.code : "Brak kodu");
        console.error("Wiadomość błędu:", audio.error ? audio.error.message : "Brak wiadomości");
      });
      
      // Spróbuj załadować audio
      audio.load();
      
      // Cleanup nasłuchiwania zdarzeń
      return () => {
        audio.removeEventListener('loadstart', logEvent);
        audio.removeEventListener('loadeddata', logEvent);
        audio.removeEventListener('canplay', logEvent);
        audio.removeEventListener('play', logEvent);
        audio.removeEventListener('error', logEvent);
      };
    }
  }, [audioUrl]);
  
  if (!story) {
    console.error("StoryDisplay: Nie otrzymano danych bajki!");
    return <div>Brak danych bajki</div>;
  }
  
  // Funkcja do bezpośredniego odtwarzania audio
  const playAudio = () => {
    if (audioRef.current) {
      console.log("Próba odtworzenia audio manualnie");
      const playPromise = audioRef.current.play();
      
      if (playPromise !== undefined) {
        playPromise
          .then(() => console.log("Odtwarzanie rozpoczęte pomyślnie"))
          .catch(error => console.error("Błąd odtwarzania:", error));
      }
    }
  };
  
  return (
    <div className="bg-white rounded-xl shadow-lg p-6 max-w-2xl mx-auto my-8">
      <h2 className="text-3xl font-bold text-center mb-6">
        {story.title || "Twoja bajka"}
      </h2>
      
      {/* Odtwarzacz audio z pełną diagnostyką */}
      <div className="mb-8 bg-gray-50 p-4 rounded-lg">
        {audioUrl ? (
          <div>
            <p className="text-sm text-gray-500 mb-2">URL audio: {audioUrl.substring(0, 30)}...</p>
            
            <audio 
              ref={audioRef}
              src={audioUrl} 
              controls 
              className="w-full mb-2"
              preload="auto"
            />
            
            <div className="flex flex-wrap gap-2 justify-center mt-3">
              <button
                onClick={playAudio}
                className="px-3 py-1 bg-green-500 text-white rounded hover:bg-green-600"
              >
                Rozpocznij odtwarzanie
              </button>
              
              <button
                onClick={() => window.open(audioUrl, '_blank')}
                className="px-3 py-1 bg-blue-500 text-white rounded hover:bg-blue-600"
              >
                Otwórz w nowej karcie
              </button>
            </div>
          </div>
        ) : (
          <div className="text-center p-4">
            <p className="text-gray-500">Dźwięk nie jest dostępny</p>
          </div>
        )}
      </div>
      
      {/* Reklamy */}
      <AdBanner className="my-6" />
      
      {/* Tekst bajki */}
      <div className="prose max-w-none">
        {story.content ? (
          story.content.split('\n').map((paragraph, idx) => (
            <p key={idx} className="mb-4">{paragraph}</p>
          ))
        ) : (
          <p>Nie udało się załadować treści bajki.</p>
        )}
      </div>
      
      {/* Przyciski akcji */}
      <div className="mt-8 flex flex-col sm:flex-row justify-center space-y-4 sm:space-y-0 sm:space-x-4">
        <button
          onClick={onDownload}
          className="flex items-center justify-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700"
        >
          Pobierz Bajkę
        </button>
        
        <button
          onClick={onShare}
          className="flex items-center justify-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50"
        >
          Udostępnij
        </button>
      </div>
    </div>
  );
};

export default StoryDisplay;