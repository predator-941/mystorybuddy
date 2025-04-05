import { useState } from 'react';
import Head from 'next/head';
import Image from 'next/image';
import StoryForm from '../components/StoryForm';
import StoryDisplay from '../components/StoryDisplay';
import LoadingIndicator from '../components/LoadingIndicator';
import AdBanner from '../components/AdBanner';

export default function Home() {
  const [isLoading, setIsLoading] = useState(false);
  const [generatedStory, setGeneratedStory] = useState(null);
  const [audioUrl, setAudioUrl] = useState(null);
  const [error, setError] = useState(null);

  const handleSubmit = async (formData) => {
    setIsLoading(true);
    setError(null);
    
    try {
      const response = await fetch('/api/story', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Błąd podczas generowania bajki');
      }
      
      const data = await response.json();
      
      if (data.success) {
        setGeneratedStory(data.story);
        
        // Dla testów używamy statycznego URL audio zamiast konwersji
        setAudioUrl("https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3");
        
        /* Do przyszłej implementacji z rzeczywistym audio z API:
        if (data.audio && data.audio.data) {
          try {
            const byteCharacters = atob(data.audio.data);
            const byteArrays = [];
            
            for (let i = 0; i < byteCharacters.length; i += 512) {
              const slice = byteCharacters.slice(i, i + 512);
              
              const byteNumbers = new Array(slice.length);
              for (let j = 0; j < slice.length; j++) {
                byteNumbers[j] = slice.charCodeAt(j);
              }
              
              const byteArray = new Uint8Array(byteNumbers);
              byteArrays.push(byteArray);
            }
            
            const blob = new Blob(byteArrays, { type: `audio/${data.audio.format}` });
            const url = URL.createObjectURL(blob);
            setAudioUrl(url);
          } catch (e) {
            console.error("Błąd podczas przetwarzania audio:", e);
            setAudioUrl("https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3");
          }
        }
        */
      } else {
        throw new Error(data.error || 'Nie udało się wygenerować bajki');
      }
    } catch (err) {
      console.error('Error generating story:', err);
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  // Funkcja obsługująca pobieranie bajki
  const handleDownload = () => {
    // W wersji darmowej pokazujemy modal zachęcający do zakupu
    alert('Funkcja pobierania dostępna w wersji premium. Już wkrótce!');
  };

  // Funkcja obsługująca udostępnianie bajki
  const handleShare = () => {
    alert('Funkcja udostępniania dostępna wkrótce!');
  };

  // Funkcja do resetowania stanu i tworzenia nowej bajki
  const handleNewStory = () => {
    setGeneratedStory(null);
    setAudioUrl(null);
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-green-50 to-blue-50">
      <Head>
        <title>MyStoryBuddy - Personalizowane bajki dla dzieci</title>
        <meta name="description" content="Twórz magiczne bajki na dobranoc dostosowane do zainteresowań i potrzeb Twojego dziecka" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main className="container mx-auto px-4 py-8">
        {/* Hero section */}
        {!generatedStory && (
          <div className="text-center mb-12">
            <h1 className="text-4xl md:text-5xl font-bold mb-4 text-gray-800">
              <span className="text-green-600">MyStoryBuddy</span>
            </h1>
            <h2 className="text-2xl md:text-3xl font-bold mb-6 text-gray-800">
              Stwórz magiczne bajki na dobranoc
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto mb-8">
              Spersonalizowane historie z Twoim dzieckiem w roli głównej, 
              dopasowane do jego zainteresowań i pomagające rozwiązywać codzienne problemy.
            </p>
            
            <div className="flex justify-center mb-12">
              <div className="relative w-64 h-64 md:w-80 md:h-80">
                <img
                  src="/api/placeholder/400/320"
                  alt="Dziecko czytające książkę"
                  className="w-full h-full object-contain"
                />
              </div>
            </div>

            <div className="bg-white rounded-xl shadow-lg p-6 mb-10 max-w-lg mx-auto">
              <h3 className="text-xl font-semibold mb-4">Jak to działa?</h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="text-center">
                  <div className="bg-green-100 w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-2">
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6 text-green-600">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M15 9h3.75M15 12h3.75M15 15h3.75M4.5 19.5h15a2.25 2.25 0 002.25-2.25V6.75A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25v10.5A2.25 2.25 0 004.5 19.5zm6-10.125a1.875 1.875 0 11-3.75 0 1.875 1.875 0 013.75 0zm1.294 6.336a6.721 6.721 0 01-3.17.789 6.721 6.721 0 01-3.168-.789 3.376 3.376 0 016.338 0z" />
                    </svg>
                  </div>
                  <p className="text-sm">1. Personalizuj</p>
                </div>
                <div className="text-center">
                  <div className="bg-green-100 w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-2">
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6 text-green-600">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M9.813 15.904L9 18.75l-.813-2.846a4.5 4.5 0 00-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 003.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 003.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 00-3.09 3.09zM18.259 8.715L18 9.75l-.259-1.035a3.375 3.375 0 00-2.455-2.456L14.25 6l1.036-.259a3.375 3.375 0 002.455-2.456L18 2.25l.259 1.035a3.375 3.375 0 002.456 2.456L21.75 6l-1.035.259a3.375 3.375 0 00-2.456 2.456zM16.894 20.567L16.5 21.75l-.394-1.183a2.25 2.25 0 00-1.423-1.423L13.5 18.75l1.183-.394a2.25 2.25 0 001.423-1.423l.394-1.183.394 1.183a2.25 2.25 0 001.423 1.423l1.183.394-1.183.394a2.25 2.25 0 00-1.423 1.423z" />
                    </svg>
                  </div>
                  <p className="text-sm">2. Generuj</p>
                </div>
                <div className="text-center">
                  <div className="bg-green-100 w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-2">
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6 text-green-600">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M9 9l10.5-3m0 6.553v3.75a2.25 2.25 0 01-1.632 2.163l-1.32.377a1.803 1.803 0 11-.99-3.467l2.31-.66a2.25 2.25 0 001.632-2.163zm0 0V2.25L9 5.25v10.303m0 0v3.75a2.25 2.25 0 01-1.632 2.163l-1.32.377a1.803 1.803 0 01-.99-3.467l2.31-.66A2.25 2.25 0 009 15.553z" />
                    </svg>
                  </div>
                  <p className="text-sm">3. Ciesz się</p>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Pokazujemy formularz jeśli nie wygenerowano jeszcze bajki */}
        {!isLoading && !generatedStory && (
          <>
            <StoryForm onSubmit={handleSubmit} isLoading={isLoading} />
            
            {/* Testemonials/opinie */}
            <div className="my-12">
              <h3 className="text-2xl font-bold text-center mb-6">Rodzice kochają MyStoryBuddy</h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="bg-white p-4 rounded-lg shadow">
                  <p className="text-gray-600 italic mb-3">
                    "Bajki stały się najważniejszym punktem naszego wieczoru. Moja córka uwielbia słuchać historii, w których jest bohaterką!"
                  </p>
                  <p className="text-gray-800 font-medium">- Anna K.</p>
                </div>
                <div className="bg-white p-4 rounded-lg shadow">
                  <p className="text-gray-600 italic mb-3">
                    "MyStoryBuddy obudziło w moim synu prawdziwą miłość do czytania. Teraz codziennie prosi o nową historię."
                  </p>
                  <p className="text-gray-800 font-medium">- Marcin W.</p>
                </div>
                <div className="bg-white p-4 rounded-lg shadow">
                  <p className="text-gray-600 italic mb-3">
                    "Fantastyczny sposób na rozwiązywanie problemów wychowawczych. Bajki pomagają nam tłumaczyć trudne tematy."
                  </p>
                  <p className="text-gray-800 font-medium">- Karolina S.</p>
                </div>
              </div>
            </div>
          </>
        )}

        {/* Loading indicator */}
        {isLoading && (
          <div className="flex flex-col items-center justify-center py-12">
            <LoadingIndicator />
            <p className="mt-4 text-lg">Tworzę wyjątkową bajkę dla Twojego dziecka...</p>
          </div>
        )}

        {/* Error message */}
        {error && (
          <div className="bg-red-50 border-l-4 border-red-500 p-4 my-6">
            <div className="flex">
              <div className="flex-shrink-0">
                <svg className="h-5 w-5 text-red-500" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                </svg>
              </div>
              <div className="ml-3">
                <p className="text-sm text-red-700">
                  {error}
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Generated story */}
        {!isLoading && generatedStory && (
          <div>
            <StoryDisplay 
              story={generatedStory}
              audioUrl={audioUrl}
              onDownload={handleDownload}
              onShare={handleShare}
            />
            
            <div className="text-center mt-8">
              <button
                onClick={handleNewStory}
                className="px-6 py-3 bg-green-500 hover:bg-green-600 text-white font-medium rounded-md shadow-md transition-colors"
              >
                Stwórz nową bajkę
              </button>
            </div>
          </div>
        )}
        
        {/* Dodatkowa reklama na dole strony */}
        <div className="mt-12">
          <AdBanner format="horizontal" />
        </div>
      </main>

      <footer className="bg-gray-50 border-t border-gray-200 py-8">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="mb-4 md:mb-0">
              <p className="text-gray-600 text-sm">
                &copy; 2024 MyStoryBuddy. Wszelkie prawa zastrzeżone.
              </p>
            </div>
            <div className="flex space-x-4">
              <a href="/privacy-policy" className="text-gray-600 hover:text-gray-900 text-sm">
                Polityka prywatności
              </a>
              <a href="/terms-of-service" className="text-gray-600 hover:text-gray-900 text-sm">
                Warunki korzystania
              </a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}