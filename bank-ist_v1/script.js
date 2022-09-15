"use strict";


const account1 = {
    owner: "Jonas Schmedtmann",
    movements: [
        {value: 200, date: "2019-11-18T21:31:17.178Z"},
        {value: 455.23, date: "2019-12-23T07:42:02.383Z"},
        {value: -306.5, date: "2020-01-28T09:15:04.904Z"},
        {value: 25000, date: "2020-04-01T10:17:24.185Z"},
        {value: -642.21, date: "2020-05-08T14:11:59.604Z"},
        {value: -133.9, date: "2022-09-14T22:10:17.194Z"},
        {value: 79.97, date: "2022-09-13T14:00:00.929Z"},
        {value: 1300, date: "2022-09-11T10:51:36.790Z"}
    ],
    interestRate: 1.2, // %
    pin: 1111,
    currency: "EUR",
    locale: "pt-PT" // de-DE
};

const account2 = {
    owner: "Jessica Davis",
    movements: [
        {value: 5000, date: "2019-11-01T13:15:33.035Z"},
        {value: 3400, date: "2019-11-30T09:48:16.867Z"},
        {value: -150, date: "2019-12-25T06:04:23.907Z"},
        {value: -790, date: "2020-01-25T14:18:46.235Z"},
        {value: -3210, date: "2020-02-05T16:33:06.386Z"},
        {value: -1000, date: "2020-04-10T14:43:26.374Z"},
        {value: 8500, date: "2020-06-25T18:49:59.371Z"},
        {value: -30, date: "2020-07-26T12:01:20.894Z"}
    ],
    interestRate: 1.5,
    pin: 2222,
    currency: "USD",
    locale: "en-US",
};

const accounts = [account1, account2];


////////////////////////////////////////////
// Elements

const labelWelcome = document.querySelector('.welcome');
const labelDate = document.querySelector('.date');
const labelBalance = document.querySelector('.balance__value');
const labelSumIn = document.querySelector('.summary__value--in');
const labelSumOut = document.querySelector('.summary__value--out');
const labelSumInterest = document.querySelector('.summary__value--interest');
const labelTimer = document.querySelector('.timer');

const containerApp = document.querySelector('.app');
const containerMovements = document.querySelector('.movements');

const btnLogin = document.querySelector('.login__btn');
const btnTransfer = document.querySelector('.form__btn--transfer');
const btnLoan = document.querySelector('.form__btn--loan');
const btnClose = document.querySelector('.form__btn--close');
const btnSort = document.querySelector('.btn--sort');

const inputLoginUsername = document.querySelector('.login__input--user');
const inputLoginPin = document.querySelector('.login__input--pin');
const inputTransferTo = document.querySelector('.form__input--to');
const inputTransferAmount = document.querySelector('.form__input--amount');
const inputLoanAmount = document.querySelector('.form__input--loan-amount');
const inputCloseUsername = document.querySelector('.form__input--user');
const inputClosePin = document.querySelector('.form__input--pin');


////////////////////////////////////////////
// Display movements functionality

const formatMovementDate = function (date, locale) {
    const calcHoursPassed = function (date1, date2) {
        return Math.floor(Math.abs((date1 - date2) / (1000 * 60 * 60)));
    };

    const hoursPassed = calcHoursPassed(new Date(), date);

    if (hoursPassed === 0) {
        return "now";
    }

    if (hoursPassed < 24) {
        return `${hoursPassed} ${hoursPassed === 1 ? "hour" : "hours"} ago`;
    }

    if (hoursPassed / 24 <= 7) {
        return `${Math.floor(hoursPassed / 24)} ${Math.floor(hoursPassed / 24) === 1 ? "day" : "days"} ago`;
    }

    return new Intl.DateTimeFormat(locale).format(date);
};

const formatCurrency = function (value, locale, currency) {
    return new Intl.NumberFormat(locale, {
        style: "currency",
        currency: currency
    }).format(value);
};

const displayMovements = function (account, sorted = false) {
    // Delete all the elements that are currently present
    containerMovements.innerHTML = "";

    // Get the movements to be displayed
    const movementsToDisplay = sorted ? account.movements.slice().sort(function (a, b) {
        return a.value - b.value;
    }) : account.movements;

    // Build the movement elements and display them
    movementsToDisplay.forEach(function (movement, i) {
        const type = movement.value > 0 ? "deposit" : "withdrawal";

        const displayDate = formatMovementDate(new Date(movement.date), account.locale);

        const html = `
          <div class="movements__row">
            <div class="movements__type movements__type--${type}">${i + 1} ${type}</div>
            <div class="movements__date">${displayDate}</div>
            <div class="movements__value">${formatCurrency(movement.value.toFixed(2), account.locale, account.currency)}</div>
          </div>`;

        containerMovements.insertAdjacentHTML('afterbegin', html);
    });
};


////////////////////////////////////////////
// Calculate and display balance

const calcDisplayBalance = function (account) {
    account.balance = account.movements.reduce(function (acc, mov) {
        return acc + mov.value;
    }, 0);
    labelBalance.textContent = `${formatCurrency(account.balance.toFixed(2), account.locale, account.currency)}`;
};


////////////////////////////////////////////
// Calculate and display summary

const calculateIncome = function (account) {
    return account.movements
        .filter(function (movement) {
            return movement.value > 0;
        })
        .reduce(function (acc, deposit) {
            return acc + deposit.value;
        }, 0);
};

const calculateOutcome = function (account) {
    return account.movements
        .filter(function (movement) {
            return movement.value < 0;
        })
        .reduce(function (acc, withdrawal) {
            return acc + withdrawal.value;
        }, 0);
};

const calculateInterest = function (account) {
    return account.movements
        .filter(function (movement) {
            return movement.value > 0;
        })
        .map(function (deposit) {
            return deposit.value * account.interestRate / 100;
        })
        .filter(function (interest) {
            return interest >= 1;
        })
        .reduce(function (acc, interest) {
            return acc + interest;
        }, 0);
};

const displaySummary = function (account) {
    const income = calculateIncome(account);
    labelSumIn.textContent = `${formatCurrency(income, account.locale, account.currency)}`;
    const outcome = Math.abs(calculateOutcome(account));
    labelSumOut.textContent = `${formatCurrency(outcome, account.locale, account.currency)}`;
    const interest = calculateInterest(account);
    labelSumInterest.textContent = `${formatCurrency(interest, account.locale, account.currency)}`;
};


////////////////////////////////////////////
// Create usernames

const createUsernames = function (accounts) {
    accounts.forEach(function (account) {
        account.username = account.owner
            .toLowerCase()
            .split(" ")
            .map(function (name) {
                return name[0];
            })
            .join("");
    });
};
createUsernames(accounts);


////////////////////////////////////////////
// Update UI

const updateUI = function (account) {
    // Display movements
    displayMovements(account);

    // Display summary
    displaySummary(account);

    // Display balance
    calcDisplayBalance(account);
};


// Event handlers

let currentAccount, timerID;


////////////////////////////////////////////
// Login action

const startLogOutTimer = function () {
    // Set the time to 5 minutes
    let time = 300;

    const tick = function () {
        const minutes = String(Math.floor(time / 60)).padStart(2, "0");
        const seconds = String(time % 60).padStart(2, "0");

        // In each call print the remaining time UI
        labelTimer.textContent = `${minutes}:${seconds}`;

        // When 0 seconds, stop timer and logout user
        if (time === 0) {
            clearInterval(timerID);
            timerID = undefined;
            labelWelcome.textContent = "Log in to get started";
            containerApp.style.opacity = "0";
        }

        time--;
    };

    // Call the timer every second
    tick();
    return setInterval(tick, 1000);
};

btnLogin.addEventListener("click", function (e) {
    // Prevent from submitting
    e.preventDefault();

    // Get the current account
    currentAccount = accounts.find(function (account) {
        return account.username === inputLoginUsername.value && account.pin === Number(inputLoginPin.value);
    });

    // check if the account exists
    if (currentAccount) {
        // Display UI and message
        labelWelcome.textContent = `Welcome back, ${currentAccount.owner.split(" ")[0]}`;
        containerApp.style.opacity = "100";

        // Create current date and time
        const now = new Date();
        labelDate.textContent = new Intl.DateTimeFormat(currentAccount.locale, {
            year: "numeric",
            month: "numeric",
            day: "numeric",
            hour: "numeric",
            minute: "numeric"
        }).format(now);

        // start the timer
        if (timerID) {
            clearInterval(timerID);
        }
        timerID = startLogOutTimer();

        // Clear input fields
        inputLoginUsername.value = inputLoginPin.value = "";
        inputLoginPin.blur();

        // Update UI
        updateUI(currentAccount);
    }
});


////////////////////////////////////////////
// Transfer action

btnTransfer.addEventListener("click", function (e) {
    e.preventDefault();

    // get the receiver account
    const amount = Number(inputTransferAmount.value);
    const receiverAcc = accounts.find(function (account) {
        return account.username === inputTransferTo.value;
    });
    inputTransferAmount.value = inputTransferTo.value = "";

    // if the receiver exists
    if (amount > 0 && receiverAcc && currentAccount.balance >= amount && receiverAcc.username !== currentAccount.username) {
        // Doing the transfer
        currentAccount.movements.push({value: -1 * amount, date: new Date().toISOString()});
        receiverAcc.movements.push({value: amount, date: new Date().toISOString()});

        // Update UI
        updateUI(currentAccount);

        // Reset timer
        clearInterval(timerID);
        timerID = startLogOutTimer();
    }
});


////////////////////////////////////////////
// Loan action

btnLoan.addEventListener("click", function (e) {
    e.preventDefault();

    const amount = Math.floor(Number(inputLoanAmount.value));
    if (amount > 0 && currentAccount.movements.some(function (movement) {
        return movement.value >= amount * 0.1;
    })) {
        // Reset timer
        clearInterval(timerID);
        timerID = startLogOutTimer();

        // Wait for bank to make the transfer
        setTimeout(function () {
            // Add movement
            currentAccount.movements.push({value: amount, date: new Date().toISOString()});

            // Update UI
            updateUI(currentAccount);
        }, 2500);
    }
    inputLoanAmount.value = "";
});


////////////////////////////////////////////
// Close action

btnClose.addEventListener("click", function (e) {
    e.preventDefault();

    if (inputCloseUsername.value === currentAccount.username && Number(inputClosePin.value) === currentAccount.pin) {
        const index = accounts.findIndex(function (account) {
            return account.username === currentAccount.username;
        });

        // Delete account
        accounts.splice(index, 1);
        currentAccount = undefined;

        // Hide UI
        containerApp.style.opacity = "0";
        labelWelcome.textContent = "Log in to get started";

        // Clear timer
        clearInterval(timerID);
        timerID = undefined;
    }

    inputCloseUsername.value = inputClosePin.value = "";
});


////////////////////////////////////////////
// Sort functionality

let sorted = false;
btnSort.addEventListener("click", function (e) {
    e.preventDefault();

    sorted = !sorted;
    displayMovements(currentAccount, sorted);
});