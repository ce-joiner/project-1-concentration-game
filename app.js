const cards = document.querySelectorAll(".card");

let hasFlippedCard = false;
let firstCard, secondCard;
let lockDeck = false;

function flipCard() {
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
        return;
    }

    unflipCards();
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

(function shuffle() {
    cards.forEach(card => {
        let randomPosition = Math.floor(Math.random() * 16);
        card.style.order = randomPosition;
    });
})();

cards.forEach(card => card.addEventListener("click", flipCard));

