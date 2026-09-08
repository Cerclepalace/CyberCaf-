/**
 * Adaptateurs en attente du terrain.
 *
 * Ils existent pour que leur emplacement dans l'architecture soit visible, et
 * pour qu'aucune autre partie du code n'ait a changer le jour ou ils seront
 * ecrits. Ils ne contiennent aucune supposition sur le systeme reel : ni URL,
 * ni format, ni authentification, ni marque de logiciel.
 *
 * Les ecrire maintenant reviendrait a inventer l'infrastructure.
 */

export class AdapterNotConfiguredError extends Error {
  constructor(name, missing) {
    super(`adaptateur ${name} non configure. Informations manquantes : ${missing.join(', ')}`);
    this.name = 'AdapterNotConfiguredError';
    this.adapter = name;
    this.missing = missing;
  }
}

export const apiAdapter = {
  name: 'api',
  label: 'API distante',
  status: 'pending-terrain',
  description: "En attente de la visite : aucune API n'a ete identifiee.",
  missing: [
    'existence d une API',
    'adresse et protocole',
    'mode d authentification',
    'format et granularite des donnees',
    'frequence d interrogation acceptable',
  ],
  async read() {
    throw new AdapterNotConfiguredError('api', this.missing);
  },
};

export const posAdapter = {
  name: 'pos',
  label: 'Logiciel de caisse',
  status: 'pending-terrain',
  description: "En attente de la visite : le logiciel de caisse n'est pas identifie.",
  missing: [
    'marque et version du logiciel de caisse',
    'capacite d export reelle, verifiee sur place',
    'format du fichier produit',
    'declenchement manuel ou automatique',
    'acces reseau ou support amovible',
    'stabilite du format entre versions',
  ],
  async read() {
    throw new AdapterNotConfiguredError('pos', this.missing);
  },
};
