const $ = id => document.getElementById(id);
const d = $('duration'), b = $('start'), w = $('words'), i = $('input'),
    t = $('time'), s = $('score'), r = $('rank'), doneEl = $('done'), state = $('state');

let list = [], word = '', done = 0, left = 0, timer = 0, rank = [];

// Génère une liste de 'n' mots aléatoires SANS doublons
const pick = (n, exclude = []) => {
    const excluded = new Set(exclude);
    let pool = WORDS.filter(w => !excluded.has(w));
    for (let idx = pool.length - 1; idx > 0; idx--) {
        const j = Math.floor(Math.random() * (idx + 1));
        [pool[idx], pool[j]] = [pool[j], pool[idx]];
    }
    return pool.slice(0, n);
};

// Affiche les mots avec coloration des lettres en temps réel
const draw = () => {
    const visibleWords = list.slice(done, done + 5);
    const typed = i.value; // Ce que l'utilisateur est en train de taper

    w.innerHTML = visibleWords.map((wordText, k) => {
        const isCurrent = k === 0;

        if (isCurrent) {
            // Découpage du mot actuel lettre par lettre pour la coloration
            let lettersHtml = '';
            for (let j = 0; j < wordText.length; j++) {
                let charClass = '';
                if (j < typed.length) {
                    // Si la lettre tapée correspond : vert, sinon : rouge
                    charClass = typed[j] === wordText[j] ? 'letter-correct' : 'letter-incorrect';
                } else if (j === typed.length) {
                    // Souligne la prochaine lettre attendue
                    charClass = 'letter-next';
                }
                lettersHtml += `<span class="${charClass}">${wordText[j]}</span>`;
            }
            return `<span class="current">${lettersHtml}</span>`;
        }
        
        // Mots suivants (affichage simple)
        return `<span>${wordText}</span>`;
    }).join(' ');
};

const board = () => r.innerHTML = rank.map(x => `<li>${x} Mots par minutes</li>`).join('');

const end = () => {
    clearInterval(timer);
    i.disabled = true;
    state.textContent = 'Session terminée';
    
    const duration = parseInt(d.value) || 60;
    const mpm = Math.round(done / (duration / 60));

    s.textContent = mpm;
    rank.push(mpm);
    rank.sort((a, b) => b - a);
    board();
};

const check = () => {
    // On redessine à chaque lettre pour mettre à jour les couleurs
    draw();

    // Si le mot est parfaitement complété
    if (i.value === word && word !== '') {
        done++;
        doneEl.textContent = done;
        i.value = ''; 

        if (done >= list.length - 2) {
            list = list.concat(pick(200, list));
        }

        word = list[done];
        draw(); 
    }
};

b.onclick = () => {
    clearInterval(timer);
    list = pick(200);
    done = 0;
    left = parseInt(d.value) || 10;
    word = list[0];

    t.textContent = left;
    s.textContent = 0;
    doneEl.textContent = 0;
    state.textContent = '';

    i.value = '';
    i.disabled = false;
    i.focus(); 

    draw(); 

    timer = setInterval(() => {
        left--;
        t.textContent = left;
        if (left <= 0) end();
    }, 1000);
};

i.oninput = check;
board();