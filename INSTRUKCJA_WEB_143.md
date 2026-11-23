# ASHEN 0.6 — etap 143: grywalny podgląd webowy

Jest to wersja webowa Testera 130 do publikacji na statycznym hostingu HTTPS, **bez Pythona**. Zawiera aktualną rozgrywkę offline w przeglądarce (wyprawy, przedmioty, warsztat, PvE); **NIE integruje jeszcze logowania, chmury, PvP online ani Supabase**.

## Bezpieczeństwo

Dodałem `js/ashen-web-storage-143.js`. Przekierowuje on dostęp Testera do `localStorage` na klucze z prefiksem `ashen-v060-web143:`. Dzięki temu gra testowa nie może nadpisać zwykłych kluczy `ashen-dev-*` ani `ashen-save-v010` działającej gry. Obsługa dotyczy plików `js/game.js` i `js/ashen-060-tester-bootstrap.js`; nie uruchamiamy w tej wersji modułów serwera.

Wersja ma status PRZEDWDROŻENIOWY: sprawdzono kompletność odwołań do skryptów oraz składnię JS; pełny test ręczny w przeglądarce jest nadal wymagany.

## Wdrożenie

Nie publikuj plików do `main` ani nie podmieniaj `index.html` obecnej gry. Do prezentacji wersji testowej potrzebny jest odrębny hosting lub repozytorium z własnym GitHub Pages. Na tej samej domenie można używać osobnej ścieżki, ponieważ zmieniono przestrzeń kluczy, lecz to nie zastępuje testów w przeglądarce. Sama gałąź GitHub nie jest publiczną stroną Pages.
