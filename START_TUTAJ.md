# ASHEN 0.6 — Etap 149: osobna strona testowa

**Status:** grywalny Tester offline 130, przygotowany do GitHub Pages. To NIE jest jeszcze właściwa gra online po migracji i NIE zawiera logowania ani synchronizacji Supabase.

## Publikacja (bez Pythona)

1. Na GitHub utwórz **NOWE publiczne repozytorium**, np. `ashen-060-preview`. Nie korzystaj z `Mitrudil/ashen-game` i nie podmieniaj jego `main`.
2. Rozpakuj ZIP i wgraj jego zawartość (zachowując katalogi `assets`, `css`, `data`, `js`) do głównego katalogu nowego repozytorium. `index.html` musi być w katalogu głównym.
3. W nowym repozytorium przejdź do **Settings > Pages > Build and deployment**, wybierz **Deploy from a branch**, `main`, folder `/ (root)`, kliknij Save.
4. Po zakończeniu publikacji strona powinna być pod `https://mitrudil.github.io/ashen-060-preview/`, o ile repozytorium nazwano dokładnie jak w przykładzie, konto ma nazwę Mitrudil i GitHub Pages jest włączone. Adres nie jest jeszcze potwierdzony jako działający.

Nie dodawaj zmiennych środowiskowych, kluczy Supabase ani własnych danych do nowego repozytorium. Nie próbuj kopiować prawdziwych zapisów z gry online. Tester ma osobny zapis lokalny i nie aktualizuje istniejących postaci.

**Przed połączeniem z rzeczywistą grą:** niezbędne testy przeglądarkowe gry, zapis/odczyt, regresja PvP i klanów, testy serwerowe i bezpieczny plan migracji.
