"use strict";

const message = document.querySelector(".message");
const number = document.querySelector(".number");
const body = document.querySelector("body");
const score = document.querySelector(".score");
const guess = document.querySelector(".guess");

let secretNumber = Math.floor(Math.random() * 20) + 1;
let currentScore = 20;
let highScore = 0;

// inform the user with the corresponding message
const setMessage = (info) => {
    message.textContent = info;
}

// user wins
const handleWin = () => {
    setMessage("Correct number");
    body.style.backgroundColor = "#60b347";
    number.style.width = "30rem";
    number.textContent = String(secretNumber);
    if (currentScore > highScore) {
        highScore = currentScore;
        document.querySelector(".highscore").textContent = String(highScore);
    }
}

const handleInvalid = () => {
    // for a moment, show a red background
    body.style.transition = "background-color 0s";
    body.style.backgroundColor = "#b21543";
    setTimeout(() => {
        body.style.backgroundColor = "#222";
        body.style.transition = "background-color 2s";
    }, 200);
}

document.querySelector(".check").addEventListener("click", () => {
    if (currentScore === 0) {
        handleInvalid();
        return;
    }

    const userGuess = Number(guess.value);
    // if the number is 0 or the user didn't input anything
    if (!userGuess) {
        setMessage("Invalid");
        handleInvalid();
    } else if (userGuess === secretNumber) {
        handleWin();
    } else {
        currentScore--;
        score.textContent = String(currentScore);
        userGuess > secretNumber ? setMessage("Too High") : setMessage("Too low");
        if (currentScore === 0) {
            setMessage("Game over...");
        }
    }
});

document.querySelector(".again").addEventListener("click", () => {
    secretNumber = Math.floor(Math.random() * 20) + 1;
    currentScore = 20;
    body.style.backgroundColor = "#222";
    number.style.width = "15rem";
    number.textContent = "?";
    setMessage("Start guessing...");
    score.textContent = String(currentScore);
    guess.value = "";
});
