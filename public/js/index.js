document.addEventListener('DOMContentLoaded', renderQuote);

window.history.pushState({}, document.title, '/');

const movieQuotes = [
  {
    image: '/images/rick-and-morty.jpg',
    show: 'Rick and Morty',
    quote: "You son of a bitch, i'm in",
  },

  {
    image: '/images/spongebob.jpg',
    show: 'Spongebob',
    quote: "I'd hate you even if i didn't hate you",
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

// set variables
let level = 1;
let stage = 0;
let triesLeft = 3;
let hintsLeft = 3;

// display both correct and wrong answer when game finish
const answers = [(correct = []), (wrong = [])];

function renderQuote() {
  // Get UI Elements
  const UIquoteImage = document.getElementById('quote-image');

  if (movieQuotes[level - 1]) {
    for (let i = 0; i < level; i++) {
      //Render new image from array
      UIquoteImage.setAttribute('src', `${movieQuotes[`${level - 1}`].image}`);
    }
  } else {
    revealAnswers();
    changeButton('Great job!', 'finish');
    alertMessage("You've finished the game, thanks for playing!");
  }
}

document.querySelector('.form').addEventListener('submit', compare);

function compare(e) {
  if (movieQuotes[`${level - 1}`] !== undefined) {
    // get current quote
    let currentQuote = movieQuotes[`${level - 1}`].quote;

    const userAnswer = document.getElementById('answer').value;

    if (triesLeft > 1) {
      if (bareCompare(userAnswer) === bareCompare(currentQuote)) {
        answers[0].push(`${movieQuotes[`${level - 1}`].show}: ${currentQuote}`);
        proceed('correct');
      } else {
        answers[1].push(`${movieQuotes[`${level - 1}`].show}: ${currentQuote}`);
        proceed('wrong');
      }
    } else {
      changeButton('Retry', 'retry');
      alertMessage(`Out of tries! What a bummer..`, 'wrong');
    }
  } else {
    location.reload();
  }

  e.preventDefault();
}

function proceed(typeOfAnswer) {
  let tries;

  level += 1;
  // stage += 1;
  disableButton();

  if (typeOfAnswer === 'correct') {
    alertMessage('Correct!', 'correct');
    document.getElementById('quote-censored').remove();
  } else {
    triesLeft -= 1;
    if(triesLeft > 1 || triesLeft < 1) {
      tries = 'tries';
    } else {
      tries = 'try'
    };
    let turnaryTries = (triesLeft > 0) ? `Wrong answer, ${triesLeft} ${tries} left.` : 'Last try';
    alertMessage(turnaryTries, 'wrong')

  }

  setTimeout(() => {
    renderQuote();
    clearField();
    addCensored();
  }, 2000);
}

function alertMessage(message, className) {
  // UI reference elements
  const gameContainer = document.querySelector('.game-container');
  const imageContainer = document.querySelector('.image-container');

  // create alert
  const alert = document.createElement('div');
  alert.className = `u-full-width ${className}`;
  alert.append(document.createTextNode(message));

  gameContainer.insertBefore(alert, imageContainer);

  setTimeout(() => {
    alert.remove();
  }, 2000);
}

function clearField() {
  document.getElementById('answer').value = '';
}

function changeButton(message, className) {
  const submit = document.getElementById('submit-btn');

  if (submit.firstElementChild) {
    submit.firstElementChild.remove();
    submit.append(document.createTextNode(message));
    submit.className = `misc-button ${className}`;
    if (`${className}` === 'retry') {
      qRestart();
    }
  }
}

function disableButton() {
  // get both buttons
  const buttons = document.querySelectorAll('.misc-button');

  buttons.forEach(function (button) {
    button.disabled = true;
    setTimeout(function () {
      button.disabled = false;
    }, 2000);
  });
}

function revealAnswers() {
  const answersList = document.querySelector('.answers');

  answers[0].forEach(function (correct) {
    const answer = document.createElement('li');
    answer.append(document.createTextNode(correct));
    answer.style.color = 'green';
    answersList.appendChild(answer);
  });

  answers[1].forEach(function (correct) {
    const answer = document.createElement('li');
    answer.append(document.createTextNode(correct));
    answer.style.color = 'red';
    answersList.appendChild(answer);
  });
}

// get hint
let whichHint = 0;

document.getElementById('hint-btn').addEventListener('click', function (e) {
  // assign quote and compare previous to new quote down below
  let hintQuote = movieQuotes[`${level - 1}`].quote;

  if (stage === level - 1) {
    if (hintsLeft > 0) {
      hintsLeft -= 1;
      let quote = hintQuote.split(' ');
      let hint = quote[whichHint];
      whichHint += 1;

      document.getElementById('answer').value += `${hint} `;
    } else {
      alertMessage('No hints left!', 'wrong');
    }
  } else {
    whichHint = 0;
    stage = level - 1;

    if (stage === level - 1) {
      if (hintsLeft > 0) {
        hintsLeft -= 1;
        let quote = hintQuote.split(' ');
        let hint = quote[whichHint];
        whichHint += 1;

        document.getElementById('answer').value += `${hint} `;
      }
    }
  }

  e.preventDefault();
});

// strip the string naked of special characters to prevent the compare function from being sensitive. -- MAX/22:40

function bareCompare(string) {
  let illegalCharacters = [',', "'"];

  let bareString;
  illegalCharacters.forEach(function (character) {
    if (string.indexOf(character !== -1)) {
      bareString = string.replace(/[^a-zA-Z ]/g, '');
    }
  });

  return bareString.toLowerCase();
}

function addCensored() {
  // finslipa sen
  if (!document.getElementById('quote-censored')) {
    const imageContainer = document.querySelector('.image-container');
    const censored = document.createElement('div');
    censored.id = 'quote-censored';
    imageContainer.appendChild(censored);
  }
}

if (document.querySelector('.retry')) {
  document.querySelector('.retry').addEventListener('click', function () {
    location.reload();
  });
}

function qRestart() {
  if (document.querySelector('.retry')) {
    document.querySelector('.retry').addEventListener('click', function () {
      location.reload();
    });
  }
}
