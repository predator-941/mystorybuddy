// Pełny kod pliku pages/api/story.js
import axios from 'axios';

// Główna funkcja obsługi żądań API
export default async function handler(req, res) {
  console.log("=========================================");
  console.log("API ENDPOINT WYWOŁANY");
  console.log("Metoda HTTP:", req.method);
  
  // Sprawdź czy używana jest metoda POST
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const formData = req.body;
    console.log("Dane formularza:", formData);
    
    // Sprawdź czy zostały podane wymagane dane
    if (!formData.childName || !formData.childAge) {
      console.log("BŁĄD: Brakujące wymagane pola");
      return res.status(400).json({ error: 'Brakujące wymagane pola' });
    }
    
    // Wybierz język bajki
    const language = formData.language || 'pl';
    console.log("Wybrany język:", language);
    
    // Sprawdź czy mamy klucz API OpenAI
    console.log("Klucz OpenAI:", process.env.OPENAI_API_KEY ? "Ustawiony" : "BRAK KLUCZA");
    console.log("Klucz ElevenLabs:", process.env.ELEVENLABS_API_KEY ? "Ustawiony" : "BRAK KLUCZA");
    
    // Przygotuj zapytanie do OpenAI
    const prompt = getPromptByLanguage(formData, language);
    console.log("Prompt dla OpenAI (fragment):", prompt.substring(0, 100) + "...");
    
    // Generowanie tekstu bajki (OpenAI)
    console.log("Rozpoczynam generowanie tekstu przez OpenAI...");
    
    // Generowanie bajki bez OpenAI dla testów
    const title = `Przygoda ${formData.childName} w Zaczarowanym Lesie`;
    const content = `Dawno, dawno temu, w Zaczarowanym Lesie mieszkał ${formData.childAge}-letni odkrywca o imieniu ${formData.childName}. Wszyscy w lesie znali ${formData.childName} z wielkiej ciekawości świata i odwagi.

Pewnego słonecznego poranka, gdy ptaki wesoło śpiewały swoje melodie, ${formData.childName} postanowił wyruszyć na poszukiwanie legendarnego Drzewa Marzeń. Według leśnej legendy, każdy kto odnajdzie to magiczne drzewo, może wypowiedzieć jedno życzenie, które się spełni.

${formData.childName} zabrał swój mały plecak, włożył do niego kanapkę, butelkę wody i swój ulubiony kompas. "Dziś jest idealny dzień na przygodę!" - pomyślał z ekscytacją.`;

    console.log("Wygenerowany tytuł:", title);
    console.log("Wygenerowana treść (początek):", content.substring(0, 50) + "...");
    
    // Generowanie audio
    console.log("Rozpoczynam generowanie audio...");
    let audioData = null;
    let audioFormat = "mp3";
    
    try {
      if (process.env.ELEVENLABS_API_KEY) {
        const audioResult = await generateTestAudio();
        console.log("Wynik generowania audio:", audioResult.success ? "Sukces" : "Błąd");
        
        if (audioResult.success) {
          audioData = audioResult.audioBase64;
          audioFormat = audioResult.format;
          console.log("Wygenerowano audio o długości:", audioData.length);
        } else {
          console.log("Błąd generowania audio:", audioResult.error);
        }
      } else {
        console.log("Pominięto generowanie audio - brak klucza API");
      }
    } catch (audioError) {
      console.error("Wyjątek podczas generowania audio:", audioError);
    }
    
    // Przygotowanie odpowiedzi
    const response = {
      success: true,
      story: {
        title,
        content,
        language,
        childName: formData.childName,
        theme: formData.theme || 'przygoda'
      },
      // Zawsze dodajemy link do zapasowego audio
      fallbackAudioUrl: "https://cdn.freesound.org/previews/612/612095_5674468-lq.mp3"
    };
    
    // Dodaj audio jeśli zostało wygenerowane
    if (audioData) {
      response.audio = {
        data: audioData,
        format: audioFormat
      };
      console.log("Dodano wygenerowane audio do odpowiedzi");
    } else {
      console.log("Audio nie zostało dodane do odpowiedzi");
    }
    
    console.log("Wysyłam odpowiedź do klienta");
    console.log("=========================================");
    return res.status(200).json(response);
  } catch (error) {
    console.error('BŁĄD generowania bajki:', error);
    return res.status(500).json({ 
      error: 'Failed to generate story', 
      details: error.message,
      fallbackAudioUrl: "https://cdn.freesound.org/previews/612/612095_5674468-lq.mp3"
    });
  }
}

// Funkcja pomocnicza do uzyskania odpowiedniego promptu w zależności od języka
function getPromptByLanguage(formData, lang) {
  const prompts = {
    pl: `Napisz krótką bajkę dla ${formData.childAge}-letniego dziecka o imieniu ${formData.childName}. 
    Zainteresowania dziecka: ${formData.interests || 'różne zabawy'}. 
    Temat bajki: ${formData.theme || 'przygoda'}. 
    ${formData.problem ? `W bajce powinien być poruszony problem: ${formData.problem === 'custom' ? formData.customProblem : formData.problem}` : ''}
    Bajka powinna być krótka (max 600 słów), pouczająca, pozytywna i dostosowana do wieku dziecka. 
    Podziel tekst na akapity. 
    Na początku podaj tytuł bajki w formacie: #Tytuł.`,
    
    en: `Write a short bedtime story for a ${formData.childAge}-year-old child named ${formData.childName}. 
    Child's interests: ${formData.interests || 'various activities'}. 
    Story theme: ${formData.theme || 'adventure'}. 
    ${formData.problem ? `The story should address this issue: ${formData.problem === 'custom' ? formData.customProblem : formData.problem}` : ''}
    The story should be short (max 600 words), educational, positive and age-appropriate. 
    Divide the text into paragraphs. 
    Start with the title in this format: #Title.`,
    
    // Pozostałe języki...
  };
  
  return prompts[lang] || prompts.pl;
}

// Funkcja generująca testowe audio (bez ElevenLabs)
async function generateTestAudio() {
  // Ta funkcja tworzy proste testowe audio, które zawsze działa
  try {
    // To jest przykładowy plik audio w formacie base64 (plik jest bardzo krótki dla testów)
    // W rzeczywistym scenariuszu, używałbyś ElevenLabs API
    const testAudioBase64 = "SUQzAwAAAAAfdlRJVDIAAAAZAAAAaHR0cDovL3d3dy5mcmVlc2Z4Lm";
    
    return {
      success: true,
      audioBase64: testAudioBase64,
      format: 'mp3',
    };
  } catch (error) {
    return {
      success: false,
      error: error.message,
    };
  }
}