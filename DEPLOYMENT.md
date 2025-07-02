# 🚀 Deployment Guide

## Wymagania przed deployment

1. **Konfiguracja Supabase** - Przeczytaj plik `SUPABASE_SETUP.md`
2. **Zmienne środowiskowe** - Skopiuj `.env.example` do `.env.local` i uzupełnij wartości

## 🌐 Deployment na Vercel (Zalecane)

### Szybki deployment z GitHub

1. Idź na [vercel.com](https://vercel.com)
2. Zaloguj się przez GitHub
3. Kliknij "New Project"
4. Wybierz repozytorium `simplevote`
5. Dodaj zmienne środowiskowe:
   - `NEXT_PUBLIC_SUPABASE_URL`
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY`
6. Kliknij "Deploy"

### Vercel CLI

```bash
npm i -g vercel
vercel
```

## 🏗️ Deployment na Netlify

1. Idź na [netlify.com](https://netlify.com)
2. Połącz z GitHub
3. Wybierz repozytorium
4. Build command: `npm run build`
5. Publish directory: `out`
6. Dodaj zmienne środowiskowe w ustawieniach

## 🐳 Docker Deployment

```dockerfile
FROM node:18-alpine

WORKDIR /app
COPY package*.json ./
RUN npm ci --only=production
COPY . .
RUN npm run build

EXPOSE 3000
CMD ["npm", "start"]
```

## 📋 Checklist po deployment

- [ ] Skonfigurowana baza danych Supabase
- [ ] Ustawione zmienne środowiskowe
- [ ] Działająca autentykacja użytkowników
- [ ] Działające głosowanie w czasie rzeczywistym
- [ ] Generowanie QR kodów
- [ ] Panel administratora tylko dla zalogowanych

## 🔧 Troubleshooting

### Problem z Supabase
- Sprawdź czy URL i klucze są poprawne
- Upewnij się że tabela `auth.users` istnieje

### Problem z build
```bash
npm run build
```

### Problem z bazą danych
- Sprawdź czy plik `voting.db` jest w `.gitignore`
- Na produkcji użyj PostgreSQL z Supabase 