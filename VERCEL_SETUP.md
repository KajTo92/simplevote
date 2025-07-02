# 🚀 Konfiguracja Vercel

## Zmienne środowiskowe do dodania w Vercel Dashboard

### Settings → Environment Variables

Dodaj następujące zmienne (wszystkie dla środowisk: Production, Preview, Development):

#### 1. Supabase URL
- **Name**: `NEXT_PUBLIC_SUPABASE_URL`
- **Value**: `https://rcuwkchwbvdgaahzqbnr.supabase.co`
- **Environments**: ✅ Production ✅ Preview ✅ Development

#### 2. Supabase Anon Key
- **Name**: `NEXT_PUBLIC_SUPABASE_ANON_KEY`
- **Value**: `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InJjdXdrY2h3YnZkZ2FhaHpxYm5yIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MzQ5OTg0MzcsImV4cCI6MjA1MDU3NDQzN30.TKvTNXL1BFUy6kpQMmPrUw5atyf4Pz-XvTUGLJUh8z4`
- **Environments**: ✅ Production ✅ Preview ✅ Development

#### 3. App URL (dla QR kodów)
- **Name**: `NEXT_PUBLIC_APP_URL`
- **Value**: `https://simplevote-ten.vercel.app`
- **Environments**: ✅ Production ✅ Preview ✅ Development

## 🔄 Po dodaniu zmiennych:

1. **Kliknij "Save"** dla każdej zmiennej
2. **Idź do Deployments tab**
3. **Kliknij "Redeploy"** na najnowszym deployment
4. **Lub wyślij nowy commit** - Vercel automatycznie przebuduje

## ✅ Testowanie:

Po redeployment:
- Strona powinna działać: https://simplevote-ten.vercel.app
- QR kody będą kierować na właściwą domenę Vercel
- Autentykacja Supabase będzie działać

## 🔧 Troubleshooting:

### Jeśli nadal błędy:
1. Sprawdź czy wszystkie 3 zmienne są dodane
2. Sprawdź czy są ustawione dla wszystkich środowisk
3. Zrób redeploy
4. Sprawdź logi w Vercel Dashboard → Functions tab

### Supabase Authentication:
- W Supabase Dashboard → Authentication → URL Configuration
- Dodaj `https://simplevote-ten.vercel.app` jako dozwolony URL 