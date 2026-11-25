# ASHEN — JEDNA GRA · darmowy podgląd online

To **wydanie testowe PvE z lokalnym zapisem**, zbudowane z tego samego głównego `index.html` i skryptu `js/game.js` co aktualna gra. Nie jest to nowa odrębna gra.

## Publikowanie za 0 zł, bez ryzyka dla istniejącego ASHEN

1. Użyj **oddzielnego publicznego repozytorium** GitHub, np. `ashen-060-preview` (nie `Mitrudil/ashen-game`), aby nie dotknąć obecnego GitHub Pages.
2. Wgraj **zawartość** tego archiwum do katalogu głównego repozytorium, nie folder opakowujący.
3. W Settings → Pages ustaw Deploy from a branch → `main` → `/ (root)`.
4. Po opublikowaniu adres powinien mieć postać `https://<username>.github.io/ashen-060-preview/` — to wzór, nie potwierdzony działający URL.
5. Otwórz grę i zweryfikuj: utworzenie postaci, wyprawę, zapis, odświeżenie, eksport JSON, przywrócenie.

## Granice tej wersji

- **BRAK Supabase i brak logowania**: nie ma skryptu CDN ani konfiguracji Beta.
- Zapis istnieje wyłącznie **w localStorage dla konkretnego adresu strony i przeglądarki**. Adres nowej wersji nie odziedziczy starego localStorage; potrzebny jest eksport/import JSON.
- GitHub Pages wymaga publicznego repozytorium dla planu Free; kod i grafiki z tego pakietu staną się publiczne.
- Nie zawiera starszych skryptów PvP, klanów, danych osobowych ani backupów baz.
- Zmiana domeny lub ścieżki GitHub Pages nie przeniesie zapisu automatycznie.
- Ścieżki względne pozwalają działać pod podścieżką repozytorium, ale test na rzeczywistym GitHub Pages nie został wykonany.
- **Żadnych zmian** w produkcyjnym ASHEN, w Supabase ani głównym repozytorium.
