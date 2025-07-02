# Proste Głosowanie - SaaS

Aplikacja do głosowania w czasie rzeczywistym, idealna dla spotkań firmowych, eventów i warsztatów.

## ✨ Funkcje

- **Minimalistyczny interfejs** - Czysta, piękna strona główna
- **Autentykacja Supabase** - Bezpieczne logowanie i rejestracja 🔐
- **Panel administratora** - Łatwe tworzenie głosowań dla zalogowanych użytkowników
- **QR kody** - Uczestnicy dołączają przez skanowanie
- **Wyniki na żywo** - Automatyczne odświeżanie wyników
- **Responsywny design** - Działa na wszystkich urządzeniach
- **Zabezpieczenia** - Jeden głos na urządzenie + ochrona panelu administratora
- **Gotowe do SaaS** - Łatwe dodanie płatności i subskrypcji

## 🚀 Szybki start

### Wymagania
- Node.js 18+ 
- npm lub yarn
- Konto Supabase (darmowe)

### Instalacja

1. **Sklonuj repozytorium**
```bash
git clone <twoje-repo>
cd simple-voting-display
```

2. **Zainstaluj zależności**
```bash
npm install
```

3. **Skonfiguruj Supabase** 📋
```bash
# Utwórz plik .env.local i dodaj swoje klucze Supabase:
NEXT_PUBLIC_SUPABASE_URL=https://twoj-projekt-id.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=twoj-anon-key
```

> **📚 Szczegółowa instrukcja**: Zobacz plik `SUPABASE_SETUP.md` dla kompletnego przewodnika konfiguracji Supabase.

4. **Uruchom aplikację**
```bash
npm run dev
```

5. **Otwórz w przeglądarce**
```
http://localhost:3000
```

## 📱 Jak używać

### 1. Strona główna
- Minimalistyczna strona powitalna
- Ikona ⚙️ w prawym górnym rogu prowadzi do logowania

### 2. Autentykacja (`/auth/login`, `/auth/register`)
- Bezpieczne logowanie przez Supabase
- Rejestracja z potwierdzeniem email
- Zabezpieczony dostęp do panelu administratora

### 3. Panel administratora (`/admin`) 🔒
- **Tylko dla zalogowanych użytkowników**
- Tworzenie nowych głosowań
- Zarządzanie istniejącymi głosowaniami
- Przegląd wyników w czasie rzeczywistym
- Wylogowanie i info o użytkowniku

### 3. Ekran głosowania (`/poll/[id]`)
- Wyświetla pytanie i wyniki na żywo
- QR kod dla uczestników
- Instruktażowe kroki dla uczestników
- Animacje dla prowadzącej opcji

### 4. Strona uczestnika (`/vote/[id]`)
- Mobilny interfejs do głosowania
- Jednorazowy dostęp - po zagłosowaniu pokazuje wyniki
- Zabezpieczenie przed wielokrotnym głosowaniem

## 🛠 Technologie

- **Frontend**: Next.js 14, React, TypeScript
- **Autentykacja**: Supabase Auth 🔐
- **Styling**: Tailwind CSS
- **Baza danych**: SQLite (lokalne głosowania) + Supabase (użytkownicy)
- **QR kody**: qrcode library
- **Ikony**: Lucide React

## 📊 Struktura bazy danych

### Tabela `polls`
- `id` - Unicalny identyfikator głosowania
- `title` - Tytuł/pytanie
- `is_active` - Status aktywności
- `created_at`, `updated_at` - Znaczniki czasu

### Tabela `poll_options`
- `id` - Unikalny identyfikator opcji
- `poll_id` - Odniesienie do głosowania
- `text` - Tekst opcji
- `color` - Kolor słupka
- `order_index` - Kolejność wyświetlania

### Tabela `votes`
- `id` - Unikalny identyfikator głosu
- `poll_id` - Odniesienie do głosowania
- `option_id` - Wybrana opcja
- `voter_fingerprint` - Fingerprint użytkownika (zabezpieczenie)
- `created_at` - Czas głosowania

## 🔧 API Endpoints

### `GET /api/polls`
Pobiera wszystkie głosowania

### `POST /api/polls`
Tworzy nowe głosowanie
```json
{
  "title": "Tytuł pytania",
  "options": ["Opcja 1", "Opcja 2", "Opcja 3"]
}
```

### `GET /api/polls/[id]`
Pobiera konkretne głosowanie z wynikami

### `POST /api/vote`
Dodaje głos
```json
{
  "pollId": "uuid",
  "optionId": "uuid",
  "voterFingerprint": "fingerprint"
}
```

## 🎨 Customizacja

### Kolory opcji
Kolory słupków są automatycznie przypisywane z palety w `lib/database.ts`:
```javascript
const colors = [
  '#3B82F6', '#EF4444', '#10B981', '#F59E0B', 
  '#8B5CF6', '#EC4899', '#06B6D4', '#84CC16'
];
```

### Stylowanie
Style można modyfikować w:
- `app/globals.css` - Globalne style
- `tailwind.config.js` - Konfiguracja Tailwind

## 🚀 Deployment

### Vercel (Rekomendowane)
1. Połącz swoje repozytorium z Vercel
2. Vercel automatycznie wykryje Next.js
3. Deploy zostanie wykonany automatycznie

### Inne platformy
Aplikacja jest standardową aplikacją Next.js i może być wdrożona na:
- Netlify
- Railway  
- DigitalOcean
- AWS

**⚠️ Uwaga**: Na produkcji zastąp SQLite bazą PostgreSQL lub MySQL dla lepszej wydajności.

## 🔒 Bezpieczeństwo

- **Stabilny Fingerprinting**: Każde urządzenie/przeglądarka może głosować tylko raz
  - Wykorzystuje cechy urządzenia (rozdzielczość, przeglądarka, język, etc.)
  - Persistentny w localStorage - pamiętane między sesjami
  - Obsługuje wiele urządzeń na jednym głosowaniu
  - Fallback dla trybu incognito/prywatnego
- **Walidacja**: Wszystkie dane wejściowe są walidowane
- **Sanityzacja**: Zapobieganie atakom XSS
- **Rate limiting**: Można dodać ograniczenia żądań
- **Opcje deweloperskie**: Reset możliwości głosowania dla testów

## 📞 Wsparcie

W razie problemów:
1. Sprawdź konsolę przeglądarki pod kątem błędów
2. Upewnij się, że baza danych jest dostępna
3. Zrestartuj serwer deweloperski

## 📄 Licencja

MIT License - możesz swobodnie używać, modyfikować i dystrybuować. 