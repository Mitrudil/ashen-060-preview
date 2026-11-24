/* ASHEN 0.6 Preview 152: miękkie wagi łupów względem możliwości postaci.
   Brak zmian poziomów/wymagań, brak mutacji źródłowej puli, brak Supabase. */
(function(root, factory) {
  const api = factory();
  if (typeof module === 'object' && module.exports) module.exports = api;
  else root.Ashen060ExpeditionPool152 = api;
})(typeof globalThis !== 'undefined' ? globalThis : this, function() {
  'use strict';
  function adapt(pool, level, baseAttrs, rules) {
    if (!Array.isArray(pool) || !rules || typeof rules.requirements !== 'function')
      throw new Error('Brak puli lub reguł wymagań ASHEN 0.6.');
    return pool.map(entry => {
      if (!entry || typeof entry.id !== 'string' || !Number.isFinite(entry.w) || entry.w <= 0)
        throw new Error('Nieprawidłowa waga łupu.');
      // Unikaty/artefakty poza katalogiem pozostają poza modyfikacją.
      if (!rules.isModernId(entry.id)) return {...entry};
      const check = rules.requirements(entry.id, level, baseAttrs);
      if (check.ok) return {...entry};
      // Osobno sprawdzamy poziom; wymaganie atrybutu porównujemy dopiero, gdy poziom wystarcza.
      const reqLevelOk = rules.requirements(entry.id, level, {str:999,dex:999,end:999,per:999,int:999,cha:999}).ok;
      const multiplier = reqLevelOk ? 0.10 : 0.025;
      return {...entry, w:entry.w * multiplier};
    });
  }
  return Object.freeze({adapt});
});
