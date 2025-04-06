import { useState } from 'react';
import Head from 'next/head';
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
      console.log("Wysyłanie danych formularza:", formData);
      
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
      console.log("Odpowiedź otrzymana:");
      console.log("- success:", data.success);
      console.log("- story title:", data.story?.title);
      console.log("- audio:", data.audio ? "obecne" : "brak");
      console.log("- fallbackAudioUrl:", data.fallbackAudioUrl);
      
      if (data.success) {
        setGeneratedStory(data.story);
        
        // Obsługa audio z odpowiedzi
        let audioUrlSet = false;
        
        // Najpierw spróbuj użyć audio z API (jeśli istnieje)
        if (data.audio && data.audio.data) {
          try {
            console.log("Przetwarzanie danych audio z base64...");
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
            console.log("Utworzono URL z blobu:", url);
            setAudioUrl(url);
            audioUrlSet = true;
          } catch (e) {
            console.error("BŁĄD podczas przetwarzania audio:", e);
          }
        } else {
          console.log("Brak danych audio w odpowiedzi API");
        }
        
        // Jeśli nie udało się ustawić audio z API, użyj awaryjnego URL
        if (!audioUrlSet && data.fallbackAudioUrl) {
          console.log("Używam awaryjnego URL audio:", data.fallbackAudioUrl);
          setAudioUrl(data.fallbackAudioUrl);
        } else if (!audioUrlSet) {
          // Ostateczne rozwiązanie awaryjne
          const backupUrl = "https://cdn.freesound.org/previews/612/612095_5674468-lq.mp3";
          console.log("Używam zapasowego URL audio:", backupUrl);
          setAudioUrl(backupUrl);
        }
      } else {
        throw new Error(data.error || 'Nie udało się wygenerować bajki');
      }
    } catch (err) {
      console.error('BŁĄD:', err);
      setError(err.message);
      
      // Nawet w przypadku błędu, spróbuj ustawić przykładowe audio
      setAudioUrl("https://cdn.freesound.org/previews/612/612095_5674468-lq.mp3");
    } finally {
      setIsLoading(false);
    }
  };

  // Tutaj zwracamy JSX - to jest część renderująca komponent
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
          </div>
        )}

        {/* Pokazujemy formularz jeśli nie wygenerowano jeszcze bajki */}
        {!isLoading && !generatedStory && (
          <StoryForm onSubmit={handleSubmit} isLoading={isLoading} />
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
              onDownload={() => alert('Funkcja pobierania dostępna wkrótce')}
              onShare={() => alert('Funkcja udostępniania dostępna wkrótce')}
            />
            
            <div className="text-center mt-8">
              <button
                onClick={() => {
                  setGeneratedStory(null);
                  setAudioUrl(null);
                }}
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
                &copy; {new Date().getFullYear()} MyStoryBuddy. Wszelkie prawa zastrzeżone.
              </p>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}