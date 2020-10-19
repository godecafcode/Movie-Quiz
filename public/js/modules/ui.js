class UI {
  constructor() {
    this.UIquoteImage = document.getElementById('quote-image');
    this.UIquote = document.getElementById('quote');
    this.UIquoteContainer = document.querySelector('.quote');
    this.submitBtn = document.getElementById('submit-btn');
    this.restartBtn = document.getElementById('restart-btn');
    this.inputField = document.getElementById('answer');
    this.gameContainer = document.querySelector('.game-container');
    this.imageContainer = document.querySelector('.image-container');
    this.censor = document.getElementById('quote-censored');
    this.answersList = document.querySelector('.answers');
    this.buttons = document.querySelectorAll('.misc-button');
  }

  // initStage(quotes) {
  //   this.UIquoteImage.setAttribute('src', quotes[0].image);
  // }

  updateStage(quotes, level) {
    this.UIquoteImage.setAttribute('src', quotes[level].image);
    this.UIquote.innerHTML = quotes[level].quote;
  }

  changeButton() {
    this.submitBtn.parentElement.classList.add('hidden');
    this.restartBtn.parentElement.classList.remove('hidden');
  }

  alertMessage(message, className) {
    this.clearAlert();

    const alert = document.createElement('div');
    alert.className = `u-full-width alert ${className}`;
    alert.append(document.createTextNode(message));

    this.gameContainer.insertBefore(alert, this.imageContainer);

    setTimeout(() => {
      this.clearAlert();
    }, 2000);
  }

  clearAlert() {
    if (document.querySelector('.alert')) {
      document.querySelector('.alert').remove();
    }
  }

  clearField() {
    this.inputField.value = '';
  }

  censorQuote() {
    const censored = document.createElement('div');
    censored.id = 'quote-censored';
    this.UIquoteContainer.appendChild(censored);

    this.censor = censored;
  }

  revealAnswers(answers) {
    answers.correct.forEach(correct => {
      const answer = document.createElement('li');
      answer.append(document.createTextNode(correct));
      answer.style.color = 'green';
      this.answersList.appendChild(answer);
    });

    answers.wrong.forEach(wrong => {
      const answer = document.createElement('li');
      answer.append(document.createTextNode(wrong));
      answer.style.color = 'red';
      this.answersList.appendChild(answer);
    });
  }

  disableButton() {
    this.buttons.forEach(function (button) {
      button.disabled = true;
    });
  }

  enableButton() {
    this.buttons.forEach(function (button) {
      button.disabled = false;
    });
  }

  nextStage(correct, triesLeft = 'Default') {
    this.disableButton();
    if (correct === true) {
      this.alertMessage('Correct!', 'correct');
      this.hideQuote(false);
    } else {
      if (triesLeft === 0) {
        this.changeButton();
        this.alertMessage(`Out of tries!`, 'wrong');
        this.enableButton();
      } else {
        this.alertMessage(`Tries left: ${triesLeft}`, 'wrong');
      }
    }
  }

  hideQuote(bool) {
    if (bool === true) {
      if (!this.censor) {
        this.censorQuote();
      }
    } else {
      this.censor.remove();
      this.censor = null;
    }
  }
}

export const ui = new UI();
