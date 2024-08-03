const gameBoard = document.getElementById('gameBoard');
const cells = Array.from(document.getElementsByClassName('cell'));
const statusDiv = document.getElementById('status');
const resetBtn = document.getElementById('resetBtn');
const twoPlayerBtn = document.getElementById('twoPlayerBtn');
const computerBtn = document.getElementById('computerBtn');

let isPlayerX = true;
let gameState = ["", "", "", "", "", "", "", "", ""];
let gameActive = true;
let vsComputer = false;

const winningConditions = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
    [0, 4, 8],
    [2, 4, 6]
];

const winningMessage = () => `Player ${isPlayerX ? 'O' : 'X'} has won!`; // Note: 'isPlayerX' is toggled after the move
const drawMessage = () => `Game ended in a draw!`;
const currentPlayerTurn = () => `Player ${isPlayerX ? 'X' : 'O'}'s turn`;

function handleCellClick(event) {
    const clickedCell = event.target;
    const clickedCellIndex = parseInt(clickedCell.getAttribute('data-index'));

    if (gameState[clickedCellIndex] !== "" || !gameActive) {
        return;
    }

    handleCellPlayed(clickedCell, clickedCellIndex);
    handleResultValidation();

    if (vsComputer && gameActive && !isPlayerX) {
        setTimeout(handleComputerMove, 500); // Add delay for better user experience
    }
}

function handleCellPlayed(clickedCell, index) {
    gameState[index] = isPlayerX ? "X" : "O";
    clickedCell.textContent = isPlayerX ? "X" : "O";
    isPlayerX = !isPlayerX;
    if (gameActive) {
        statusDiv.textContent = currentPlayerTurn();
    }
}

function handleResultValidation() {
    let roundWon = false;
    for (let i = 0; i < winningConditions.length; i++) {
        const winCondition = winningConditions[i];
        let a = gameState[winCondition[0]];
        let b = gameState[winCondition[1]];
        let c = gameState[winCondition[2]];

        if (a === "" || b === "" || c === "") {
            continue;
        }
        if (a === b && b === c) {
            roundWon = true;
            break;
        }
    }

    if (roundWon) {
        statusDiv.textContent = winningMessage();
        gameActive = false;
        return;
    }

    if (!gameState.includes("")) {
        statusDiv.textContent = drawMessage();
        gameActive = false;
        return;
    }
}

function handleComputerMove() {
    let emptyCells = gameState.map((cell, index) => cell === "" ? index : null).filter(index => index !== null);
    let randomIndex = emptyCells[Math.floor(Math.random() * emptyCells.length)];
    gameState[randomIndex] = "O";
    cells[randomIndex].textContent = "O";
    isPlayerX = true;
    statusDiv.textContent = currentPlayerTurn();
    handleResultValidation();
}

function resetGame() {
    gameState = ["", "", "", "", "", "", "", "", ""];
    isPlayerX = true;
    gameActive = true;
    statusDiv.textContent = currentPlayerTurn();
    cells.forEach(cell => cell.textContent = "");
}

cells.forEach(cell => cell.addEventListener('click', handleCellClick));
resetBtn.addEventListener('click', resetGame);
twoPlayerBtn.addEventListener('click', () => {
    vsComputer = false;
    resetGame();
    statusDiv.textContent = currentPlayerTurn();
});
computerBtn.addEventListener('click', () => {
    vsComputer = true;
    resetGame();
    statusDiv.textContent = currentPlayerTurn();
});
