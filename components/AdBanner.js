import { useEffect, useRef } from 'react';

const AdBanner = ({ className = '', format = 'horizontal' }) => {
  const adContainerRef = useRef(null);

  useEffect(() => {
    // Funkcja ładująca reklamy Google AdSense
    // W rzeczywistej implementacji należy dodać właściwy kod AdSense
    const loadAds = () => {
      if (window.adsbygoogle && adContainerRef.current) {
        try {
          (window.adsbygoogle = window.adsbygoogle || []).push({});
        } catch (error) {
          console.error('Error loading AdSense ads:', error);
        }
      }
    };

    // Załaduj reklamy jeśli skrypt AdSense jest już dostępny
    if (window.adsbygoogle) {
      loadAds();
    } else {
      // Jeśli skrypt AdSense nie jest jeszcze załadowany, dodaj go dynamicznie
      const script = document.createElement('script');
      script.src = 'https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js';
      script.async = true;
      script.crossOrigin = 'anonymous';
      script.onload = loadAds;
      document.head.appendChild(script);
    }
  }, []);

  // Określenie rozmiaru reklamy w zależności od formatu
  const adSize = format === 'horizontal' 
    ? { width: '728px', height: '90px' } 
    : { width: '300px', height: '250px' };

  return (
    <div 
      ref={adContainerRef}
      className={`ad-container flex justify-center items-center bg-gray-100 rounded p-2 overflow-hidden ${className}`}
      style={{
        minHeight: adSize.height,
        margin: '1rem auto'
      }}
    >
      {/* 
        W środowisku produkcyjnym należy zastąpić poniższy kod właściwym kodem AdSense:
      
        <ins className="adsbygoogle"
          style={{ display: 'block', ...adSize }}
          data-ad-client="ca-pub-XXXXXXXXXXXXXXXX"
          data-ad-slot="XXXXXXXXXX"
          data-ad-format="auto"
          data-full-width-responsive="true"></ins>
      */}
      
      {/* Tymczasowa wizualizacja miejsca na reklamę */}
      <div 
        className="flex items-center justify-center bg-gray-200 border border-gray-300 text-gray-500 text-sm"
        style={adSize}
      >
        <span>Miejsce na reklamę {adSize.width} x {adSize.height}</span>
      </div>
    </div>
  );
};

export default AdBanner;