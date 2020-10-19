import { ui } from './modules/ui.js';

let movieQuotes = [
  {
    image: '/images/rsz_sofb.jpg',
    show: 'Rick and Morty',
    quote: "You son of a bitch, i'm in",
  },

  {
    image: '/images/rsz_1_trmwbm7r_q-f4juydiebsg.jpg',
    show: 'The Godfather',
    quote: "I'm gonna make him an offer he can't refuse.",
  },

  {
    image: '/images/rick-and-morty-2.jpg',
    show: 'Rick and Morty',
    quote: 'Weddings are basically funerals with cake',
  },

  {
    image: '/images/rick-and-morty-3.png',
    show: 'Rick and Morty',
    quote: "That's planning for failure, Morty. Even dumber than regular planning.",
  },

  {
    image: '/images/jaws.jpg',
    show: 'Jaws',
    quote: "You're gonna need a bigger boat",
  },
];

window.history.pushState({}, document.title, '/');
document.addEventListener('DOMContentLoaded', initShuffle);
document.getElementById('submit-btn').addEventListener('click', compare);
document.getElementById('restart-btn').addEventListener('click', restart);
document.getElementById('hint-btn').addEventListener('click', renderHint);

let level = 0;
let currentQuote = {};
let triesLeft = 3;
let hintsLeft = 3;

const answers = {
  correct: [],
  wrong: [],
};

function initShuffle() {
  new Promise((resolve, reject) => {
    resolve(randomize(movieQuotes));
  }).then(quotes => {
    movieQuotes = quotes;
    updateQuote();
  });
}

function updateQuote() {
  // console.log(quotes);
  if (!movieQuotes[level]) {
    ui.revealAnswers(answers);
    ui.changeButton();
    ui.alertMessage("You've finished the game, thanks for playing!", 'finish');
  } else {
    ui.hideQuote(true);
    ui.updateStage(movieQuotes, level);
    ui.clearField();
    currentQuote = {
      show: movieQuotes[level].show,
      quote: movieQuotes[level].quote,
    };
  }
}

function randomize(array) {
  let length = array.length,
    i;

  return array.reduce(acc => {
    while (length) {
      i = Math.floor(Math.random() * array.length);
      if (i in array) {
        acc.push(array[i]);
        delete array[i];
        length--;
      }
    }
    return acc;
  }, []);
}

function renderHint(e) {
  if (hintsLeft !== 0) {
    const input = document.querySelector('#answer');

    const writtenWords = input.value.split(' ').filter(word => word !== '');
    const hints = currentQuote.quote.split(' ');
    const hint = hints[writtenWords.length];

    input.value = [...writtenWords, hint].join(' ');
    hintsLeft--;
    ui.alertMessage(`Hints left: ${hintsLeft}`, 'wrong');
  } else {
    ui.alertMessage(`You're out of hints!`, 'wrong');
  }
  e.preventDefault();
}

function compare(e) {
  const answer = document.getElementById('answer').value;

  if (bareCompare(answer) === bareCompare(currentQuote.quote)) {
    proceed('correct');
  } else {
    proceed('wrong');
  }
  e.preventDefault();
}

function proceed(answer) {
  level++;

  if (answer === 'correct') {
    answers.correct.push(`${currentQuote.show}: ${currentQuote.quote}`);
    ui.nextStage(true);
  } else {
    triesLeft--;
    answers.wrong.push(`${currentQuote.show}: ${currentQuote.quote}`);
    ui.nextStage(false, triesLeft);
  }

  if (triesLeft !== 0) {
    setTimeout(() => {
      updateQuote();
      ui.enableButton();
    }, 2000);
  }
}

function restart(e) {
  e.preventDefault();
  window.location.reload();
}

function bareCompare(string) {
  const regex = /[^\w\s]/gi;
  let bareString = string
    .split('')
    .filter(word => word.replace(regex, ''))
    .join('');
  return bareString.toLowerCase();
}
