const cards = document.querySelectorAll(".card");
const timerDisplay = document.getElementById("timer");
const guessesDisplay = document.getElementById("guesses");
const playButton = document.getElementById("play");
const resetButton = document.getElementById("reset");

let hasFlippedCard = false; /* treats first click a first card of a pair */
let firstCard, secondCard;
let lockDeck = false; /* lets player click cards right away when game starts */
let timeRemaining = 60;
let guessesRemaining = 25;
let timerInterval;
let gameIsActive = false;


function flipCard() {
    if (!gameIsActive) return; /* exit function if game has not started */
    if (lockDeck) return;
    if (this === firstCard) return; /* so you can't click same card twice */
    this.classList.add("flip"); /* add flip class to card clicked, trigger css to flip card */

    if (!hasFlippedCard) { /* check to see if this is the first card flipped over */
        hasFlippedCard = true;
        firstCard = this;
        return;
    }
    secondCard = this; /* if one card already flipped, currently clicked card is "second card" */
    checkForMatch();
}

function checkForMatch() {
    if (firstCard.dataset.key === secondCard.dataset.key) { /* used keys vs id's for pairs of cards */
        disableCards();
        checkWinCondition();
    } else {
        reduceGuesses();
        if (guessesRemaining <= 0) {
            gameOver()
        } else {
            unflipCards();
        }
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
        resetDeck();
    }, 1700);
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

function startTimer() {
    if (timerInterval) clearInterval(timerInterval);
    timerInterval = setInterval(() => {
        timeRemaining--;
        updateTimerDisplay();
        if (timeRemaining <= 0) {
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
        gameOver();
    }
}

function gameOver() {
    const matchedCards = document.querySelectorAll(".card.flip");
    // check to see if player won first to avoid giving a loss message 
    if (matchedCards.length === cards.length) return;
    clearInterval(timerInterval);
    showPopup("You lost! Good thing you have 9 lives!");
}


cards.forEach(card => card.addEventListener("click", flipCard));

document.getElementById("reset").addEventListener("click", resetGame);

document.getElementById("play").addEventListener("click", () => {
    console.log("Play button clicked!");
    gameIsActive = true;
    startTimer();
    updateGuessesDisplay();
})

function showPopup(message) {
    const popup = document.getElementById("popup");
    const popupMessage = document.getElementById("popup-message");

    popupMessage.textContent = message;
    popup.style.display = "flex"; // Show the popup

    // Reset game when button is clicked
    const popupButton = document.getElementById("popup-button");
    popupButton.addEventListener("click", () => {
        popup.style.display = "none";
        resetGame(); /*fully reset everything*/
    }, { once: true }); /* make sure it is only added once */
}

function resetGame() {
    clearInterval(timerInterval);
    gameIsActive = false;
    timeRemaining = 60;
    guessesRemaining = 25
    updateTimerDisplay();
    updateGuessesDisplay();
    cards.forEach(card => {
        card.classList.remove("flip");
        card.addEventListener("click", flipCard);
    });
    shuffle();
    resetDeck();
}

function checkWinCondition() {
    const matchedCards = document.querySelectorAll(".card.flip");
    if (matchedCards.length === cards.length) {
        clearInterval(timerInterval); // Stop the timer
        showPopup("Purrrrfect, you win!");
        lockDeck = true;
    }
}



