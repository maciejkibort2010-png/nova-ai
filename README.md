# NOVA — własny asystent AI

## Co jest potrzebne
- Node.js (wersja 18 lub nowsza)
- Klucz API OpenAI. API jest rozliczane osobno od abonamentu ChatGPT; korzystanie z niego może generować opłaty.

## Uruchomienie na Windows
1. Zainstaluj Node.js: https://nodejs.org/
2. Rozpakuj folder `nova-ai`.
3. Otwórz terminal (PowerShell) w folderze `nova-ai`.
4. Wpisz: `npm install`
5. Zmień nazwę pliku `.env.example` na `.env`.
6. W pliku `.env` wklej swój klucz API po `OPENAI_API_KEY=`.
7. W terminalu wpisz: `npm start`
8. Otwórz w przeglądarce: http://localhost:3000

## Bezpieczeństwo
- Nie udostępniaj nikomu klucza API.
- Nie umieszczaj klucza API w plikach folderu `public`.
- Przed opublikowaniem strony w internecie skonfiguruj hosting HTTPS, limity zapytań, ochronę przed nadużyciami i zasady prywatności.
- Ta wersja przechowuje historię rozmowy tylko w pamięci bieżącej karty. Po odświeżeniu strony rozmowa znika.
