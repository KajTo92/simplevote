# 🔢 Migracja bazy danych - Limity głosów dla planów

## 📋 Przegląd

Ta migracja dodaje funkcjonalność limitów głosów dla różnych planów cenowych:
- **Darmowy plan**: 5 głosów
- **Plan Pro**: 25 głosów  
- **Plan Enterprise**: Unlimited głosy

## ⚠️ WAŻNE: Wykonaj przed wdrożeniem

Ta migracja musi być wykonana **PRZED** wdrożeniem nowej wersji aplikacji.

## 🔧 Krok 1: Dodaj pole user_id do tabeli polls

1. Otwórz **SQL Editor** w Supabase Dashboard
2. Skopiuj i wykonaj poniższy SQL:

```sql
-- Dodaj kolumnę user_id do tabeli polls
ALTER TABLE polls ADD COLUMN IF NOT EXISTS user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE;

-- Utworz indeks dla wydajności
CREATE INDEX IF NOT EXISTS idx_polls_user_id ON polls(user_id);
```

## 🔧 Krok 2: Zaktualizuj zasady RLS

```sql
-- Usuń stare zasady RLS dla polls
DROP POLICY IF EXISTS "Anyone can read active polls" ON polls;
DROP POLICY IF EXISTS "Authenticated users can manage polls" ON polls;

-- Dodaj nowe zasady RLS
CREATE POLICY "Anyone can read active polls" ON polls
FOR SELECT USING (is_active = true);

CREATE POLICY "Users can manage their own polls" ON polls
FOR ALL USING (auth.uid() = user_id);
```

## 🔧 Krok 3: Dodaj funkcje sprawdzania limitów

```sql
-- Funkcja do sprawdzania limitów głosów użytkownika
CREATE OR REPLACE FUNCTION get_user_total_votes(user_uuid UUID)
RETURNS INTEGER AS $$
DECLARE
    total_votes INTEGER;
BEGIN
    SELECT COUNT(v.id) INTO total_votes
    FROM votes v
    JOIN poll_options po ON v.option_id = po.id
    JOIN polls p ON po.poll_id = p.id
    WHERE p.user_id = user_uuid;
    
    RETURN COALESCE(total_votes, 0);
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Funkcja do sprawdzania planu użytkownika
CREATE OR REPLACE FUNCTION get_user_plan(user_uuid UUID)
RETURNS TEXT AS $$
DECLARE
    user_plan TEXT;
BEGIN
    SELECT plan INTO user_plan
    FROM subscriptions
    WHERE user_id = user_uuid AND status = 'active'
    ORDER BY created_at DESC
    LIMIT 1;
    
    RETURN COALESCE(user_plan, 'free');
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Funkcja do sprawdzania limitu głosów
CREATE OR REPLACE FUNCTION check_vote_limit(user_uuid UUID)
RETURNS BOOLEAN AS $$
DECLARE
    current_votes INTEGER;
    user_plan TEXT;
    vote_limit INTEGER;
BEGIN
    -- Pobierz aktualną liczbę głosów
    current_votes := get_user_total_votes(user_uuid);
    
    -- Pobierz plan użytkownika
    user_plan := get_user_plan(user_uuid);
    
    -- Ustaw limit na podstawie planu
    CASE user_plan
        WHEN 'free' THEN vote_limit := 5;
        WHEN 'pro' THEN vote_limit := 25;
        WHEN 'enterprise' THEN vote_limit := 999999; -- unlimited
        ELSE vote_limit := 5; -- default to free
    END CASE;
    
    RETURN current_votes < vote_limit;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
```

## 🔧 Krok 4: Przypisz istniejące głosowania do użytkowników

⚠️ **UWAGA**: Jeśli masz już istniejące głosowania, musisz je przypisać do użytkowników.

### Opcja A: Przypisz wszystkie do jednego admina

```sql
-- Znajdź pierwszego użytkownika (admina)
-- Zastąp 'admin@example.com' swoim emailem
UPDATE polls 
SET user_id = (
    SELECT id FROM auth.users 
    WHERE email = 'admin@example.com' 
    LIMIT 1
)
WHERE user_id IS NULL;
```

### Opcja B: Usuń istniejące głosowania (jeśli to środowisko testowe)

```sql
-- UWAGA: To usunie wszystkie głosowania!
DELETE FROM votes;
DELETE FROM poll_options;
DELETE FROM polls;
```

## ✅ Krok 5: Weryfikacja

Sprawdź czy wszystko działa:

```sql
-- Sprawdź czy funkcje istnieją
SELECT routine_name 
FROM information_schema.routines 
WHERE routine_name IN ('get_user_total_votes', 'get_user_plan', 'check_vote_limit');

-- Sprawdź czy kolumna user_id została dodana
SELECT column_name, data_type 
FROM information_schema.columns 
WHERE table_name = 'polls' AND column_name = 'user_id';

-- Test funkcji (zastąp UUID swoim user_id)
SELECT get_user_total_votes('your-user-uuid-here');
SELECT get_user_plan('your-user-uuid-here');
SELECT check_vote_limit('your-user-uuid-here');
```

## 🚀 Krok 6: Wdrożenie aplikacji

Po pomyślnym wykonaniu migracji możesz wdrożyć nową wersję aplikacji.

## 🧪 Testowanie

1. **Utwórz nowe głosowanie** - powinno być przypisane do zalogowanego użytkownika
2. **Sprawdź limity w admin panelu** - powinna pokazać się sekcja z limitami
3. **Przetestuj głosowanie** - po przekroczeniu limitu powinien pojawić się komunikat
4. **Przetestuj przyciski +/-** - powinny być zablokowane przy przekroczeniu limitu

## 🐛 Rozwiązywanie problemów

### Błąd: "relation polls does not exist"
- Sprawdź czy wykonałeś podstawową konfigurację z `SUPABASE_DATABASE_SETUP.md`

### Błąd: "function get_user_total_votes does not exist"
- Upewnij się że wykonałeś wszystkie funkcje z Kroku 3

### Błąd: "column user_id does not exist"
- Wykonaj ponownie Krok 1

### Głosowania nie pokazują się w admin panelu
- Sprawdź czy zostały przypisane do użytkownika (Krok 4)
- Sprawdź czy zasady RLS zostały zaktualizowane (Krok 2)

## 📚 Struktura po migracji

```
polls table:
├── id (UUID)
├── title (TEXT)
├── user_id (UUID) ← NOWE POLE
├── is_active (BOOLEAN)
├── display_settings (JSONB)
├── logo_url (TEXT)
├── created_at (TIMESTAMPTZ)
└── updated_at (TIMESTAMPTZ)

Nowe funkcje:
├── get_user_total_votes(UUID) → INTEGER
├── get_user_plan(UUID) → TEXT
└── check_vote_limit(UUID) → BOOLEAN
``` 