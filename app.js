const cards = document.querySelectorAll(".card");
const timerDisplay = document.getElementById("timer");
const guessesDisplay = document.getElementById("guesses");
const playButton = document.getElementById("play");
const resetButton = document.getElementById("reset");

let hasFlippedCard = false;
let firstCard, secondCard;
let lockDeck = false;
let timeRemaining = 60;
let guessesRemaining = 25;
let timerInterval;
let gameIsActive = false;


function flipCard() {
    if (!gameIsActive) return;
    if (lockDeck) return;
    if (this === firstCard) return;
    this.classList.add("flip");

    if (!hasFlippedCard) {
        hasFlippedCard = true;
        firstCard = this;
        return;
    }

    secondCard = this;
    // hasFlippedCard = false;

    checkForMatch();
}

function checkForMatch() {
    if (firstCard.dataset.key === secondCard.dataset.key) {
        disableCards();
    } else {
        reduceGuesses();
        unflipCards();
    }
}

function disableCards() {
    firstCard.removeEventListener("click", flipCard);
    secondCard.removeEventListener("click", flipCard);

    resetDeck();
}

function unflipCards() {
    lockDeck = true;
    setTimeout(() => {
        firstCard.classList.remove("flip");
        secondCard.classList.remove("flip");
        // lockDeck = false;
        resetDeck();
    }, 2000);
}

function resetDeck() {
    [hasFlippedCard, lockDeck] = [false, false];
    [firstCard, secondCard] = [null, null];
}

function shuffle() {
    cards.forEach(card => {
        let randomPosition = Math.floor(Math.random() * 16);
        card.style.order = randomPosition;
    });
}

shuffle();

cards.forEach(card => card.addEventListener("click", flipCard));

function startTimer() {
    if (timerInterval) return;
    // clear any existing number 
    if (timerInterval) {
        clearInterval(timerInterval);
    }
    // reset to 60 seconds 
    timeRemaining = 60;
    updateTimerDisplay();
    // start counting down 
    timerInterval = setInterval(() => {
        timeRemaining--;
        updateTimerDisplay();
        // stop time when it reaches 0
        if (timeRemaining <= 0) {
            clearInterval(timerInterval);
            gameOver();
        }
    }, 1000);
}

function updateTimerDisplay() {
    // Update the timer display 
    timerDisplay.textContent = `:${timeRemaining}`;
}

function updateGuessesDisplay() {
    const numberElement = guessesDisplay.querySelector(".number");
    numberElement.textContent = guessesRemaining;
}

function reduceGuesses() {
    guessesRemaining--;
    updateGuessesDisplay();
    if (guessesRemaining <= 0) {
        clearInterval(timerInterval);
        // gameOver();
    }
}

// function gameOver() {

// }

document.getElementById("reset").addEventListener("click", () => {
    clearInterval(timerInterval);
    gameIsActive = false;
    timeRemaining = 60;
    guessesRemaining = 25;
    updateTimerDisplay();
    updateGuessesDisplay();
    // reset the flipped cards 
    cards.forEach(card => {
        card.classList.remove("flip");
        card.addEventListener("click", flipCard);
    });
    // and shuffle them 
    shuffle();
});

document.getElementById("play").addEventListener("click", () => {
    console.log("Play button clicked!");
    gameIsActive = true;
    startTimer();
    updateGuessesDisplay();
})
