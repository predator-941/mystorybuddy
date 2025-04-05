import { useState, useEffect } from 'react';
import AdBanner from './AdBanner';

const StoryDisplay = ({ story, audioUrl, onDownload, onShare }) => {
  console.log("StoryDisplay otrzymał props:", { story, audioUrl });
  
  if (!story) {
    console.error("StoryDisplay: Nie otrzymano danych bajki!");
    return <div>Brak danych bajki</div>;
  }
  
  return (
    <div className="bg-white rounded-xl shadow-lg p-6 max-w-2xl mx-auto my-8">
      <h2 className="text-3xl font-bold text-center mb-6">
        {story.title || "Twoja bajka"}
      </h2>
      
      {/* Uproszczony odtwarzacz audio */}
      <div className="mb-8 bg-gray-50 p-4 rounded-lg">
        {audioUrl ? (
          <>
            <audio 
              src={audioUrl} 
              controls 
              className="w-full"
              onError={(e) => {
                console.error("Błąd odtwarzacza audio:", e);
                alert("Wystąpił problem z odtwarzaniem dźwięku. Sprawdź konsole po więcej szczegółów.");
              }}
              preload="auto"
            />
            <div className="text-center mt-2">
              <p className="text-sm text-gray-500">Jeśli dźwięk nie działa, możesz <a href={audioUrl} target="_blank" rel="noopener noreferrer" className="text-blue-500 underline">otworzyć go bezpośrednio</a>.</p>
            </div>
          </>
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
          className="flex items-center justify-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M3 17a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm3.293-7.707a1 1 0 011.414 0L9 10.586V3a1 1 0 112 0v7.586l1.293-1.293a1 1 0 111.414 1.414l-3 3a1 1 0 01-1.414 0l-3-3a1 1 0 010-1.414z" clipRule="evenodd" />
          </svg>
          Pobierz Bajkę
        </button>
        
        <button
          onClick={onShare}
          className="flex items-center justify-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
            <path d="M15 8a3 3 0 10-2.977-2.63l-4.94 2.47a3 3 0 100 4.319l4.94 2.47a3 3 0 10.895-1.789l-4.94-2.47a3.027 3.027 0 000-.74l4.94-2.47C13.456 7.68 14.19 8 15 8z" />
          </svg>
          Udostępnij
        </button>
      </div>
    </div>
  );
};

export default StoryDisplay;