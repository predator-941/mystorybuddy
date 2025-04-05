// Handler dla API route
export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const formData = req.body;
    
    // Sprawdzenie wymaganych pól
    if (!formData.childName || !formData.childAge) {
      return res.status(400).json({ error: 'Brakujące wymagane pola' });
    }
    
    // W tej uproszczonej wersji generujemy przykładową bajkę zamiast używać OpenAI API
    const title = `Przygoda ${formData.childName} w Zaczarowanym Lesie`;
    
    // Tworzenie treści bajki na podstawie danych z formularza
    const content = `Dawno, dawno temu, w Zaczarowanym Lesie mieszkał ${formData.childAge}-letni odkrywca o imieniu ${formData.childName}. Wszyscy w lesie znali ${formData.childName} z wielkiej ciekawości świata i odwagi.

Pewnego słonecznego poranka, gdy ptaki wesoło śpiewały swoje melodie, ${formData.childName} postanowił wyruszyć na poszukiwanie legendarnego Drzewa Marzeń. Według leśnej legendy, każdy kto odnajdzie to magiczne drzewo, może wypowiedzieć jedno życzenie, które się spełni.

${formData.childName} zabrał swój mały plecak, włożył do niego kanapkę, butelkę wody i swój ulubiony kompas. "Dziś jest idealny dzień na przygodę!" - pomyślał z ekscytacją.

W trakcie wędrówki przez las, ${formData.childName} spotkał wiele leśnych stworzeń. Najpierw natknął się na rodzinę królików, które pokazały mu skrót przez polanę pełną kolorowych kwiatów. Następnie spotkał mądrą sowę, która siedziała na gałęzi i obserwowała wszystko swoimi wielkimi oczami.

"Dokąd zmierzasz, małą istoto?" - zapytała sowa, przekrzywiając głowę.

"Szukam Drzewa Marzeń!" - odpowiedział z entuzjazmem ${formData.childName}.

Sowa zamyśliła się przez chwilę, po czym powiedziała: "Drzewo Marzeń można znaleźć tylko wtedy, gdy ma się czyste i dobre serce. Podążaj ścieżką, która prowadzi w stronę zachodzącego słońca, a znajdziesz to, czego szukasz."

${formData.childName} podziękował sowie za wskazówkę i ruszył we wskazanym kierunku. Droga nie była łatwa - musiał przejść przez gęste zarośla, przeskoczyć przez strumyk i wspiąć się na niewielkie wzgórze.

Gdy już myślał, że się zgubił, nagle zobaczył przed sobą niezwykły widok. Na środku małej polany stało ogromne drzewo, którego liście mieniły się wszystkimi kolorami tęczy. Każdy liść błyszczał i delikatnie migotał, jakby był wysadzany drobnymi diamencikami.

"To musi być Drzewo Marzeń!" - wykrzyknął podekscytowany ${formData.childName}.

Podszedł powoli do drzewa i delikatnie dotknął jego kory. W tym momencie wszystkie liście zatrzepotały, jakby poruszył je delikatny wiatr, a z drzewa wydobył się łagodny głos:

"Witaj, młody odkrywco. Znalazłeś Drzewo Marzeń dzięki swojej odwadze i dobremu sercu. Możesz teraz wypowiedzieć jedno życzenie."

${formData.childName} zamknął oczy i pomyślał głęboko. Nie chciał prosić o zabawki ani słodycze. Zamiast tego, życzył sobie, aby wszystkie dzieci w jego wiosce miały piękne, kolorowe sny każdej nocy.

Drzewo ponownie zatrzepotało liśćmi, a głos powiedział: "Twoje życzenie jest godne podziwu. Niech tak się stanie."

Od tego dnia, wszystkie dzieci w wiosce ${formData.childName} miały kolorowe i piękne sny. A ${formData.childName}? Cóż, kontynuował swoje przygody w Zaczarowanym Lesie, stając się najsłynniejszym odkrywcą, jakiego kiedykolwiek znał leśny świat.

I tak kończy się opowieść o ${formData.childName} i Drzewie Marzeń. Ale kto wie, jakie jeszcze przygody czekają na naszego bohatera w przyszłości?`;

    // Przygotowanie odpowiedzi
    const response = {
      success: true,
      story: {
        title,
        content,
        language: formData.language || 'pl',
        childName: formData.childName,
        theme: formData.theme || 'przygoda'
      }
    };
    
    return res.status(200).json(response);
  } catch (error) {
    console.error('Error generating story:', error);
    return res.status(500).json({ 
      error: 'Failed to generate story', 
      details: error.message 
    });
  }
}