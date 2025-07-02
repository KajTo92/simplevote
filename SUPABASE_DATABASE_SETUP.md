# 🗄️ Konfiguracja Bazy Danych Supabase dla Głosowań

## 📋 Przegląd

Ta aplikacja wymaga 3 tabel w bazie danych Supabase PostgreSQL:
- `polls` - główne głosowania  
- `poll_options` - opcje do głosowania
- `votes` - zapisane głosy użytkowników

## 🔧 Konfiguracja - Krok po kroku

### 1. Otwórz SQL Editor w Supabase

1. Idź do [Supabase Dashboard](https://supabase.com/dashboard)
2. Wybierz swój projekt (`rcuwkchwbvdgaahzqbnr`)
3. W menu bocznym kliknij **SQL Editor**
4. Kliknij **New Query**

### 2. Wykonaj SQL do utworzenia tabel

**Skopiuj i wklej poniższy SQL:**

```sql
-- Usuń istniejące tabele (jeśli istnieją)
DROP TABLE IF EXISTS votes;
DROP TABLE IF EXISTS poll_options; 
DROP TABLE IF EXISTS polls;

-- Tabela głównych głosowań
CREATE TABLE polls (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    title TEXT NOT NULL,
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Tabela opcji głosowania
CREATE TABLE poll_options (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    poll_id UUID NOT NULL REFERENCES polls(id) ON DELETE CASCADE,
    text TEXT NOT NULL,
    color TEXT NOT NULL,
    order_index INTEGER NOT NULL
);

-- Tabela głosów
CREATE TABLE votes (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    poll_id UUID NOT NULL REFERENCES polls(id) ON DELETE CASCADE,
    option_id UUID NOT NULL REFERENCES poll_options(id) ON DELETE CASCADE,
    voter_fingerprint TEXT NOT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE(poll_id, voter_fingerprint)
);

-- Indeksy dla wydajności
CREATE INDEX idx_polls_created_at ON polls(created_at DESC);
CREATE INDEX idx_poll_options_poll_id ON poll_options(poll_id);
CREATE INDEX idx_votes_poll_id ON votes(poll_id);
CREATE INDEX idx_votes_option_id ON votes(option_id);

-- View do liczenia głosów (opcjonalnie)
CREATE VIEW votes_count AS
SELECT 
    poll_id,
    option_id,
    COUNT(*) as count
FROM votes 
GROUP BY poll_id, option_id;

-- Funkcja do automatycznego aktualizowania updated_at
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Trigger dla automatycznego updated_at
CREATE TRIGGER update_polls_updated_at 
    BEFORE UPDATE ON polls 
    FOR EACH ROW 
    EXECUTE FUNCTION update_updated_at_column();
```

### 3. Wykonaj zapytanie

1. **Kliknij "Run"** w prawym dolnym rogu
2. **Sprawdź wyniki** - powinieneś zobaczyć "Success. No rows returned"
3. **Sprawdź tabele** - przejdź do **Table Editor** i sprawdź czy tabele zostały utworzone

### 4. Konfiguruj Row Level Security (RLS)

**W tym samym SQL Editor wykonaj:**

```sql
-- Włącz RLS dla wszystkich tabel
ALTER TABLE polls ENABLE ROW LEVEL SECURITY;
ALTER TABLE poll_options ENABLE ROW LEVEL SECURITY;  
ALTER TABLE votes ENABLE ROW LEVEL SECURITY;

-- Zasady dostępu - wszyscy mogą czytać aktywne głosowania
CREATE POLICY "Anyone can read active polls" ON polls
FOR SELECT USING (is_active = true);

CREATE POLICY "Anyone can read poll options" ON poll_options
FOR SELECT USING (
    EXISTS (
        SELECT 1 FROM polls 
        WHERE polls.id = poll_options.poll_id 
        AND polls.is_active = true
    )
);

CREATE POLICY "Anyone can read votes" ON votes
FOR SELECT USING (
    EXISTS (
        SELECT 1 FROM polls 
        WHERE polls.id = votes.poll_id 
        AND polls.is_active = true
    )
);

-- Zasady zapisu - wszyscy mogą głosować
CREATE POLICY "Anyone can vote" ON votes
FOR INSERT WITH CHECK (
    EXISTS (
        SELECT 1 FROM polls 
        WHERE polls.id = votes.poll_id 
        AND polls.is_active = true
    )
);

-- Tylko uwierzytelnieni użytkownicy mogą zarządzać głosowaniami
CREATE POLICY "Authenticated users can manage polls" ON polls
FOR ALL USING (auth.role() = 'authenticated');

CREATE POLICY "Authenticated users can manage poll options" ON poll_options  
FOR ALL USING (auth.role() = 'authenticated');

CREATE POLICY "Authenticated users can manage votes" ON votes
FOR ALL USING (auth.role() = 'authenticated');
```

## ✅ Weryfikacja

Po wykonaniu SQL sprawdź:

1. **Table Editor** → Powinieneś zobaczyć 3 tabele: `polls`, `poll_options`, `votes`
2. **SQL Editor** → Wykonaj test: `SELECT * FROM polls;` (powinno zwrócić pustą tabelę)

## 🚀 Test funkcjonalności

Po deployment aplikacji:

1. **Utwórz głosowanie** w panelu administratora
2. **Sprawdź tabele** w Supabase - powinny zawierać dane
3. **Przetestuj głosowanie** z telefonu

## 🔧 Troubleshooting

### Błąd: "relation polls does not exist"
- Sprawdź czy SQL został wykonany poprawnie
- Sprawdź czy jesteś w odpowiednim projekcie Supabase

### Błąd: "permission denied"
- Sprawdź zasady RLS
- Upewnij się, że jesteś zalogowany jako admin

### Błąd przy głosowaniu
- Sprawdź czy tabela `votes` ma ograniczenie UNIQUE
- Sprawdź logi w Supabase Dashboard → Logs

## 📚 Przydatne komendy SQL

```sql
-- Sprawdź ile głosowań
SELECT COUNT(*) FROM polls;

-- Zobacz wszystkie głosowania z opcjami
SELECT p.title, po.text, COUNT(v.id) as votes
FROM polls p
LEFT JOIN poll_options po ON p.id = po.poll_id  
LEFT JOIN votes v ON po.id = v.option_id
GROUP BY p.title, po.text
ORDER BY p.created_at DESC;

-- Usuń wszystkie dane (UWAGA!)
DELETE FROM votes;
DELETE FROM poll_options;
DELETE FROM polls;
```

Po wykonaniu tych kroków, aplikacja będzie używać Supabase PostgreSQL zamiast SQLite! 🎉 