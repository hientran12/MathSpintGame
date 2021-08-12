const PLUS = '+';
const MINUS = '-';
const MULTI = 'x';
const OPERATORS = [PLUS, MINUS, MULTI];

let firstNumber = 0;
let secondNumber = 0;
let operator = '';

// Get random number up to max
function getRandom(max) {
    return Math.floor(Math.random() * Math.floor(max));
}

function getRandomOperators() {
    return OPERATORS[getRandom(3)];
}

function calculate(n1, n2, o){
    switch (o) {
        case PLUS: return n1 + n2;
        case MINUS: return n1 - n2;
        case MULTI: return n1 * n2;
    }
}

// Random A Correct Equation
function randomACorrectEquation() {
    firstNumber = getRandom(9) + 1;
    secondNumber = getRandom(9) + 1;
    operator = getRandomOperators();
    equationValue = calculate(firstNumber, secondNumber, operator);
    return `${firstNumber} ${operator} ${secondNumber} = ${equationValue}`;
}

// Random An Incorrect Equation
function randomAnIncorrectEquation() {
    firstNumber = getRandom(9) + 1;
    secondNumber = getRandom(9) + 1;
    operator = getRandomOperators();
    equationValue = calculate(firstNumber, secondNumber, operator);
    wrongFormat[0] = `${firstNumber} ${operator} ${secondNumber + 1} = ${equationValue}`;
    wrongFormat[1] = `${firstNumber} ${operator} ${secondNumber} = ${equationValue - 1}`;
    wrongFormat[2] = `${firstNumber + 1} ${operator} ${secondNumber} = ${equationValue}`;
    const formatChoice = getRandom(3);
    return wrongFormat[formatChoice];
}