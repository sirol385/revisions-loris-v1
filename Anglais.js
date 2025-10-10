const mots = {
  "A la fin des...": "late",
  "Au début des...": "early",
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

startBtn.addEventListener("click", () => {
  mode = modeSelect.value;
  document.getElementById("controls").classList.add("hidden");
  document.getElementById("game").classList.remove("hidden");
  document.getElementById("word-stats").classList.remove("hidden"); // Ajouté
  initGame();
});

function initGame() {
  listeMots = Object.entries(mots);
  index = 0;
  feedback.textContent = "";
  renderStats();
  nextWord();
}

function nextWord() {
  if (index >= listeMots.length) {
    // reposer les mots faux
    const mauvais = listeMots.filter(([fr]) => stats[fr]?.bad > 0);
    if (mauvais.length > 0) {
      listeMots = mauvais;
      index = 0;
      feedback.textContent = "On recommence les mots mals traduits 💪";
    } else {
      feedback.textContent = "Bravo ! Tu as tout réussi 🎉";
      return;
    }
  }

  const [fr, en] = listeMots[index];
  question.textContent = mode === "fr-en" ? fr : en;
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
  const bonneRep = mode === "fr-en" ? en.toLowerCase() : fr.toLowerCase();

  if (!stats[fr]) stats[fr] = { good: 0, bad: 0 };

let timeout = 2000;

  if (rep === bonneRep) {
    feedback.textContent = "✅ Bonne réponse !";
    feedback.style.color = "limegreen";
    stats[fr].good++;
    timeout = 2000;
    
  } else {
    feedback.textContent = `❌ Mauvaise réponse. C'était "${bonneRep}".`;
    feedback.style.color = "darkred";
    stats[fr].bad++;
    timeout = 4000;
  }

  renderStats();
  index++;
  setTimeout(nextWord, 2000);

  setTimeout(() => {
    feedback.textContent = "";
  }, timeout);
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
