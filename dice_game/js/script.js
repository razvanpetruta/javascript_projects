function rollDice()
{
    // get a random number for the first dice
    let randomNumber1 = Math.floor(Math.random() * 6) + 1;
    document.querySelector(".img1").setAttribute("src", "images/dice" + randomNumber1 + ".png");

    // get a random number for the second dice
    let randomNumber2 = Math.floor(Math.random() * 6) + 1;
    document.querySelector(".img2").setAttribute("src", "images/dice" + randomNumber2 + ".png");

    // choose the winner
    if(randomNumber1 > randomNumber2) {
        document.querySelector("h1").innerHTML = "🥇 Player 1 Wins!";
    }
    else if(randomNumber1 < randomNumber2) {
        document.querySelector("h1").innerHTML = "Player 2 Wins! 🥇";
    }
    else {
        document.querySelector("h1").innerHTML = "Draw!";
    }
}