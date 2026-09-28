/* =========================================
   SCIENTIFIC CALCULATOR
   OIB-SIP WEB DEVELOPMENT
========================================= */


/* =========================================
   DOM ELEMENTS
========================================= */

const expressionDisplay =
    document.getElementById("expression-display");

const resultDisplay =
    document.getElementById("result-display");

const scientificPanel =
    document.getElementById("scientific-panel");

const scientificToggle =
    document.getElementById("scientific-toggle");

const angleModeButton =
    document.getElementById("angle-mode");

const historyList =
    document.getElementById("history-list");

const clearHistoryButton =
    document.getElementById("clear-history");


/* =========================================
   VARIABLES
========================================= */

let expression = "";

let angleMode = "DEG";

let history = [];

let scientificMode = false;


/* =========================================
   SCIENTIFIC MODE TOGGLE
========================================= */

scientificToggle.addEventListener(
    "click",
    () => {

        scientificMode =
            !scientificMode;


        if (scientificMode) {

            scientificPanel.classList.add(
                "active"
            );

            scientificToggle.textContent =
                "Basic";

        } else {

            scientificPanel.classList.remove(
                "active"
            );

            scientificToggle.textContent =
                "ƒx";

        }

    }
);


/* =========================================
   GET ALL CALCULATOR VALUE BUTTONS
========================================= */

const valueButtons =
    document.querySelectorAll(
        "button[data-value]"
    );


valueButtons.forEach(button => {

    button.addEventListener(
        "click",
        () => {

            const value =
                button.dataset.value;

            addToExpression(value);

        }
    );

});


/* =========================================
   ACTION BUTTONS
========================================= */

const actionButtons =
    document.querySelectorAll(
        "button[data-action]"
    );


actionButtons.forEach(button => {

    button.addEventListener(
        "click",
        () => {

            const action =
                button.dataset.action;


            if (action === "clear") {

                clearCalculator();

            }


            if (action === "backspace") {

                backspace();

            }


            if (action === "calculate") {

                calculate();

            }

        }
    );

});


/* =========================================
   ANGLE MODE
========================================= */

angleModeButton.addEventListener(
    "click",
    () => {

        if (angleMode === "DEG") {

            angleMode = "RAD";

        } else {

            angleMode = "DEG";

        }


        angleModeButton.textContent =
            angleMode;

    }
);


/* =========================================
   ADD VALUE
========================================= */

function addToExpression(value) {

    /*
       Start a new expression if the
       previous result was an error.
    */

    if (
        resultDisplay.textContent ===
        "Error"
    ) {

        expression = "";

        resultDisplay.textContent = "0";

    }


    expression += value;

    updateExpressionDisplay();

}


/* =========================================
   DISPLAY EXPRESSION
========================================= */

function updateExpressionDisplay() {

    let displayExpression =
        expression
            .replaceAll("*", " × ")
            .replaceAll("/", " ÷ ")
            .replaceAll("+", " + ")
            .replaceAll("-", " − ");


    expressionDisplay.textContent =
        displayExpression || "0";

}


/* =========================================
   CLEAR
========================================= */

function clearCalculator() {

    expression = "";

    expressionDisplay.textContent =
        "0";

    resultDisplay.textContent =
        "0";

}


/* =========================================
   BACKSPACE
========================================= */

function backspace() {

    if (
        expression.length === 0
    ) {

        return;

    }


    expression =
        expression.slice(0, -1);


    updateExpressionDisplay();

}


/* =========================================
   CALCULATE
========================================= */

function calculate() {

    if (
        expression.trim() === ""
    ) {

        return;

    }


    try {

        const result =
            evaluateExpression(
                expression
            );


        if (
            !Number.isFinite(result)
        ) {

            throw new Error(
                "Invalid calculation"
            );

        }


        const formattedResult =
            formatResult(result);


        resultDisplay.textContent =
            formattedResult;


        addHistory(
            expression,
            formattedResult
        );


    } catch (error) {

        resultDisplay.textContent =
            "Error";

    }

}


/* =========================================
   FORMAT RESULT
========================================= */

function formatResult(number) {

    if (
        Math.abs(number) < 1e-12
    ) {

        number = 0;

    }


    if (
        Number.isInteger(number)
    ) {

        return number.toString();

    }


    return Number(
        number.toFixed(10)
    ).toString();

}


/* =========================================
   EXPRESSION EVALUATOR
========================================= */

function evaluateExpression(input) {

    const tokens =
        tokenize(input);


    const parser =
        new Parser(tokens);


    const result =
        parser.parseExpression();


    if (
        parser.position <
        parser.tokens.length
    ) {

        throw new Error(
            "Unexpected token"
        );

    }


    return result;

}


/* =========================================
   TOKENIZER
========================================= */

function tokenize(input) {

    const tokens = [];

    let i = 0;


    while (i < input.length) {

        const char =
            input[i];


        /* Spaces */

        if (
            /\s/.test(char)
        ) {

            i++;

            continue;

        }


        /* Numbers */

        if (
            /[0-9.]/.test(char)
        ) {

            let number = "";


            while (
                i < input.length &&
                /[0-9.]/.test(input[i])
            ) {

                number += input[i];

                i++;

            }


            if (
                number.split(".").length > 2
            ) {

                throw new Error(
                    "Invalid number"
                );

            }


            tokens.push({
                type: "number",
                value: parseFloat(number)
            });


            continue;

        }


        /* PI */

        if (char === "π") {

            tokens.push({
                type: "constant",
                value: Math.PI
            });

            i++;

            continue;

        }


        /* Operators */

        if (
            "+-*/^%!".includes(char)
        ) {

            tokens.push({
                type: "operator",
                value: char
            });

            i++;

            continue;

        }


        /* Parentheses */

        if (
            char === "(" ||
            char === ")"
        ) {

            tokens.push({
                type: "parenthesis",
                value: char
            });

            i++;

            continue;

        }


        /* Functions */

        if (
            /[a-zA-Z]/.test(char)
        ) {

            let name = "";


            while (
                i < input.length &&
                /[a-zA-Z]/.test(input[i])
            ) {

                name += input[i];

                i++;

            }


            if (name === "e") {

                tokens.push({
                    type: "constant",
                    value: Math.E
                });

            } else {

                tokens.push({
                    type: "function",
                    value: name
                });

            }


            continue;

        }


        throw new Error(
            "Unknown character"
        );

    }


    return tokens;

}


/* =========================================
   PARSER
========================================= */

class Parser {

    constructor(tokens) {

        this.tokens = tokens;

        this.position = 0;

    }


    current() {

        return this.tokens[
            this.position
        ];

    }


    matchOperator(operator) {

        const token =
            this.current();


        if (
            token &&
            token.type === "operator" &&
            token.value === operator
        ) {

            this.position++;

            return true;

        }


        return false;

    }


    matchParenthesis(value) {

        const token =
            this.current();


        if (
            token &&
            token.type === "parenthesis" &&
            token.value === value
        ) {

            this.position++;

            return true;

        }


        return false;

    }


    /* Addition / subtraction */

    parseExpression() {

        let value =
            this.parseTerm();


        while (true) {

            if (
                this.matchOperator("+")
            ) {

                value +=
                    this.parseTerm();

            }

            else if (
                this.matchOperator("-")
            ) {

                value -=
                    this.parseTerm();

            }

            else {

                break;

            }

        }


        return value;

    }


    /* Multiplication / division */

    parseTerm() {

        let value =
            this.parsePower();


        while (true) {

            if (
                this.matchOperator("*")
            ) {

                value *=
                    this.parsePower();

            }

            else if (
                this.matchOperator("/")
            ) {

                const divisor =
                    this.parsePower();


                if (
                    divisor === 0
                ) {

                    throw new Error(
                        "Division by zero"
                    );

                }


                value /= divisor;

            }

            else {

                break;

            }

        }


        return value;

    }


    /* Powers */

    parsePower() {

        let value =
            this.parseUnary();


        if (
            this.matchOperator("^")
        ) {

            const exponent =
                this.parsePower();


            value =
                Math.pow(
                    value,
                    exponent
                );

        }


        return this.applyPostfix(value);

    }


    /* Unary */

    parseUnary() {

        if (
            this.matchOperator("-")
        ) {

            return -
                this.parseUnary();

        }


        if (
            this.matchOperator("+")
        ) {

            return this.parseUnary();

        }


        return this.parsePrimary();

    }


    /* Primary */

    parsePrimary() {

        const token =
            this.current();


        if (!token) {

            throw new Error(
                "Unexpected end"
            );

        }


        /* Number */

        if (
            token.type === "number"
        ) {

            this.position++;

            return token.value;

        }


        /* Constant */

        if (
            token.type === "constant"
        ) {

            this.position++;

            return token.value;

        }


        /* Parentheses */

        if (
            token.type === "parenthesis" &&
            token.value === "("
        ) {

            this.position++;


            const value =
                this.parseExpression();


            if (
                !this.matchParenthesis(")")
            ) {

                throw new Error(
                    "Missing parenthesis"
                );

            }


            return value;

        }


        /* Function */

        if (
            token.type === "function"
        ) {

            this.position++;


            if (
                !this.matchParenthesis("(")
            ) {

                throw new Error(
                    "Function requires parentheses"
                );

            }


            const argument =
                this.parseExpression();


            if (
                !this.matchParenthesis(")")
            ) {

                throw new Error(
                    "Missing parenthesis"
                );

            }


            return applyFunction(
                token.value,
                argument
            );

        }


        throw new Error(
            "Unexpected token"
        );

    }


    /* Factorial / percentage */

    applyPostfix(value) {

        while (true) {

            if (
                this.matchOperator("!")
            ) {

                value =
                    factorial(value);

            }

            else if (
                this.matchOperator("%")
            ) {

                value =
                    value / 100;

            }

            else {

                break;

            }

        }


        return value;

    }

}


/* =========================================
   SCIENTIFIC FUNCTIONS
========================================= */

function applyFunction(
    name,
    value
) {

    switch (name) {

        case "sin":

            return Math.sin(
                toRadians(value)
            );


        case "cos":

            return Math.cos(
                toRadians(value)
            );


        case "tan":

            return Math.tan(
                toRadians(value)
            );


        case "asin":

            return fromRadians(
                Math.asin(value)
            );


        case "acos":

            return fromRadians(
                Math.acos(value)
            );


        case "atan":

            return fromRadians(
                Math.atan(value)
            );


        case "sqrt":

            if (value < 0) {

                throw new Error(
                    "Invalid square root"
                );

            }

            return Math.sqrt(value);


        case "log":

            if (value <= 0) {

                throw new Error(
                    "Invalid logarithm"
                );

            }

            return Math.log10(value);


        case "ln":

            if (value <= 0) {

                throw new Error(
                    "Invalid logarithm"
                );

            }

            return Math.log(value);


        default:

            throw new Error(
                "Unknown function"
            );

    }

}


/* =========================================
   DEG / RAD
========================================= */

function toRadians(value) {

    if (
        angleMode === "DEG"
    ) {

        return (
            value * Math.PI / 180
        );

    }


    return value;

}


function fromRadians(value) {

    if (
        angleMode === "DEG"
    ) {

        return (
            value * 180 / Math.PI
        );

    }


    return value;

}


/* =========================================
   FACTORIAL
========================================= */

function factorial(number) {

    if (
        number < 0 ||
        !Number.isInteger(number)
    ) {

        throw new Error(
            "Factorial requires a non-negative integer"
        );

    }


    if (
        number > 170
    ) {

        throw new Error(
            "Number too large"
        );

    }


    let result = 1;


    for (
        let i = 2;
        i <= number;
        i++
    ) {

        result *= i;

    }


    return result;

}


/* =========================================
   HISTORY
========================================= */

function addHistory(
    calculation,
    result
) {

    history.unshift({
        calculation,
        result
    });


    if (
        history.length > 10
    ) {

        history.pop();

    }


    renderHistory();

}


function renderHistory() {

    historyList.innerHTML = "";


    if (
        history.length === 0
    ) {

        historyList.innerHTML =
            '<p class="empty-history">No calculations yet</p>';

        return;

    }


    history.forEach(item => {

        const historyItem =
            document.createElement("div");


        historyItem.className =
            "history-item";


        const calculation =
            document.createElement("span");


        calculation.textContent =
            item.calculation;


        const result =
            document.createElement("span");


        result.className =
            "history-result";


        result.textContent =
            item.result;


        historyItem.appendChild(
            calculation
        );


        historyItem.appendChild(
            result
        );


        historyList.appendChild(
            historyItem
        );

    });

}


/* =========================================
   CLEAR HISTORY
========================================= */

clearHistoryButton.addEventListener(
    "click",
    () => {

        history = [];

        renderHistory();

    }
);


/* =========================================
   KEYBOARD SUPPORT
========================================= */

document.addEventListener(
    "keydown",
    event => {

        const key =
            event.key;


        /* Numbers and decimal */

        if (
            /^[0-9.]$/.test(key)
        ) {

            addToExpression(key);

            return;

        }


        /* Operators */

        if (
            [
                "+",
                "-",
                "*",
                "/",
                "^",
                "%"
            ].includes(key)
        ) {

            addToExpression(key);

            return;

        }


        /* Parentheses */

        if (
            key === "(" ||
            key === ")"
        ) {

            addToExpression(key);

            return;

        }


        /* Enter */

        if (
            key === "Enter" ||
            key === "="
        ) {

            calculate();

            return;

        }


        /* Backspace */

        if (
            key === "Backspace"
        ) {

            backspace();

            return;

        }


        /* Escape */

        if (
            key === "Escape"
        ) {

            clearCalculator();

        }

    }
);


/* =========================================
   INITIALIZE
========================================= */

renderHistory();

updateExpressionDisplay();