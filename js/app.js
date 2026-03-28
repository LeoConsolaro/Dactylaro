const $ = id => document.getElementById(id);
const d = $('duration'), b = $('start'), w = $('words'), i = $('input'),
    t = $('time'), s = $('score'), r = $('rank'), doneEl = $('done'), state = $('state');

let list = [], word = '', done = 0, left = 0, timer = 0, rank = [];

// Génère une liste de 'n' mots aléatoires
const pick = n => Array.from({ length: n }, () => WORDS[Math.floor(Math.random() * WORDS.length)]);

// Affiche les mots dans la balise #words et gère le soulignement/couleur
const draw = () => {
    w.innerHTML = list.map((x, k) =>
        `<span class="${k < done ? 'done' : k === done ? 'current' : ''}">${x}</span>`
    ).join(' ');
};

// Met à jour l'affichage du classement
const board = () => r.innerHTML = rank.map(x => `<li>${x} MPM</li>`).join('');

// Termine la session et calcule le score
const end = () => {
    clearInterval(timer);
    i.disabled = true;
    i.value = '';
    state.textContent = 'Session terminée';

    // Calcul du score en Mots Par Minute (MPM)
    const minutes = parseInt(d.value) / 60;
    const mpm = Math.round(done / minutes);

    s.textContent = mpm;
    rank.push(mpm);
    rank.sort((a, b) => b - a); // Trie du meilleur au moins bon
    board();
};

// Vérifie la saisie à chaque lettre tapée
const check = () => {
    const ok = word.startsWith(i.value);

    if (!ok) {
        // L'utilisateur s'est trompé : on efface la mauvaise lettre immédiatement.
        // Cela le "bloque" visuellement et l'empêche de continuer.
        i.value = i.value.slice(0, -1);
        state.textContent = 'Lettre incorrecte';
    } else {
        state.textContent = '';
    }

    // Si la saisie correspond exactement au mot cible
    if (i.value === word) {
        done++;
        doneEl.textContent = done;
        i.value = ''; // On vide le champ pour le mot suivant

        // Si l'utilisateur est très rapide et finit les 30 mots, on en rajoute
        if (done >= list.length) {
            list = list.concat(pick(30));
        }

        word = list[done];
        draw(); // Met à jour l'affichage (passe le mot en vert, souligne le suivant)
    }
};

// Initialisation au clic sur "Démarrer"
b.onclick = () => {
    clearInterval(timer);
    list = pick(30);
    done = 0;
    left = parseInt(d.value);
    word = list[0];

    t.textContent = left;
    s.textContent = 0;
    doneEl.textContent = 0;
    state.textContent = '';

    i.value = '';
    i.disabled = false;
    i.focus(); // Place automatiquement le curseur dans le champ texte

    draw(); // Déclenche l'affichage des mots

    timer = setInterval(() => {
        left--;
        t.textContent = left;
        if (left <= 0) end();
    }, 1000);
};

i.oninput = check;
board();