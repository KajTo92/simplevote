# Konfiguracja Supabase dla Prostego Głosowania

## 🚀 Krok 1: Utwórz projekt Supabase

1. Idź na [supabase.com](https://supabase.com)
2. Zaloguj się lub utwórz konto
3. Kliknij "New Project"
4. Wybierz organizację i nazwij projekt (np. "simple-voting")
5. Wybierz region (najlepiej Europa dla polskich użytkowników)
6. Utwórz hasło dla bazy danych
7. Poczekaj na utworzenie projektu (2-3 minuty)

## 🔧 Krok 2: Pobierz klucze API

1. W dashboardzie Supabase przejdź do **Settings** → **API**
2. Skopiuj następujące wartości:
   - **Project URL** (przykład: `https://abcdefghijk.supabase.co`)
   - **anon public** key (długi klucz zaczynający się od `eyJhbGciOiJIUzI1NiI...`)

## 📁 Krok 3: Skonfiguruj zmienne środowiskowe

1. Utwórz plik `.env.local` w głównym katalogu projektu
2. Dodaj następujące zmienne:

```bash
# Supabase Configuration
NEXT_PUBLIC_SUPABASE_URL=https://twoj-projekt-id.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=twoj-anon-key

# Opcjonalnie (dla zaawansowanych funkcji)
SUPABASE_SERVICE_ROLE_KEY=twoj-service-role-key
```

**⚠️ Ważne**: Zastąp `twoj-projekt-id` i klucze własnymi wartościami z dashboardu Supabase.

## 🔐 Krok 4: Skonfiguruj autentykację

1. W dashboardie Supabase przejdź do **Authentication** → **Settings**
2. W sekcji **Site URL** dodaj:
   ```
   http://localhost:3000
   ```
3. W sekcji **Redirect URLs** dodaj:
   ```
   http://localhost:3000/auth/callback
   ```

### Dla produkcji (po deployment)
Dodaj również URLs Twojej produkcyjnej domeny:
- Site URL: `https://twoja-domena.com`
- Redirect URL: `https://twoja-domena.com/auth/callback`

## 📧 Krok 5: Skonfiguruj email (opcjonalne)

### Opcja A: Użyj domyślnego Supabase
- Supabase automatycznie skonfiguruje wysyłanie emaili
- Emaile będą wysyłane z domeny Supabase
- To wystarczy do testowania

### Opcja B: Własny dostawca email (dla produkcji)
1. Przejdź do **Authentication** → **Settings** → **SMTP Settings**
2. Skonfiguruj własny serwer SMTP (np. SendGrid, Mailgun)
3. Dostosuj szablony emaili w sekcji **Email Templates**

## 🎨 Krok 6: Dostosuj szablony email (opcjonalne)

1. Przejdź do **Authentication** → **Email Templates**
2. Dostosuj szablony dla:
   - **Confirm signup** - potwierdzenie rejestracji
   - **Magic Link** - link do logowania
   - **Change Email Address** - zmiana adresu email
   - **Reset Password** - reset hasła

## 🚀 Krok 7: Testowanie

1. Uruchom aplikację lokalnie:
   ```bash
   npm run dev
   ```

2. Otwórz `http://localhost:3000`

3. Kliknij ikonę ⚙️ w prawym górnym rogu

4. Spróbuj się zarejestrować z prawdziwym adresem email

5. Sprawdź skrzynkę odbiorczą i kliknij link aktywacyjny

6. Zaloguj się do panelu administratora

## 🔒 Zabezpieczenia

### Row Level Security (RLS)
Supabase automatycznie zabezpiecza dane. Jeśli planujesz rozszerzyć aplikację o własne tabele:

1. Przejdź do **Database** → **Tables**
2. Dla każdej tabeli włącz **Row Level Security**
3. Utwórz zasady (policies) dostępu do danych

### Przykładowe zasady dla tabeli `polls`:
```sql
-- Tylko zalogowani użytkownicy mogą tworzyć głosowania
CREATE POLICY "Users can create polls" ON polls
FOR INSERT TO authenticated
WITH CHECK (auth.uid() = user_id);

-- Wszyscy mogą czytać aktywne głosowania
CREATE POLICY "Anyone can read active polls" ON polls
FOR SELECT USING (is_active = true);
```

## 🌐 Deployment na Vercel

1. Pushuj kod do GitHuba
2. Połącz repozytorium z Vercel
3. Dodaj zmienne środowiskowe w ustawieniach Vercel:
   - `NEXT_PUBLIC_SUPABASE_URL`
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY`
4. Zaktualizuj URLs w ustawieniach Supabase

## 💡 Wskazówki

- **Nigdy nie commituj pliku `.env.local`** (jest już w `.gitignore`)
- **Klucze anon są bezpieczne** do użycia w frontend (mają ograniczone uprawnienia)
- **Service role key** używaj tylko w backend/serverless functions
- **Testuj na localhost** przed wdrożeniem na produkcję

## 🆘 Rozwiązywanie problemów

### Błąd: "Invalid login credentials"
- Sprawdź czy adres email został potwierdzony
- Upewnij się, że hasło spełnia wymagania

### Błąd: "Invalid Project URL"
- Sprawdź URL w `.env.local`
- Upewnij się, że projekt Supabase jest aktywny

### Błąd: "Invalid API key"
- Sprawdź klucz anon w `.env.local`
- Zregeneruj klucz w razie potrzeby

### Nie otrzymałeś emaila aktywacyjnego?
- Sprawdź folder spam
- Upewnij się, że SMTP jest skonfigurowany
- Sprawdź logi w dashboardzie Supabase

## 📚 Przydatne linki

- [Dokumentacja Supabase](https://supabase.com/docs)
- [Przewodnik Next.js + Supabase](https://supabase.com/docs/guides/getting-started/quickstarts/nextjs)
- [Konfiguracja Auth](https://supabase.com/docs/guides/auth)
- [Dashboard Supabase](https://app.supabase.com/) 