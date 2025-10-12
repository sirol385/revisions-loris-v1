const mots = {
  "A la fin des": "late",
  "Au début des": "early",
  "Jeunesse": "youth",
  "Valeurs": "values",
  "Règles": "rules",
  "Témoin": "witness",
  "Laid": "ugly",
  "Déranger": "disturb",
  "Interrompre": "disrupt",
  "Complaisance": "complacency",
  "Déclaration": "statement",
  "Élan": "impulse",
  "Outrager": "outrage",
  "Leur propre": "their own",
  "Carton": "cardboard",
  "Manche": "sleeve",
  "Expérimenter": "experiment",
  "Sortie": "release",
  "Impliquer": "involve",
  "Variété": "variety",
  "Croyances": "beliefs",
  "Inclure": "include",
  "Mécontent": "dissatisfied",
  "Rejeter": "reject",
  "Principal": "mainstream",
  "Corrompre": "corrupt",
  "Imparfait": "flawed",
  "Armes": "weapons",
  "Rechercher": "seek",
  "Sens": "meaning"
};

let listeMots = [];
let mode = "fr-en";
let index = 0;
let stats = {};

const question = document.getElementById("question");
const answer = document.getElementById("answer");
const feedback = document.getElementById("feedback");
const startBtn = document.getElementById("start");
const validateBtn = document.getElementById("validate");
const modeSelect = document.getElementById("mode");
const wordStats = document.getElementById("word-stats");

modeSelect.addEventListener("change", () => {
  const titre = document.querySelector("h1");
  const selectedMode = modeSelect.value;
  if (selectedMode === "fr-en") {
    titre.textContent = "Entraînement Français → Anglais";
  } else if (selectedMode === "en-fr") {
    titre.textContent = "Entraînement Anglais → Français";
  } else if (selectedMode === "random") {
    titre.textContent = "Entraînement Aléatoire";
  } else if (selectedMode === "fr-en-random") {
    titre.textContent = "Entraînement Français → Anglais (Ordre Aléatoire)";
  }
});

startBtn.addEventListener("click", () => {
  mode = modeSelect.value;
  document.getElementById("controls").classList.add("hidden");
  document.getElementById("game").classList.remove("hidden");
  document.getElementById("word-stats").classList.remove("hidden");
  initGame();
});

function initGame() {
  listeMots = Object.entries(mots);
  index = 0;
  feedback.textContent = "";
  renderStats();

 if (mode === "random" || mode === "fr-en-random") {
   listeMots = shuffleArray(listeMots);
  }

  nextWord();
}

function shuffleArray(array) {
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }
  return array;
}

function nextWord() {
  if (index >= listeMots.length) {
    const mauvais = listeMots.filter(([fr]) => stats[fr]?.bad > 0);
    if (mauvais.length > 0) {
      listeMots = mauvais;
      index = 0;
      feedback.textContent = "On recommence les mots mals traduits 💪";
      setTimeout(() => {
        feedback.textContent = "";
      }, 5000);
    } else {
      feedback.textContent = "Bravo ! Tu as tout réussi 🎉";
      setTimeout(() => {
        feedback.textContent = "";
      }, 5000);
      return;
    }
    return;
  }

  const [fr, en] = listeMots[index];

  if (mode === "random") {
    if (Math.random() < 0.5) {
      question.textContent = fr;
      question.dataset.answer = en.toLowerCase();
    } else {
      question.textContent = en;
      question.dataset.answer = fr.toLowerCase();
    }
  } else if (mode === "fr-en-random") {
    question.textContent = fr;
    question.dataset.answer = en.toLowerCase();
  } else {
    question.textContent = mode === "fr-en" ? fr : en;
    question.dataset.answer = mode === "fr-en" ? en.toLowerCase() : fr.toLowerCase();
  }

  answer.value = "";
  answer.focus();
}

validateBtn.addEventListener("click", checkAnswer);
answer.addEventListener("keydown", e => {
  if (e.key === "Enter") checkAnswer();
});

function checkAnswer() {
  const [fr, en] = listeMots[index];
  const rep = answer.value.trim().toLowerCase();

  let bonneRep;
  if (mode === "random" || mode === "fr-en-random") {
    bonneRep = question.dataset.answer;
  } else {
    bonneRep = mode === "fr-en" ? en.toLowerCase() : fr.toLowerCase();
  }

  if (!stats[fr]) stats[fr] = { good: 0, bad: 0 };

    let feedbackTimeout = 2000;
  if (rep === bonneRep) {
    feedback.textContent = "✅ Bonne réponse !";
    feedback.style.color = "limegreen";
    stats[fr].good++;
    feedbackTimeout = 2000;
  } else {
    feedback.textContent = `❌ Mauvaise réponse. C'était "${bonneRep}".`;
    feedback.style.color = "darkred";
    stats[fr].bad++;
    feedbackTimeout = 4000;
  }

  renderStats();
  index++;

 setTimeout(nextWord, 100);

  setTimeout(() => {
    feedback.textContent = "";
  }, feedbackTimeout);
}

function renderStats() {
  wordStats.innerHTML = Object.entries(mots)
    .map(([fr]) => {
      const s = stats[fr] || { good: 0, bad: 0 };
      return `
        <div class="word-item">
          <span>${fr}</span>
          <span>
            <span class="good">+${s.good}</span> /
            <span class="bad">-${s.bad}</span>
          </span>
        </div>`;
    })
    .join("");
}