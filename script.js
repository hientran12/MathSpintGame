// Pages
const gamePage = document.getElementById('game-page');
const scorePage = document.getElementById('score-page');
const splashPage = document.getElementById('splash-page');
const countdownPage = document.getElementById('countdown-page');
// Splash Page
const startForm = document.getElementById('start-form');
const radioContainers = document.querySelectorAll('.radio-container');
const radioInputs = document.querySelectorAll('input');
const bestScores = document.querySelectorAll('.best-score-value');
// Countdown Page
const countdown = document.querySelector('.countdown');
// Game Page
const itemContainer = document.querySelector('.item-container');
// Score Page
const finalTimeEl = document.querySelector('.final-time');
const baseTimeEl = document.querySelector('.base-time');
const penaltyTimeEl = document.querySelector('.penalty-time');
const playAgainBtn = document.querySelector('.play-again');

// Equations
let questionAmount = 0;
let equationsArray = [];
let playerGuessArray = [];
let bestScoreArray = [];

// Game Page
let equationObject = {};
const wrongFormat = [];

// Time
const WAITING_TIME = 3;
const PENATLTY = 2;
let timer;
let timePlayed = 0;
let baseTime = 0;
let penaltyTime = 0;
let finalTime = 0;
let finalTimeDisplay = '0.0s';

/**GAME PLAY: START TIMER, GUESS BUTTON, SCROLL */
// Start timer when game page is clicked
function startTimer() {
  // Reset times
  timePlayed = 0;
  penaltyTime = 0;
  finalTime = 0;
  timer = setInterval(addTimePlayed, 100);
}

// Add a tenth of a second to timePlayed
function addTimePlayed() {
  timePlayed += 0.1;
}

// Scroll
let valueY = 0;
function select(guessTrue) {
  if (playerGuessArray.length < questionAmount) {
    guessTrue ? playerGuessArray.push('true') : playerGuessArray.push('false');
    if (playerGuessArray.length <= questionAmount - 1) {
      // Scroll 80 px
      valueY += 80;
      itemContainer.scroll(0, valueY);
    }
  }

  if (playerGuessArray.length == questionAmount) {
    finishGame();
  }
}

// Dynamically adding correct/incorrect equations
function populateGamePage() {
  // Reset DOM, Set Blank Space Above
  itemContainer.textContent = '';
  // Spacer
  const topSpacer = document.createElement('div');
  topSpacer.classList.add('height-240');
  // Selected Item
  const selectedItem = document.createElement('div');
  selectedItem.classList.add('selected-item');
  // Append
  itemContainer.append(topSpacer, selectedItem);

  // Create Equations, Build Elements in DOM
  createEquations();
  arrayToDOM();

  // Set Blank Space Below
  const bottomSpacer = document.createElement('div');
  bottomSpacer.classList.add('height-500');
  itemContainer.appendChild(bottomSpacer);
}

// Array to DOM
function arrayToDOM() {
  equationsArray.forEach((e) => {
    // Item
    let item = document.createElement('div');
    item.classList.add('item');
    // Text
    let itemValue = document.createElement('h1');
    itemValue.textContent = e.value;
    // Apend
    item.appendChild(itemValue);
    itemContainer.appendChild(item);
  });
}

// Finish game and go to score page
function finishGame() {
  itemContainer.scrollTo({top: 0, behavior: 'instant'});
  // Stop timer
  clearInterval(timer);

  // Caculate Scores
  addPenatyTime();
  finalTime = timePlayed + penaltyTime;

  // update Beste Scores
  updateBestScores();

  // Load Score Page
  scoreToDOM();
  gamePage.hidden = true;
  scorePage.hidden = false;
}

// Add 0.35s for each wrong guess
function addPenatyTime() {
  let answers = equationsArray.map((a) => { return a.evaluated });
  for (let i = 0; i < answers.length; i++) {
    if (!(playerGuessArray[i] === answers[i])) {
      penaltyTime += PENATLTY;
    }
  }
}


/**
 * SCORE PAGE: VIEW SCORE AND PLAY AGAIN BTN
 */
// Score to DOM
function scoreToDOM() {
  baseTime = timePlayed.toFixed(1);
  finalTime = finalTime.toFixed(1);
  penaltyTime = penaltyTime.toFixed(1);

  finalTimeEl.textContent = `${finalTime}s`;
  baseTimeEl.textContent = `Base Time: ${baseTime}s`;
  penaltyTimeEl.textContent = `Penalty: +${penaltyTime}s`;
}

// Play Again
function playAgain() {
  resetAllValues();

  // show menu and hide score page
  scorePage.hidden = true;
  splashPage.hidden = false;
}

// Reset all values
function resetAllValues() {
  // Game Play
  valueY = 0;
  equationsArray = [];
  playerGuessArray = [];

  // Menu
  questionAmount = 0;
  radioContainers.forEach((radioElem) => {
    radioElem.classList.remove('selected-label');
  });

  // Timer
  baseTime = 0;
  timePlayed = 0;
  penaltyTime = 0;
  finalTime = 0;
}

/**
 * MENU: GET AMOUNT OF QUESTIONS, START ROUND BTN CLICK EVENT
 */

// Check Local Storage for Best Scores
function getSavedBestScore(){
  if(localStorage.getItem('bestScores')){
    bestScoreArray = JSON.parse(localStorage.bestScores);
  }else{
    bestScoreArray = [
      { questions: 10, bestScores: finalTimeDisplay},
      { questions: 25, bestScores: finalTimeDisplay},
      { questions: 50, bestScores: finalTimeDisplay},
      { questions: 99, bestScores: finalTimeDisplay}
    ];
    localStorage.setItem('bestScores',JSON.stringify(bestScoreArray));
  }
}

// Update Best Scores
function updateBestScores(){
  bestScoreArray.forEach((s,i) =>{
    if(s.questions == questionAmount){
      const savedBestSCore = Number(s.bestScores.split('s')[0]);
      if(savedBestSCore === 0 || savedBestSCore > finalTime){
        bestScoreArray[i].bestScores = `${finalTime.toFixed(1)}s`;
        localStorage.setItem('bestScores',JSON.stringify(bestScoreArray));
      }
    }
  });
  bestScoresToDOM();
}

// Best Scores to DOM
function bestScoresToDOM(){
  bestScoreArray.forEach((s,i) => {
    bestScores[i].textContent = s.bestScores;
  })
}

// Create Correct/Incorrect Random Equations
function createEquations() {
  // Randomly choose how many correct equations there should be
  const correctEquations = getRandom(questionAmount);
  // Set amount of wrong equations
  const wrongEquations = questionAmount - correctEquations;
  // Loop through, multiply random numbers up to 9, push to array
  for (let i = 0; i < correctEquations; i++) {
    equationObject = { value: randomACorrectEquation(), evaluated: 'true' };
    equationsArray.push(equationObject);
  }
  // Loop through, mess with the equation results, push to array
  for (let i = 0; i < wrongEquations; i++) {
    equationObject = { value: randomAnIncorrectEquation(), evaluated: 'false' };
    equationsArray.push(equationObject);
  }
  // Shuffer Array
  equationsArray = equationsArray.sort(() => Math.random() - 0.5);
}

// Get value from select radio
function getRadioValue(e) {
  if (e.srcElement.value) {
    questionAmount = e.srcElement.value;
  }
}

// Select Question Amount
function selectGameMode(e) {
  e.preventDefault();
  if (questionAmount > 0) {
    showCountDown();
  }
}

/**
 * LOADING SCREEN: COUNTDOWN READY, 3, 2, 1, GO!
 */

// Show Countdown
function showCountDown() {
  // hide splashPage and show Countdown Page
  splashPage.hidden = true;
  countdownPage.hidden = false;

  startCountDown();
}

function startCountDown() {
  // Count down 3s
  let cd = WAITING_TIME;
  countdown.textContent = `Ready`;
  let cdInterval = setInterval(() => {
    countdown.textContent = cd;
    if (cd < 0) {
      countdown.textContent = 'GO!';
      clearInterval(cdInterval);
      populateGamePage();
      setTimeout(startGame, 400);
    }
    cd--;
  }, 1000);
}

// Start Game
function startGame() {
  countdownPage.hidden = true;
  gamePage.hidden = false;
  startTimer();
}


/**
 * EVENT LISTENERS
 */
startForm.addEventListener('click', () => {
  radioContainers.forEach((radioEl) => {
    // Remove Selected Label Styling
    radioEl.classList.remove('selected-label');

    // Add selected-label to selected label
    if (radioEl.children[1].checked) {
      radioEl.classList.add('selected-label');
    }
  });
});

radioContainers.forEach((radioElem) => {
  radioElem.addEventListener('click', getRadioValue);
});

startForm.addEventListener('submit', selectGameMode);

playAgainBtn.addEventListener('click', playAgain);

/**
 * ON LOAD
 */
 getSavedBestScore();
 bestScoresToDOM();