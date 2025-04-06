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