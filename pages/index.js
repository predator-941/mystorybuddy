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
    console.log("Odpowiedź otrzymana:", data);
    
    if (data.success) {
      console.log("Wygenerowana bajka:", data.story);
      setGeneratedStory(data.story);
      
      // Obsługa audio z API
      if (data.audio && data.audio.data) {
        try {
          console.log("Otrzymano dane audio, długość:", data.audio.data.length);
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
          console.log("Utworzono URL audio:", url);
          setAudioUrl(url);
        } catch (e) {
          console.error("Błąd podczas przetwarzania audio:", e);
          setError("Nie udało się przetworzyć audio: " + e.message);
          
          // Jako awaryjne rozwiązanie, użyj przykładowego pliku audio
          setAudioUrl("https://cdn.freesound.org/previews/612/612095_5674468-lq.mp3");
        }
      } else {
        console.log("Brak danych audio w odpowiedzi");
        setAudioUrl(null);
      }
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