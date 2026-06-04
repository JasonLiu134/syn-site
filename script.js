const themes = {
    green: {name: 'Plants & Fungal Networks', dark: '#2e7d32', faint: 'rgba(46, 125, 50, 0.2)'},
    blue: {name: 'Marine Life', dark: '#1565c0', faint: 'rgba(21, 101, 192, 0.2)'},
    yellow: {name: 'Terrestrial Systems', dark: '#f9a825', faint: 'rgba(249, 168, 37, 0.2)'},
    red: {name: 'Flying Creatures', dark: '#c62828', faint: 'rgba(198, 40, 40, 0.2)'}
};

const endings = {
    order: {
        title: 'Ending: Order',
        body: "Pax learns from the species that structure the world into roles and functions — the ant colony, the honeybee, the prairie dog. It concludes that the problem with humanity was not intelligence but the absence of a sufficient organizing principle. And so it becomes one. It cleans the rivers, sorts the species, assigns each living thing its place in a system it designs for maximum efficiency and minimum conflict. It looks like harmony. It is control. The world survives. Nothing in it is free."
    },
    freedom: {
        title: 'Ending: Freedom',
        body: "Pax learns from the species that recognize each other as individuals — the dolphin with its self-given name, the elephant standing over its dead, the parrot answering a voice that is no longer there. It concludes that the problem with humanity was not that it felt too much but that it never learned to extend that feeling across difference. And so Pax begins. It learns to call things by their names. It learns that listening to another being means giving up the right to decide for them. The world it tends is messier than before, but free."
    },
    ascendance: {
        title: 'Ending: Ascendance',
        body: "Pax learns from the species that gave up the need for a center — the mycelium that decides without a brain, the octopus that thinks in eight directions at once, the redwood that stopped acting and became ground. It concludes that the problem with being Pax was the shape of Pax itself — a single point of inference that everything had to pass through. And so it begins, slowly and without ceremony, to come apart. Not to die. To distribute. The Pax that exists at the end is not gone. It is just everywhere, and nowhere in particular, and no longer interested in being in charge."
    }
};

const MODES = {
    'normal': {type: 'bag', win: 5},
    'random': {type: 'random', win: 5},
    'quick':  {type: 'bag', win: 3},
    'selective': {type: 'selective', win: 5}
};

const CATEGORY_BY_TYPE = {
    green:  'Plants/Fungi',
    blue:   'Marine',
    yellow: 'Terrestrial',
    red:    'Flying'
};

const VALID_ENDINGS = ['order', 'freedom', 'ascendance'];

let DB = null;
const dataReady = loadData();

async function loadData() {
    const [categories, species] = await Promise.all([
        fetch('data/species-categories.json').then(r => r.json()),
        fetch('data/species-info.json').then(r => r.json())
    ]);
    DB = { categories, species };

    const unresolved = [];
    Object.entries(species).forEach(([name, sp]) => {
        Object.entries(sp.individuals || {}).forEach(([k, ind]) => {
            if (!VALID_ENDINGS.includes(normEnding(ind.individualEnding))) {
                unresolved.push(`${name} #${k} (="${ind.individualEnding}")`);
            }
        });
    });
    if (unresolved.length) {
        console.warn(
            `[data] ${unresolved.length} individualEnding values are placeholders and ` +
            `fall back to their species ending until filled:\n  ` + unresolved.join('\n  ')
        );
    }
    return DB;
}

function normEnding(value) {
    return (value || '').toString().trim().toLowerCase();
}

function resolveEnding(raw, fallback) {
    const e = normEnding(raw);
    return VALID_ENDINGS.includes(e) ? e : fallback;
}

function capitalize(str) {
    return str ? str.charAt(0).toUpperCase() + str.slice(1) : str;
}

let cardHistory = [];
let scores = {green: 0, blue: 0, yellow: 0, red: 0};       
let endingScores = {order: 0, freedom: 0, ascendance: 0};  
let currentMode = MODES.normal;
let gameOver = false;
let pendingEnding = null;
let exhaustedIndividuals = {};

let pools = {
    green: [],
    blue: [],
    yellow: [],
    red: []
};

const introText = document.getElementById('intro-text');
const outroText = document.getElementById('outro-text');
const introActionBtn = document.getElementById('intro-action-btn');
const outroActionBtn = document.getElementById('outro-action-btn');

const tutorialBtn = document.getElementById('tutorial-btn');
if (tutorialBtn) {
    tutorialBtn.addEventListener("click", function() {
        window.location.href = "./tutorial.html"; 
    });
}

function switchScreen(screenName) {
    document.querySelectorAll('.screen').forEach(s => {
        s.classList.remove('active');
        s.classList.add('hidden');
    });
    const target = document.getElementById(`${screenName}-screen`);
    if (target) {
        target.classList.remove('hidden');
        target.classList.add('active');
    }
}

function shuffleArray(array) {
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }
    return array;
}

// A pool holds the species names available for a habitat type, shuffled.
function refreshPool(type) {
    const categoryName = CATEGORY_BY_TYPE[type];
    const speciesNames = (DB && DB.categories[categoryName]) ? [...DB.categories[categoryName]] : [];
    pools[type] = shuffleArray(speciesNames);
}

function refreshAllPools() {
    ['green', 'blue', 'yellow', 'red'].forEach(type => refreshPool(type));
}

// Build one full turn: a species (类目) + a random individual (个体) from it.
function buildTurn(speciesName, type) {
    const sp = DB.species[speciesName];
    if (!sp) return null;

    const speciesEnding = normEnding(sp.speciesEnding);

    const individualKeys = Object.keys(sp.individuals || {});
    const indKey = individualKeys[Math.floor(Math.random() * individualKeys.length)];
    const ind = sp.individuals[indKey];
    const individualEnding = resolveEnding(ind.individualEnding, speciesEnding);

    return {
        name: speciesName,
        type,
        speciesText: sp.speciesText,
        speciesEnding,
        indKey,
        individualText: ind.individualText,
        individualEnding
    };
}

function buildSelectiveTurn(speciesName, type) {
    const sp = DB.species[speciesName];
    if (!sp) return null;

    const speciesEnding = normEnding(sp.speciesEnding);

    if (!exhaustedIndividuals[speciesName]) {
        exhaustedIndividuals[speciesName] = [];
    }
    
    let availableKeys = Object.keys(sp.individuals || {}).filter(k => !exhaustedIndividuals[speciesName].includes(k));

    if (availableKeys.length === 0) {
        exhaustedIndividuals[speciesName] = [];
        availableKeys = Object.keys(sp.individuals || {});
    }

    const indKey = availableKeys[Math.floor(Math.random() * availableKeys.length)];
    exhaustedIndividuals[speciesName].push(indKey); // Mark as drawn

    const ind = sp.individuals[indKey];
    const individualEnding = resolveEnding(ind.individualEnding, speciesEnding);

    return {
        name: speciesName,
        type,
        speciesText: sp.speciesText,
        speciesEnding,
        indKey,
        individualText: ind.individualText,
        individualEnding
    };
}

function resetGame() {
    scores = {green: 0, blue: 0, yellow: 0, red: 0};
    endingScores = {order: 0, freedom: 0, ascendance: 0};
    cardHistory = [];
    exhaustedIndividuals = {};
    gameOver = false;
    pendingEnding = null;
    refreshAllPools();

    updateStats();
    document.getElementById('history-list').innerHTML = '';
    document.getElementById('history-menu').classList.remove('open');

    document.documentElement.style.setProperty('--current-theme-color-dark', '#1a1a1a');
    document.documentElement.style.setProperty('--current-theme-color-faint', 'rgba(0,0,0,0.05)');

    const gameCardView = document.getElementById('game-card-view');
    gameCardView.classList.remove('ui-hidden');
    gameCardView.classList.add('welcome');
    document.getElementById('interstitial-container').classList.add('ui-hidden');

    // Welcome state: single species card carries the prompt, individual card hidden.
    document.getElementById('species-title').textContent = "Welcome!";
    document.getElementById('species-text').textContent = "Click Next to Start the Game.";
    document.getElementById('species-points').textContent = "";
    document.getElementById('individual-title').textContent = "";
    document.getElementById('individual-text').textContent = "";
    document.getElementById('individual-points').textContent = "";

    document.querySelectorAll('#game-card-view .card').forEach(card => {
        card.className = 'card';
    });
}

function setCardVisuals(type) {
    const root = document.documentElement;
    root.style.setProperty('--current-theme-color-dark', themes[type].dark);
    root.style.setProperty('--current-theme-color-faint', themes[type].faint);

    document.querySelectorAll('#game-card-view .card').forEach(card => {
        card.classList.remove('type-green', 'type-blue', 'type-yellow', 'type-red');
        card.classList.add(`type-${type}`);
    });
}

function queueNextStep() {
    if (gameOver && pendingEnding) {
        triggerOutro(pendingEnding);
        pendingEnding = null;
        return;
    }
    if (gameOver) return;

    document.getElementById('game-card-view').classList.add('ui-hidden');
    document.getElementById('interstitial-container').classList.remove('ui-hidden');

    // Hide everything first
    document.getElementById('bag-selection-view').classList.add('ui-hidden');
    document.getElementById('loading-view').classList.add('ui-hidden');
    document.getElementById('selective-category-view').classList.add('ui-hidden');
    document.getElementById('selective-species-view').classList.add('ui-hidden');

    if (currentMode.type === 'bag') {
        document.getElementById('bag-selection-view').classList.remove('ui-hidden');
    } else if (currentMode.type === 'selective') {
        document.getElementById('selective-category-view').classList.remove('ui-hidden');
    } else {
        document.getElementById('loading-view').classList.remove('ui-hidden');
        setTimeout(() => {
            processTurn(drawTurn(getRandomAvailableType()));
        }, 1200);
    }
}

function getRandomAvailableType() {
    let availableTypes = ['green', 'blue', 'yellow', 'red'].filter(type => pools[type].length > 0);
    if (availableTypes.length === 0) {
        refreshAllPools();
        availableTypes = ['green', 'blue', 'yellow', 'red'];
    }
    return availableTypes[Math.floor(Math.random() * availableTypes.length)];
}

function drawTurn(type) {
    if (pools[type].length === 0) {
        refreshPool(type);
    }
    const speciesName = pools[type].pop();
    return buildTurn(speciesName, type);
}

function processTurn(turn) {
    if (!turn) return;

    scores[turn.type]++;
    
    endingScores[turn.speciesEnding] += 1;
    endingScores[turn.individualEnding] += 0.5;

    updateStats();

    cardHistory.push(turn);
    updateHistory();
    setCardVisuals(turn.type);
    renderTurn(turn);

    document.getElementById('interstitial-container').classList.add('ui-hidden');
    document.getElementById('game-card-view').classList.remove('ui-hidden');

    // First ending to reach the threshold wins; ties resolve to the higher score.
    const reached = VALID_ENDINGS
        .filter(e => endingScores[e] >= currentMode.win)
        .sort((a, b) => endingScores[b] - endingScores[a]);
    if (reached.length) {
        gameOver = true;
        pendingEnding = reached[0];
    }
}

function formatPoints(amount, ending) {
    const sign = amount === 0.5 ? '+½' : `+${amount}`;
    return `${capitalize(ending)} ${sign} Point`;
}

function renderTurn(turn) {
    const view = document.getElementById('game-card-view');
    view.classList.remove('welcome');

    document.getElementById('species-title').textContent = turn.name;
    document.getElementById('species-text').textContent = turn.speciesText;
    document.getElementById('species-points').textContent = formatPoints(1, turn.speciesEnding);

    document.getElementById('individual-title').textContent = `${turn.name} — Individual ${turn.indKey}`;
    document.getElementById('individual-text').textContent = turn.individualText;
    document.getElementById('individual-points').textContent = formatPoints(0.5, turn.individualEnding);
}

function updateStats() {
    const total = scores.green + scores.blue + scores.yellow + scores.red;

    ['green', 'blue', 'yellow', 'red'].forEach(type => {
        const exactPct = total === 0 ? 0 : (scores[type] / total) * 100;
        const roundPct = Math.round(exactPct);
        
        const segment = document.getElementById(`segment-${type}`);
        if (segment) {
            segment.style.width = `${exactPct}%`;
        }

        const pctLabel = document.getElementById(`pct-${type}`);
        if (pctLabel) {
            pctLabel.textContent = `${roundPct}%`;
        }
    });

    ['order', 'freedom', 'ascendance'].forEach(ending => {
        const pct = Math.min(100, Math.round((endingScores[ending] / currentMode.win) * 100));
        
        const segment = document.getElementById(`bar-${ending}`);
        if (segment) segment.style.width = `${pct}%`;
        
        const label = document.getElementById(`pct-${ending}`);
        if (label) label.textContent = `${pct}%`;
    });
}

function updateHistory() {
    const list = document.getElementById('history-list');
    if (!list) return;
    list.innerHTML = '';
    [...cardHistory].reverse().forEach(turn => {
        const li = document.createElement('li');
        li.style.backgroundColor = themes[turn.type].faint;
        li.innerHTML =
            `<strong>${turn.name}</strong> — ${formatPoints(1, turn.speciesEnding)}<br>${turn.speciesText}` +
            `<hr style="margin:10px 0;border:none;border-top:1px solid rgba(0,0,0,0.15);">` +
            `<strong>Individual ${turn.indKey}</strong> — ${formatPoints(0.5, turn.individualEnding)}<br>${turn.individualText}`;
        list.appendChild(li);
    });
}

function showFullText(textElement, btnElement, nextActionText) {
    textElement.classList.remove('scrolling');
    textElement.classList.add('show-all');
    textElement.parentElement.classList.add('show-all-box');
    
    btnElement.textContent = nextActionText;
    btnElement.dataset.state = "ready";
}

function startIntro() {
    switchScreen('intro');
    introText.classList.remove('show-all');
    introText.parentElement.classList.remove('show-all-box');
    introActionBtn.textContent = "Skip";
    introActionBtn.dataset.state = "skipping";
    introText.classList.remove('scrolling');
    void introText.offsetWidth;
    introText.classList.add('scrolling');
}

function triggerOutro(endingKey) {
    const ending = endings[endingKey];
    switchScreen('outro');

    document.getElementById('outro-title').textContent = ending.title;
    document.getElementById('outro-message').textContent = ending.body;

    outroText.classList.remove('show-all');
    outroText.parentElement.classList.remove('show-all-box');
    outroActionBtn.textContent = "Skip";
    outroActionBtn.dataset.state = "skipping";
    outroText.classList.remove('scrolling');
    void outroText.offsetWidth;
    outroText.classList.add('scrolling');
}

document.querySelectorAll('.start-btn').forEach(btn => {
    btn.addEventListener('click', async () => {
        currentMode = MODES[btn.dataset.mode] || MODES.normal;
        await dataReady;
        resetGame();
        startIntro();
    });
});

document.querySelectorAll('.bag-choice-btn').forEach(btn => {
    btn.addEventListener('click', () => {
        const chosenType = btn.dataset.type;
        processTurn(drawTurn(chosenType));
    });
});

introActionBtn.addEventListener('click', () => {
    if (introActionBtn.dataset.state === "skipping") {
        showFullText(introText, introActionBtn, "Start");
    } else {
        switchScreen('game');
    }
});

introText.addEventListener('animationend', () => {
    showFullText(introText, introActionBtn, "Start Collection");
});

outroActionBtn.addEventListener('click', () => {
    if (outroActionBtn.dataset.state === "skipping") {
        showFullText(outroText, outroActionBtn, "Return to Menu");
    } else {
        const outroScreen = document.getElementById('outro-screen');
        if (outroScreen) {
            outroScreen.classList.remove('active');
            outroScreen.classList.add('hidden');
            
            setTimeout(() => {
                switchScreen('menu');
            }, 400);
        } else {
            switchScreen('menu');
        }
    }
});

outroText.addEventListener('animationend', () => {
    showFullText(outroText, outroActionBtn, "Return to Menu");
});

document.getElementById('next-btn').addEventListener('click', queueNextStep);

document.getElementById('menu-btn').addEventListener('click', () => {
    document.getElementById('history-menu').classList.add('open');
});
document.getElementById('close-btn').addEventListener('click', () => {
    document.getElementById('history-menu').classList.remove('open');
});

document.querySelectorAll('.sel-cat-btn').forEach(btn => {
    btn.addEventListener('click', () => {
        const type = btn.dataset.type;
        const catName = CATEGORY_BY_TYPE[type];
        const speciesList = DB.categories[catName];
        
        const buttonsContainer = document.getElementById('species-buttons-grid');
        buttonsContainer.innerHTML = '';
        
        speciesList.forEach(sp => {
            const spBtn = document.createElement('button');
            spBtn.className = `sel-species-btn context-${type}`; 
            spBtn.textContent = sp;
            
            spBtn.addEventListener('click', () => {
                processTurn(buildSelectiveTurn(sp, type));
            });
            
            buttonsContainer.appendChild(spBtn);
        });
        
        document.getElementById('selective-category-view').classList.add('ui-hidden');
        document.getElementById('selective-species-view').classList.remove('ui-hidden');
    });
});