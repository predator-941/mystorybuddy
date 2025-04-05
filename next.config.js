/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: {
    domains: ['placekitten.com', 'picsum.photos'], // Dodaj tutaj domeny obrazów, jeśli będą używane
  },
  env: {
    // Zmienne środowiskowe dostępne po stronie klienta
    APP_NAME: 'MyStoryBuddy',
    APP_VERSION: '1.0.0',
  },
}

module.exports = nextConfig