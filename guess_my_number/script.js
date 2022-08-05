"use strict";

let secretNumber = Math.floor(Math.random() * 20) + 1;
let score = 20;
let highScore = 0;

// inform the user with the corresponding message
const setMessage = (message) => {
    document.querySelector(".message").textContent = message;
}

// user wins
const handleWin = () => {
    setMessage("Correct number");
    document.querySelector("body").style.backgroundColor = "#60b347";
    document.querySelector(".number").style.width = "30rem";
    document.querySelector(".number").textContent = String(secretNumber);
    if (score > highScore) {
        highScore = score;
        document.querySelector(".highscore").textContent = String(highScore);
    }
}

const handleInvalid = () => {
    // for a moment, show a red background
    document.querySelector("body").style.transition = "background-color 0s";
    document.querySelector("body").style.backgroundColor = "#b21543";
    setTimeout(() => {
        document.querySelector("body").style.backgroundColor = "#222";
        document.querySelector("body").style.transition = "background-color 2s";
    }, 200);
}

document.querySelector(".check").addEventListener("click", () => {
    if (score === 0) {
        handleInvalid();
        return;
    }

    const userGuess = Number(document.querySelector(".guess").value);
    // if the number is 0 or the user didn't input anything
    if (!userGuess) {
        setMessage("Invalid");
        handleInvalid();
    } else if (userGuess === secretNumber) {
        handleWin();
    } else {
        score--;
        document.querySelector(".score").textContent = String(score);
        userGuess > secretNumber ? setMessage("Too High") : setMessage("Too low");
        if (score === 0) {
            setMessage("Game over...");
        }
    }
});

document.querySelector(".again").addEventListener("click", () => {
    secretNumber = Math.floor(Math.random() * 20) + 1;
    score = 20;
    document.querySelector("body").style.backgroundColor = "#222";
    document.querySelector(".number").style.width = "15rem";
    document.querySelector(".number").textContent = "?";
    setMessage("Start guessing...");
    document.querySelector(".score").textContent = String(score);
    document.querySelector(".guess").value = "";
});
