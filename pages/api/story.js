import OpenAI from 'openai';
import axios from 'axios';

// Inicjalizacja OpenAI API
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

// Funkcja pomocnicza do uzyskania odpowiedniego promptu w zależności od języka
const getPromptByLanguage = (formData, lang) => {
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
    
    de: `Schreibe eine kurze Gutenachtgeschichte für ein ${formData.childAge}-jähriges Kind namens ${formData.childName}. 
    Interessen des Kindes: ${formData.interests || 'verschiedene Aktivitäten'}. 
    Thema der Geschichte: ${formData.theme || 'Abenteuer'}. 
    ${formData.problem ? `Die Geschichte sollte folgendes Problem behandeln: ${formData.problem === 'custom' ? formData.customProblem : formData.problem}` : ''}
    Die Geschichte sollte kurz sein (max. 600 Wörter), lehrreich, positiv und altersgerecht. 
    Teile den Text in Absätze ein. 
    Beginne mit dem Titel in diesem Format: #Titel.`,
    
    es: `Escribe un cuento corto para un niño de ${formData.childAge} años llamado ${formData.childName}. 
    Intereses del niño: ${formData.interests || 'diversas actividades'}. 
    Tema del cuento: ${formData.theme || 'aventura'}. 
    ${formData.problem ? `El cuento debe abordar este problema: ${formData.problem === 'custom' ? formData.customProblem : formData.problem}` : ''}
    El cuento debe ser corto (máx. 600 palabras), educativo, positivo y apropiado para la edad. 
    Divide el texto en párrafos. 
    Comienza con el título en este formato: #Título.`
  };
  
  return prompts[lang] || prompts.pl; // Domyślnie polski jeśli język nie jest obsługiwany
};

// Funkcja do generowania audio przez ElevenLabs API
async function generateAudio(text, language) {
  try {
    // Wybór głosu w zależności od języka
    const voiceId = getVoiceForLanguage(language);
    
    const response = await axios({
      method: 'POST',
      url: `https://api.elevenlabs.io/v1/text-to-speech/${voiceId}`,
      headers: {
        'accept': 'audio/mpeg',
        'xi-api-key': process.env.ELEVENLABS_API_KEY,
        'Content-Type': 'application/json',
      },
      data: {
        text: text,
        model_id: 'eleven_multilingual_v2',
        voice_settings: {
          stability: 0.75,
          similarity_boost: 0.75,
        }
      },
      responseType: 'arraybuffer'
    });

    // Konwersja odpowiedzi binarnej do base64
    const buffer = Buffer.from(response.data);
    const audioBase64 = buffer.toString('base64');
    
    return {
      success: true,
      audioBase64,
      format: 'mp3',
    };
  } catch (error) {
    console.error('Error generating audio:', error.response?.data || error.message);
    return {
      success: false,
      error: error.message,
    };
  }
}

// Funkcja do wyboru odpowiedniego głosu w zależności od języka
function getVoiceForLanguage(language) {
  // ID głosów ElevenLabs (zastąp rzeczywistymi ID z konta ElevenLabs)
  const voices = {
    pl: 'XrExE9yKIg1WjnnlVkGX', // Antoni (polski męski)
    en: '21m00Tcm4TlvDq8ikWAM', // Rachel (angielski żeński)
    de: 'BzQbNbJ0YsqZz1O8a9Sy', // Niemicki głos
    es: 'JBFqnCBsd6RMkjVDRZzb'  // Hiszpański głos
  };
  
  return voices[language] || voices.en; // Domyślnie angielski jeśli język nie jest obsługiwany
}

// Główny handler API
export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    console.log("API otrzymało żądanie:", req.body);
    const formData = req.body;
    
    // Sprawdzenie wymaganych pól
    if (!formData.childName || !formData.childAge) {
      return res.status(400).json({ error: 'Brakujące wymagane pola' });
    }
    
    // Wybór języka
    const language = formData.language || 'pl';
    
    // Tworzenie promptu dla OpenAI
    const prompt = getPromptByLanguage(formData, language);
    console.log("Prompt dla OpenAI:", prompt);
    
    // Generowanie tekstu bajki przez OpenAI
    const completion = await openai.chat.completions.create({
      model: "gpt-3.5-turbo",
      messages: [{"role": "user", "content": prompt}],
      max_tokens: 1500,
      temperature: 0.7,
      top_p: 1,
      frequency_penalty: 0.3,
      presence_penalty: 0.3
    });
    
    // Pobranie wygenerowanego tekstu
    const storyText = completion.choices[0].message.content.trim();
    console.log("Wygenerowana bajka (fragmenty):", storyText.substring(0, 100) + "...");
    
    // Przetwarzanie tekstu bajki - wyodrębnienie tytułu i treści
    let title = 'Bajka dla ' + formData.childName;
    let content = storyText;
    
    // Próba wyodrębnienia tytułu z tekstu (format: #Tytuł)
    const titleMatch = storyText.match(/^#\s*(.+)$/m);
    if (titleMatch && titleMatch[1]) {
      title = titleMatch[1].trim();
      // Usunięcie tytułu z treści
      content = storyText.replace(/^#\s*.+$/m, '').trim();
    }
    
    console.log("Tytuł bajki:", title);
    
    // Generowanie audio dla bajki
    const audioResult = await generateAudio(content, language);
    console.log("Wynik generowania audio:", audioResult.success ? "Sukces" : "Błąd");
    
    // Przygotowanie odpowiedzi
    const response = {
      success: true,
      story: {
        title,
        content,
        language,
        childName: formData.childName,
        theme: formData.theme
      }
    };
    
    // Dodanie audio jeśli zostało pomyślnie wygenerowane
    if (audioResult.success) {
      response.audio = {
        data: audioResult.audioBase64,
        format: audioResult.format
      };
    }
    
    return res.status(200).json(response);
  } catch (error) {
    console.error('Error generating story:', error.message);
    return res.status(500).json({ 
      error: 'Failed to generate story', 
      details: error.message 
    });
  }
}