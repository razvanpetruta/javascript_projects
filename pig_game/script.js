"use strict";



// Selecting elements
const player0El = document.querySelector(".player--0");
const player1El = document.querySelector(".player--1");
const score0El = document.querySelector("#score--0");
const score1El = document.querySelector("#score--1");
const current0El = document.querySelector("#current--0");
const current1El = document.querySelector("#current--1");

const diceEl = document.querySelector(".dice");
const buttonNew = document.querySelector(".btn--new");
const buttonRoll = document.querySelector(".btn--roll");
const buttonHold = document.querySelector(".btn--hold");
const buttonRules = document.querySelector(".btn--rules");

const modal = document.querySelector(".modal");
const overlay = document.querySelector(".overlay");
const buttonCloseModal = document.querySelector(".close-modal");



// Variables
let scores = [0, 0];
let currentScore = 0;
let stillPlaying = true;
let activePlayer = 0;



// Functionality

// Switch player
const switchPlayer = function () {
    document.getElementById(`current--${activePlayer}`).textContent = "0";
    currentScore = 0;
    activePlayer = (activePlayer + 1) % 2;
    player0El.classList.toggle("player--active");
    player1El.classList.toggle("player--active");
};



// Roll dice
buttonRoll.addEventListener("click", function () {
    if (!stillPlaying) {
        return;
    }

    // Generate the random number
    const diceNumber = Math.floor(Math.random() * 6) + 1;

    // Display the dice photo
    if (diceEl.classList.contains("hidden")) {
        diceEl.classList.remove("hidden");
    }
    diceEl.src = `./dice-${diceNumber}.png`;

    // Check for dice number 1
    if (diceNumber !== 1) {
        currentScore += diceNumber;
        document.querySelector(`#current--${activePlayer}`).textContent = String(currentScore);
    } else {
        switchPlayer();
    }
});



// Hold
buttonHold.addEventListener("click", function () {
    if (!stillPlaying) {
        return;
    }

    // Add current score to active player score
    scores[activePlayer] += currentScore;
    document.querySelector(`#score--${activePlayer}`).textContent = String(scores[activePlayer]);

    // Check for win
    if (scores[activePlayer] >= 100) {
        // Finish the game
        diceEl.classList.add("hidden");
        stillPlaying = false;
        document.querySelector(`.player--${activePlayer}`).classList.add('player--winner');
        document.querySelector(`.player--${activePlayer}`).classList.remove('player--active');
    } else {
        switchPlayer();
    }
});



// New game
buttonNew.addEventListener("click", function () {
    // Reset values
    scores[0] = scores[1] = 0;
    currentScore = 0;
    stillPlaying = true;

    // remove effects from winner / current player
    const activePlayerEl = document.querySelector(`.player--${activePlayer}`);
    if (activePlayerEl.classList.contains("player--winner")) {
        activePlayerEl.classList.remove("player--winner");
    } else {
        // if no winner -> remove the active effect
        activePlayerEl.classList.remove("player--active")
    }
    if (!diceEl.classList.contains("hidden")) {
        diceEl.classList.add("hidden");
    }

    // reset current player
    activePlayer = 0;
    document.querySelector(`.player--${activePlayer}`).classList.add("player--active");

    // reset elements' scores
    score0El.textContent = "0";
    score1El.textContent = "0";
    current0El.textContent = "0";
    current1El.textContent = "0";
});



// Modal functionality
const openModal = function () {
    modal.classList.remove("hidden");
    overlay.classList.remove("hidden");
};

const closeModal = function () {
    modal.classList.add("hidden");
    overlay.classList.add("hidden");
};

buttonRules.addEventListener("click", openModal);

buttonCloseModal.addEventListener("click", closeModal);
overlay.addEventListener("click", closeModal);
document.addEventListener("keydown", function (e) {
    if (e.key === 'Escape' && !modal.classList.contains('hidden')) {
        closeModal();
    }
});