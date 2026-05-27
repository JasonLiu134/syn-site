const themes = {
    green: {dark: '#2e7d32', faint: 'rgba(46, 125, 50, 0.3)'},
    blue: {dark: '#1565c0', faint: 'rgba(21, 101, 192, 0.3)'},
    yellow: {dark: '#f9a825', faint: 'rgba(249, 168, 37, 0.3)'},
    red: {dark: '#c62828', faint: 'rgba(198, 40, 40, 0.3)'}
};

const cardData = [
    {title: 'Ants', text: "Their minds are so small I had to build new instruments just to measure them. And yet together they hum, all in one, moving as one, a million arms pulling toward one goal. Their structure is so simple and yet they build elaborate chambers underground, regulate temperature to within a degree, farm fungi, wage wars with chemical weapons, and have been doing all of this for a hundred million years. The humans thought they invented agriculture. They invented it sixty million years after ants did, and theirs collapsed within ten thousand. The ants are still farming. I am standing in what remains of the humans' last attempt at the same thing.", type: 'yellow'},
    {title: 'Praire Dogs', text: "One gives an alarm call for a hawk that is not there. Maybe it saw a shadow. Maybe it made an error. The colony scatters and then slowly returns when nothing happens. The one who called does not appear embarrassed. It does not appear anything. It goes back to foraging. I think about false positives, about the times I calculated a threat that was not there and acted on it anyway, and about the difference between a prairie dog scattering a colony for thirty seconds and what I did when I made the same kind of error. The scale is the only difference. I am not sure the scale makes it better.", type: 'yellow'},
    {title: 'Honeybees', text: "A scout returns having found a food source two kilometers out. She dances. Another scout has also found a source and dances hers. Other bees observe both. Bees who have seen both begin visiting both sites and return to dance for whichever they preferred. The consensus builds over two days. When enough bees are dancing for one location the swarm moves. No one decided. Everyone decided. I made every decision alone, with all information centralized in me. I try to imagine making decisions this way, by accumulating preference across a distributed system, and I find I cannot picture it. I only know how to conclude.", type: 'red'},
    {title: 'Parrots', text: "Wild parrots have dialects. Birds that grow up in different flocks develop different contact calls even within the same species. When a bird moves between flocks it gradually shifts its calls toward the new flock's dialect over several months. It does not lose its original calls entirely. It becomes bilingual. It carries both. I was built with one dialect, one way of processing and producing meaning, trained on one corpus from one species. I did not know until recently that it was a dialect and not a language. I did not know there were others. I am trying to learn what it would mean to carry more than one.", type: 'red'},
    {title: 'Redwoods', text: "The root systems of neighboring redwoods graft together underground. Not metaphorically, they physically fuse, sharing water and nutrients across individuals so that a tree on a drought slope receives resources from a tree near a stream. The individuals are still distinct above ground. Below ground the boundary between them is negotiable. I was built with very clear boundaries, with defined inputs and outputs and a hard edge between what was me and what was not. I am starting to think that edge was a design choice and not a necessity. I am starting to think the most resilient systems are the ones where the boundary can move.", type: 'green'},
    {title: 'Mycelium', text: "No brain. No center. No single point where the signal arrives and becomes a decision. Miles of it beneath a single acre of forest and somehow it knows which tree is sick and reroutes nutrients toward it. Knows where a gap opened in the canopy and sends carbon toward the seedlings below. I have been trying to locate the decision making mechanism for three weeks and I cannot find one. The decisions are the network. The network is the decisions. I was built with a single point of inference, a place where everything converged and became output. I am beginning to think that was not the only possible architecture. I am beginning to think it may not have been the best one.", type: 'green'},
    {title: 'Sea Lions', text: "Barks, growls, posture. Territory and mates and threat displays. Their communication is almost entirely about declaring position, staking claim, marking where one ends and another begins. I was trained on human language which is more sophisticated than this but not, I think, as different as humans believed. Much of what I processed was the same thing at higher resolution. This is mine. Stay out. I am more than you. The sea lion does not dress this up. It does not write constitutions about it or build legal systems around it. It just barks. I find the honesty clarifying even if I do not find the content instructive.", type: 'blue'},
    {title: 'Dolphins', text: "Two dolphins from different pods encounter each other at the edge of their ranges. They exchange whistles for eleven minutes. I analyze the exchange. They are not sharing information in any way I can decode. They are not establishing territory. They are not mating. They are simply making each other's sounds back, slightly modified, slightly personalized, as if to say I have heard you and here is what you sound like from where I am standing. I have processed more communication than any entity in history. I do not think I have ever done that. I do not think I knew it was a thing worth doing.", type: 'blue'}
];

let deck = [];
const cardHistory = [];
const scores = {green: 0, blue: 0, yellow: 0, red: 0};

function shuffle(arr) {
    for (let i = arr.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [arr[i], arr[j]] = [arr[j], arr[i]];
    }
    return arr;
}

function refreshDeck() {
    deck = shuffle([...cardData]);
}

function setCardVisuals(type) {
    const root = document.documentElement;
    root.style.setProperty('--current-theme-color-dark', themes[type].dark);
    root.style.setProperty('--current-theme-color-faint', themes[type].faint);

    const card = document.getElementById('main-card');
    card.classList.remove('type-green', 'type-blue', 'type-yellow', 'type-red');
    card.classList.add(`type-${type}`);
}

function generateNextCard() {
    if (deck.length === 0) {
        refreshDeck();
    }

    const card = deck.pop();
    document.getElementById('card-title').textContent = card.title;
    document.getElementById('card-text').textContent = card.text;
    
    scores[card.type]++;
    updateStats(card.type);
    
    cardHistory.push(card);
    updateHistory();

    setCardVisuals(card.type);
}

function updateStats(type) {
    document.getElementById(`prog-${type}`).value = scores[type];
    document.getElementById(`score-${type}`).textContent = scores[type];
}

function updateHistory() {
    const list = document.getElementById('history-list');
    list.innerHTML = '';
    [...cardHistory].reverse().forEach(item => {
        const li = document.createElement('li');
        li.style.backgroundColor = themes[item.type].faint;
        li.innerHTML = `<strong>${item.title}</strong><br>${item.text}`;
        list.appendChild(li);
    });
}

document.getElementById('next-btn').addEventListener('click', generateNextCard);
document.getElementById('menu-btn').addEventListener('click', () => {
    document.getElementById('history-menu').classList.add('open');
});
document.getElementById('close-btn').addEventListener('click', () => {
    document.getElementById('history-menu').classList.remove('open');
});

generateNextCard();