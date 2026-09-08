/**
 * Donnees d'exemple.
 *
 * Sert uniquement a verifier que la chaine complete fonctionne et que
 * l'interface s'affiche. Ces chiffres ne decrivent aucun etablissement reel :
 * ils sont generes, et l'interface les signale comme tels.
 */
function seededRandom(seed) {
  let state = seed;
  return () => {
    state = (state * 1103515245 + 12345) % 2147483648;
    return state / 2147483648;
  };
}

export const sampleAdapter = {
  name: 'sample',
  label: "Donnees d'exemple",
  status: 'available',
  description: "Jeu genere pour verifier l'affichage. Ne represente aucun etablissement reel.",

  /** @returns {Promise<Record<string,string>[]>} */
  async read({ days = 30, endDay = new Date().toISOString().slice(0, 10) } = {}) {
    const random = seededRandom(20260908);
    const rows = [];
    const end = new Date(`${endDay}T00:00:00Z`);

    for (let offset = days - 1; offset >= 0; offset -= 1) {
      const date = new Date(end);
      date.setUTCDate(date.getUTCDate() - offset);
      const day = date.toISOString().slice(0, 10);
      const weekday = date.getUTCDay();
      if (weekday === 0) continue; // ferme le dimanche, dans cet exemple

      const load = weekday === 6 ? 0.6 : 1;
      rows.push({ date: day, categorie: 'print', quantite: String(Math.round((40 + random() * 60) * load)), unite: 'page' });
      rows.push({ date: day, categorie: 'copy', quantite: String(Math.round((10 + random() * 25) * load)), unite: 'page' });
      rows.push({ date: day, categorie: 'scan', quantite: String(Math.round(random() * 12 * load)), unite: 'item' });
      rows.push({ date: day, categorie: 'session', quantite: String(Math.round((60 + random() * 180) * load)), unite: 'minute' });
    }
    return rows;
  },
};
