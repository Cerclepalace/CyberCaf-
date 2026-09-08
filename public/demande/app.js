/**
 * Parcours de demande — Cybercafé²²
 *
 * Accueil → Service → Demande → Coordonnées → Récapitulatif → Confirmation.
 *
 * Regles tenues dans ce fichier :
 *  - aucun service n'est ecrit ici, tout vient de la configuration ;
 *  - rien n'est invente : ce que le projet ne definit pas est affiche comme
 *    non defini, pas comble par un texte plausible ;
 *  - aucune donnee recue n'est inseree en HTML, uniquement par textContent ;
 *  - aucune erreur technique brute n'est montree a l'utilisateur.
 */

const state = {
  catalog: null,
  step: 'accueil',
  service: null,
  answers: {},
  contact: {},
  result: null,
  submitting: false,
};

const screen = document.getElementById('screen');
const alerts = document.getElementById('alerts');
const stepsEl = document.getElementById('steps');

function el(tag, className, text) {
  const node = document.createElement(tag);
  if (className) node.className = className;
  if (text !== undefined) node.textContent = text;
  return node;
}

function alert(message, kind = 'error') {
  const box = el('p', kind === 'unknown' ? 'alert unknown' : 'alert', message);
  return box;
}

function clearAlerts() {
  alerts.replaceChildren();
}

function setStep(step) {
  state.step = step;
  stepsEl.hidden = false;
  for (const item of stepsEl.children) {
    if (item.dataset.step === step) item.setAttribute('aria-current', 'step');
    else item.removeAttribute('aria-current');
  }
  window.scrollTo(0, 0);
  render();
}

/* ---------------------------------------------------------------- champs */

function fieldControl(field, value) {
  let control;
  if (field.type === 'textarea') {
    control = document.createElement('textarea');
  } else if (field.type === 'select') {
    control = document.createElement('select');
    const empty = document.createElement('option');
    empty.value = '';
    empty.textContent = 'Choisissez…';
    control.append(empty);
    for (const option of field.options) {
      const node = document.createElement('option');
      node.value = option.value;
      node.textContent = option.label;
      control.append(node);
    }
  } else {
    control = document.createElement('input');
    control.type = field.type === 'tel' ? 'tel'
      : field.type === 'email' ? 'email'
        : field.type === 'number' ? 'number'
          : field.type === 'date' ? 'date' : 'text';
  }

  control.id = `field-${field.id}`;
  control.name = field.id;
  if (field.maxLength && field.type !== 'select' && field.type !== 'number') {
    control.maxLength = field.maxLength;
  }
  if (value !== undefined && value !== null) control.value = String(value);
  return control;
}

function fieldBlock(field, value) {
  const wrapper = el('div', 'field');
  wrapper.dataset.fieldId = field.id;

  const label = el('label');
  label.htmlFor = `field-${field.id}`;
  label.append(document.createTextNode(field.label));
  if (!field.required) label.append(el('span', 'required', ' (facultatif)'));
  wrapper.append(label);

  if (field.help) wrapper.append(el('span', 'help', field.help));
  wrapper.append(fieldControl(field, value));
  return wrapper;
}

function readFields(fields, form) {
  const values = {};
  for (const field of fields) {
    const control = form.elements.namedItem(field.id);
    if (control) values[field.id] = control.value;
  }
  return values;
}

/** Validation cote client : confort uniquement. Le serveur reste l'autorite. */
function checkRequired(fields, values, form) {
  let firstError = null;
  for (const field of fields) {
    const wrapper = form.querySelector(`[data-field-id="${field.id}"]`);
    if (!wrapper) continue;
    wrapper.classList.remove('has-error');
    const existing = wrapper.querySelector('.field-error');
    if (existing) existing.remove();

    const empty = !values[field.id] || String(values[field.id]).trim() === '';
    if (field.required && empty) {
      wrapper.classList.add('has-error');
      wrapper.append(el('span', 'field-error', `${field.label} est obligatoire.`));
      if (!firstError) firstError = wrapper;
    }
  }
  if (firstError) firstError.scrollIntoView({ block: 'center' });
  return firstError === null;
}

function showServerFieldError(form, fieldId, message) {
  const wrapper = form.querySelector(`[data-field-id="${fieldId}"]`);
  if (!wrapper) return false;
  wrapper.classList.add('has-error');
  const existing = wrapper.querySelector('.field-error');
  if (existing) existing.remove();
  wrapper.append(el('span', 'field-error', message));
  wrapper.scrollIntoView({ block: 'center' });
  return true;
}

/* ---------------------------------------------------------------- écrans */

function renderAccueil() {
  const catalog = state.catalog;

  if (catalog.brand.valueProposition) {
    document.getElementById('claim').textContent = catalog.brand.valueProposition;
  } else {
    document.getElementById('claim').textContent = '';
    alerts.append(alert(
      "Proposition de valeur non définie dans le projet. Elle n'est pas inventée ici.",
      'unknown',
    ));
  }

  if (catalog.brand.howItWorks.length > 0) {
    const how = el('div', 'card');
    how.append(el('h2', null, 'Comment ça marche'));
    const list = document.createElement('ol');
    for (const stepText of catalog.brand.howItWorks) list.append(el('li', null, stepText));
    how.append(list);
    screen.append(how);
  } else {
    alerts.append(alert(
      "Le fonctionnement du service n'est pas décrit dans le projet : information non définie.",
      'unknown',
    ));
  }

  if (catalog.services.length === 0) {
    screen.append(el('div', 'empty'));
    const empty = screen.lastChild;
    empty.append(el('strong', null, 'Aucun service disponible'));
    empty.append(document.createTextNode(
      "Les services du Cybercafé²² ne sont pas encore définis. Ils seront affichés ici dès qu'ils le seront.",
    ));
    return;
  }

  screen.append(el('h2', null, 'Nos services'));
  const list = el('div', 'service-list');
  for (const service of catalog.services) {
    const card = el('div', 'service');
    card.append(el('h3', null, service.name));
    card.append(el('p', null, service.shortDescription));
    list.append(card);
  }
  screen.append(list);

  const actions = el('div', 'actions');
  const start = el('button', 'primary', 'Faire une demande');
  start.type = 'button';
  start.addEventListener('click', () => setStep('service'));
  actions.append(start);
  screen.append(actions);
}

function renderChoixService() {
  screen.append(el('h2', null, 'Choisissez un service'));
  const list = el('div', 'service-list');

  for (const service of state.catalog.services) {
    const card = el('div', 'service');
    card.append(el('h3', null, service.name));
    card.append(el('p', null, service.shortDescription));

    if (service.info.length > 0) {
      const info = document.createElement('ul');
      for (const line of service.info) info.append(el('li', null, line));
      card.append(info);
    }

    const choose = el('button', 'primary', 'Choisir');
    choose.type = 'button';
    choose.addEventListener('click', () => {
      state.service = service;
      state.answers = {};
      state.contact = {};
      setStep('demande');
    });
    card.append(choose);
    list.append(card);
  }

  screen.append(list);
  screen.append(backButton('accueil', "Retour à l'accueil"));
}

function renderFormulaire(kind) {
  const service = state.service;
  const isDemande = kind === 'demande';
  const fields = isDemande ? service.fields : service.contact;
  const values = isDemande ? state.answers : state.contact;

  screen.append(el('h2', null, isDemande ? `${service.name} — votre demande` : 'Vos coordonnées'));

  if (!isDemande) {
    screen.append(el('p', 'muted',
      "Ces informations servent uniquement à vous recontacter au sujet de cette demande."));
  }

  const form = document.createElement('form');
  form.noValidate = true;

  if (fields.length === 0) {
    form.append(el('p', 'muted', 'Aucune information supplémentaire n\'est demandée pour cette étape.'));
  }
  for (const field of fields) form.append(fieldBlock(field, values[field.id]));

  const actions = el('div', 'actions');
  const next = el('button', 'primary', isDemande ? 'Continuer' : 'Vérifier ma demande');
  next.type = 'submit';
  actions.append(next);

  const back = el('button', null, 'Retour');
  back.type = 'button';
  back.addEventListener('click', () => setStep(isDemande ? 'service' : 'demande'));
  actions.append(back);
  form.append(actions);

  form.addEventListener('submit', (event) => {
    event.preventDefault();
    const collected = readFields(fields, form);
    if (!checkRequired(fields, collected, form)) return;
    if (isDemande) state.answers = collected;
    else state.contact = collected;
    setStep(isDemande ? 'contact' : 'recap');
  });

  screen.append(form);
}

function recapBlock(title, fields, values) {
  const wrapper = el('div');
  wrapper.append(el('h3', null, title));
  const dl = document.createElement('dl');
  let any = false;
  for (const field of fields) {
    const raw = values[field.id];
    if (raw === undefined || String(raw).trim() === '') continue;
    any = true;
    dl.append(el('dt', null, field.label));
    let shown = String(raw);
    if (field.type === 'select') {
      const option = field.options.find((candidate) => candidate.value === raw);
      if (option) shown = option.label;
    }
    dl.append(el('dd', null, shown));
  }
  if (!any) dl.append(el('dd', null, 'Rien à afficher'));
  wrapper.append(dl);
  return wrapper;
}

function renderRecap() {
  const service = state.service;
  screen.append(el('h2', null, 'Vérifiez avant d\'envoyer'));

  const recap = el('div', 'recap');

  const chosen = el('div');
  chosen.append(el('h3', null, 'Service choisi'));
  const chosenList = document.createElement('dl');
  chosenList.append(el('dt', null, 'Service'), el('dd', null, service.name));
  chosen.append(chosenList);
  recap.append(chosen);

  recap.append(recapBlock('Votre demande', service.fields, state.answers));
  recap.append(recapBlock('Vos coordonnées', service.contact, state.contact));

  if (service.conditions.length > 0) {
    const conditions = el('div', 'conditions');
    conditions.append(el('strong', null, 'Conditions'));
    const list = document.createElement('ul');
    for (const line of service.conditions) list.append(el('li', null, line));
    conditions.append(list);
    recap.append(conditions);
  }
  screen.append(recap);

  const actions = el('div', 'actions');
  const confirm = el('button', 'primary', 'Confirmer ma demande');
  confirm.type = 'button';
  confirm.disabled = state.submitting;
  confirm.addEventListener('click', () => submit(confirm));
  actions.append(confirm);

  const modify = el('button', null, 'Modifier');
  modify.type = 'button';
  modify.addEventListener('click', () => setStep('demande'));
  actions.append(modify);
  screen.append(actions);
}

function renderConfirmation() {
  const result = state.result;
  const box = el('div', 'confirmation');
  box.append(el('h2', null, 'Votre demande est enregistrée'));
  box.append(el('p', null, 'Notez cette référence, elle identifie votre demande :'));
  box.append(el('p', 'reference', result.reference));

  if (result.nextStep) {
    box.append(el('p', null, result.nextStep));
  } else {
    box.append(el('p', 'muted',
      "La suite du processus n'est pas encore définie dans le projet. Elle n'est pas inventée ici : "
      + "elle sera précisée avant toute mise en service réelle."));
  }

  screen.append(box);

  const actions = el('div', 'actions');
  const again = el('button', null, 'Faire une autre demande');
  again.type = 'button';
  again.addEventListener('click', () => {
    state.service = null;
    state.answers = {};
    state.contact = {};
    state.result = null;
    setStep('accueil');
  });
  actions.append(again);
  screen.append(actions);
}

function backButton(step, label) {
  const actions = el('div', 'actions');
  const back = el('button', null, label);
  back.type = 'button';
  back.addEventListener('click', () => setStep(step));
  actions.append(back);
  return actions;
}

/* ------------------------------------------------------------- envoi */

async function submit(button) {
  state.submitting = true;
  button.disabled = true;
  button.textContent = 'Envoi en cours…';
  clearAlerts();

  try {
    const res = await fetch('/api/requests', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        serviceId: state.service.id,
        answers: state.answers,
        contact: state.contact,
      }),
    });

    let payload = {};
    try {
      payload = await res.json();
    } catch {
      payload = {};
    }

    if (res.status === 201) {
      state.result = payload;
      state.submitting = false;
      setStep('confirmation');
      return;
    }

    // Aucune erreur technique brute n'est affichée : chaque cas a son message.
    if (res.status === 400 && payload.field) {
      alerts.append(alert(
        `${payload.error || 'Une information est incorrecte.'} Revenez en arrière pour la corriger.`,
      ));
    } else if (res.status === 400) {
      alerts.append(alert('Une information saisie est incorrecte. Vérifiez votre demande.'));
    } else if (res.status === 404) {
      alerts.append(alert("Ce service n'est plus disponible. Choisissez-en un autre."));
    } else if (res.status === 503) {
      alerts.append(alert("Aucun service n'est disponible pour le moment. Réessayez plus tard."));
    } else {
      alerts.append(alert(
        "Votre demande n'a pas pu être enregistrée. Rien n'a été envoyé. Réessayez dans un instant.",
      ));
    }
  } catch {
    alerts.append(alert(
      "La connexion a échoué. Votre demande n'a pas été enregistrée. Vérifiez votre connexion et réessayez.",
    ));
  }

  state.submitting = false;
  button.disabled = false;
  button.textContent = 'Confirmer ma demande';
  window.scrollTo(0, 0);
}

/* ------------------------------------------------------------- rendu */

function render() {
  screen.replaceChildren();
  if (state.step !== 'accueil') clearAlerts();

  switch (state.step) {
    case 'accueil': renderAccueil(); break;
    case 'service': renderChoixService(); break;
    case 'demande': renderFormulaire('demande'); break;
    case 'contact': renderFormulaire('contact'); break;
    case 'recap': renderRecap(); break;
    case 'confirmation': renderConfirmation(); break;
    default: renderAccueil();
  }
}

async function start() {
  try {
    const res = await fetch('/api/requests/catalog');
    if (!res.ok) throw new Error('catalogue indisponible');
    state.catalog = await res.json();
  } catch {
    screen.append(alert(
      "Le service est momentanément indisponible. Adressez-vous au comptoir.",
    ));
    return;
  }

  if (state.catalog.brand.name) {
    document.getElementById('brand').textContent = state.catalog.brand.name;
  }
  setStep('accueil');
}

start();
