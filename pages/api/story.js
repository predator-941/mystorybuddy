// Importy modułów
const { Configuration, OpenAIApi } = require('openai');

// Konfiguracja OpenAI API
const configuration = new Configuration({
  apiKey: process.env.OPENAI_API_KEY,
});
const openai = new OpenAIApi(configuration);

// Funkcja pomocnicza do uzyskania odpowiedniego promptu
function getPromptByLanguage(formData, lang) {
  const prompts = {
    pl: `Napisz krótką bajkę dla ${formData.childAge}-letniego dziecka o imieniu ${formData.childName}. 
    Zainteresowania dziecka: ${formData.interests || 'różne zabawy'}. 
    Temat bajki: ${formData.theme || 'przygoda'}. 
    ${formData.problem ? `W bajce powinien być poruszony problem: ${formData.problem === 'custom' ? formData.customProblem : formData.problem}` : ''}
    Bajka powinna być krótka (max 600 słów), pouczająca, pozytywna i dostosowana do wieku dziecka. 
    Podziel tekst na akapity. 
    Na początku podaj tytuł bajki w formacie: #Tytuł.`,
    
    // Pozostałe języki...
  };
  
  return prompts[lang] || prompts.pl;
}

// Funkcja do generowania audio
async function generateAudio(text, voice = 'adam') {
  try {
    // Kod funkcji generateAudio...
    return {
      success: true,
      audioBase64: "dummy-data", // Tymczasowo, do testów
      format: 'mp3',
    };
  } catch (error) {
    console.error('Error generating audio:', error);
    return {
      success: false,
      error: error.message,
    };
  }
}

// Funkcja do wyboru głosu
function getVoiceForLanguage(language) {
  // Kod funkcji...
  return "default_voice";
}

// Handler dla API route
export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    // Reszta kodu funkcji handler...
    
    // Tymczasowa odpowiedź dla testów
    return res.status(200).json({
      success: true,
      story: {
        title: "Testowa bajka",
        content: "To jest testowa bajka wygenerowana przez API.",
        language: "pl"
      }
    });
  } catch (error) {
    console.error('Error generating story:', error);
    return res.status(500).json({ 
      error: 'Failed to generate story', 
      details: error.message 
    });
  }
}