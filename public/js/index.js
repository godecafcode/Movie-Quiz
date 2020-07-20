

document.addEventListener('DOMContentLoaded', renderQuote);

window.history.pushState({}, document.title, "/");

// set level
let level = 1;
let triesLeft = 3;
let hintsLeft = 3;

const answers = [(correct = []), (wrong = [])];

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
    quote: 'That\'s planning for failure, Morty. Even dumber than regular planning.',
  },
];

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
  const userAnswer = document.getElementById('answer').value;

  if (triesLeft > 0) {
    if (bareCompare(userAnswer) === bareCompare(movieQuotes[`${level - 1}`].quote)) {
      answers[0].push(`${movieQuotes[`${level - 1}`].show}: ${movieQuotes[`${level - 1}`].quote}`);
      proceed('correct');
    } else {
      answers[1].push(`${movieQuotes[`${level - 1}`].show}: ${movieQuotes[`${level - 1}`].quote}`);
      proceed('wrong');
    }
  } else {
    changeButton('Retry', 'retry');
    alertMessage(`Out of tries!, what a bummer..`, 'wrong');
  }

  e.preventDefault();
}

function proceed(typeOfAnswer) {
  level += 1;
  disableButton();

  if (typeOfAnswer === 'correct') {
    alertMessage('Correct!', 'correct');
    document.getElementById('quote-censored').remove();
  } else {
    alertMessage(`Wrong answer, ${triesLeft} tries left.`, 'wrong');
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

  submit.firstElementChild.remove();
  submit.append(document.createTextNode(message));
  submit.id = '';
  submit.className = `misc-button ${className}`;
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
document.getElementById('hint-btn').addEventListener('click', function (e) {
  if (hintsLeft > 0) {
    hintsLeft -= 1;
    const quote = movieQuotes[level - 1].quote.split(' ');
    const hint = quote[0];
    console.log(hint);

    document.getElementById('answer').value = hint;
  } else {
    alert('No hints left!');
  }

  e.preventDefault();
});

// strip the string naked of special characters to prevent the compare function from being sensitive. -- MAX/22:40

function bareCompare(string) {
  let illegalCharacters = [',', "'"];

  let bareString;
  illegalCharacters.forEach(function(character) {
    if(string.indexOf(character !== -1)) {
      bareString = string.replace(/[^a-zA-Z ]/g, "");
    }
  })

  return bareString.toLowerCase();
}

function addCensored() {
    // finslipa sen
    const imageContainer = document.querySelector('.image-container');
    const censored = document.createElement('div');
    censored.id = 'quote-censored';
    imageContainer.appendChild(censored);
}
