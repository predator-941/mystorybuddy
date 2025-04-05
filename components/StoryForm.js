import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';

const StoryForm = ({ onSubmit, isLoading }) => {
  const router = useRouter();
  const [formData, setFormData] = useState({
    childName: '',
    childAge: '',
    location: '',
    favoriteToy: '',
    bestFriend: '',
    interests: '',
    problem: '',
    email: '',
    language: 'pl', // domyślny język
    theme: '' // dodane pole theme
  });

  // Wykrywanie języka przeglądarki/lokalizacji
  useEffect(() => {
    try {
      // Uproszczona implementacja - w pełnej wersji można użyć geolokalizacji
      const browserLang = navigator.language.split('-')[0];
      if (['pl', 'en', 'de', 'es'].includes(browserLang)) {
        setFormData(prev => ({ ...prev, language: browserLang }));
      }
    } catch (error) {
      console.error("Błąd wykrywania języka:", error);
    }
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    console.log(`Zmiana pola ${name} na wartość: ${value}`);
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault(); // Zapobiega domyślnemu przesłaniu formularza
    console.log("Wysyłanie formularza z danymi:", formData);
    onSubmit(formData);
  };

  // Opcje tematyczne dla bajek
  const themeOptions = [
    { value: 'adventure', label: 'Przygoda' },
    { value: 'space', label: 'Kosmos' },
    { value: 'animals', label: 'Zwierzęta' },
    { value: 'magic', label: 'Magia' },
    { value: 'ocean', label: 'Ocean' },
    { value: 'fairytale', label: 'Baśń' }
  ];

  // Opcje problemów do rozwiązania
  const problemOptions = [
    { value: 'darkness', label: 'Strach przed ciemnością' },
    { value: 'sharing', label: 'Nauka dzielenia się' },
    { value: 'friendship', label: 'Zawieranie przyjaźni' },
    { value: 'bedtime', label: 'Problemy z zasypianiem' },
    { value: 'courage', label: 'Odwaga' },
    { value: 'custom', label: 'Własny problem' }
  ];

  return (
    <div className="bg-white rounded-xl shadow-md p-6 max-w-md mx-auto">
      <h2 className="text-2xl font-bold text-center mb-6">Personalizuj swoją bajkę</h2>
      
      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Podstawowe dane */}
        <div>
          <label htmlFor="childName" className="block text-sm font-medium text-gray-700">
            Imię dziecka
          </label>
          <input
            type="text"
            id="childName"
            name="childName"
            required
            value={formData.childName}
            onChange={handleChange}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-green-500 focus:ring-green-500"
            placeholder="Np. Zosia"
          />
        </div>
        
        <div>
          <label htmlFor="childAge" className="block text-sm font-medium text-gray-700">
            Wiek dziecka
          </label>
          <select
            id="childAge"
            name="childAge"
            required
            value={formData.childAge}
            onChange={handleChange}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-green-500 focus:ring-green-500"
          >
            <option value="">Wybierz wiek</option>
            {[...Array(12)].map((_, i) => (
              <option key={i} value={i + 1}>
                {i + 1} {i === 0 ? 'rok' : i < 4 ? 'lata' : 'lat'}
              </option>
            ))}
          </select>
        </div>
        
        {/* Zainteresowania */}
        <div>
          <label htmlFor="theme" className="block text-sm font-medium text-gray-700">
            Wybierz temat
          </label>
          <select
            id="theme"
            name="theme"
            required
            value={formData.theme}
            onChange={handleChange}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-green-500 focus:ring-green-500"
          >
            <option value="">Wybierz temat bajki</option>
            {themeOptions.map(option => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        </div>
        
        <div>
          <label htmlFor="interests" className="block text-sm font-medium text-gray-700">
            Opisz zainteresowania dziecka
          </label>
          <textarea
            id="interests"
            name="interests"
            rows={3}
            value={formData.interests}
            onChange={handleChange}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-green-500 focus:ring-green-500"
            placeholder="Np. dinozaury, rysowanie, taniec, piłka nożna..."
          />
        </div>
        
        {/* Problem */}
        <div>
          <label htmlFor="problem" className="block text-sm font-medium text-gray-700">
            Problem do rozwiązania w bajce
          </label>
          <select
            id="problem"
            name="problem"
            value={formData.problem}
            onChange={handleChange}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-green-500 focus:ring-green-500"
          >
            <option value="">Wybierz lub wpisz własny</option>
            {problemOptions.map(option => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
          {formData.problem === 'custom' && (
            <textarea
              name="customProblem"
              rows={2}
              value={formData.customProblem || ''}
              onChange={handleChange}
              className="mt-2 block w-full rounded-md border-gray-300 shadow-sm focus:border-green-500 focus:ring-green-500"
              placeholder="Opisz problem, który chcesz poruszyć w bajce..."
            />
          )}
        </div>
        
        {/* Opcjonalne dane kontaktowe */}
        <div>
          <label htmlFor="email" className="block text-sm font-medium text-gray-700">
            E-mail (opcjonalnie, do otrzymania bajki)
          </label>
          <input
            type="email"
            id="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-green-500 focus:ring-green-500"
            placeholder="przykład@email.com"
          />
        </div>
        
        {/* Wybór języka */}
        <div>
          <label htmlFor="language" className="block text-sm font-medium text-gray-700">
            Język bajki
          </label>
          <select
            id="language"
            name="language"
            value={formData.language}
            onChange={handleChange}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-green-500 focus:ring-green-500"
          >
            <option value="pl">Polski</option>
            <option value="en">Angielski</option>
            <option value="de">Niemiecki</option>
            <option value="es">Hiszpański</option>
          </select>
        </div>
        
        <button
          type="submit"
          disabled={isLoading}
          className="w-full py-3 px-4 bg-green-500 hover:bg-green-600 text-white font-bold rounded-md shadow-md transition-colors focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-opacity-50 disabled:bg-green-300"
        >
          {isLoading ? 'Generowanie...' : 'Wygeneruj bajkę'}
        </button>
      </form>
    </div>
  );
};

export default StoryForm;