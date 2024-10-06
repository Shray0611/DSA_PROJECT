const gridSize = 5;
let currentPlayer = 1;
let player1Score = 0;
let player2Score = 0;

const playerTurnElement = document.getElementById('playerTurn');
const player1Element = document.getElementById('player1');
const player2Element = document.getElementById('player2');
const gridElement = document.getElementById('grid');

function createGrid() {
    for (let row = 0; row < gridSize; row++) {
        for (let col = 0; col < gridSize; col++) {
            const dot = document.createElement('div');
            dot.classList.add('dot');
            gridElement.appendChild(dot);

            if (col < gridSize - 1) {
                const hLine = document.createElement('div');
                hLine.classList.add('line', 'horizontal');
                hLine.addEventListener('click', () => handleLineClick(hLine, 'horizontal', row, col));
                gridElement.appendChild(hLine);
            }
        }

        if (row < gridSize - 1) {
            for (let col = 0; col < gridSize; col++) {
                const vLine = document.createElement('div');
                vLine.classList.add('line', 'vertical');
                vLine.addEventListener('click', () => handleLineClick(vLine, 'vertical', row, col));
                gridElement.appendChild(vLine);

                if (col < gridSize - 1) {
                    const box = document.createElement('div');
                    box.classList.add('box');
                    box.dataset.owner = '';
                    gridElement.appendChild(box);
                }
            }
        }
    }
}

function handleLineClick(lineElement, direction, row, col) {
    if (lineElement.classList.contains('taken')) return;

    lineElement.classList.add('taken');

    const completedBoxes = checkCompletedBoxes(row, col, direction);
    if (completedBoxes.length > 0) {
        completedBoxes.forEach(box => {
            box.classList.add(`player${currentPlayer}`);
            box.dataset.owner = currentPlayer;
        });

        updateScore(completedBoxes.length);
    } else {
        switchPlayer();
    }

    updateTurnDisplay();
}

function checkCompletedBoxes(row, col, direction) {
    const completedBoxes = [];

    if (direction === 'horizontal') {
        if (row > 0 && isBoxComplete(row - 1, col)) {
            completedBoxes.push(getBoxElement(row - 1, col));
        }
        if (row < gridSize - 1 && isBoxComplete(row, col)) {
            completedBoxes.push(getBoxElement(row, col));
        }
    } else if (direction === 'vertical') {
        if (col > 0 && isBoxComplete(row, col - 1)) {
            completedBoxes.push(getBoxElement(row, col - 1));
        }
        if (col < gridSize - 1 && isBoxComplete(row, col)) {
            completedBoxes.push(getBoxElement(row, col));
        }
    }

    return completedBoxes;
}

function isBoxComplete(row, col) {
    const horizontalTop = getLineElement(row, col, 'horizontal');
    const horizontalBottom = getLineElement(row + 1, col, 'horizontal');
    const verticalLeft = getLineElement(row, col, 'vertical');
    const verticalRight = getLineElement(row, col + 1, 'vertical');

    return (
        horizontalTop && horizontalBottom &&
        verticalLeft && verticalRight &&
        horizontalTop.classList.contains('taken') &&
        horizontalBottom.classList.contains('taken') &&
        verticalLeft.classList.contains('taken') &&
        verticalRight.classList.contains('taken')
    );
}

function getLineElement(row, col, direction) {
    const index = (direction === 'horizontal')
        ? (row * (2 * gridSize - 1) + col * 2 + 1)
        : ((row * (2 * gridSize - 1)) + col * 2 + gridSize * 2 - 1);
    return gridElement.children[index];
}

function getBoxElement(row, col) {
    const index = row * (2 * gridSize - 1) * 2 + col * 2 + 1 + gridSize - 1;
    return gridElement.children[index];
}

function updateScore(points) {
    const scoreElement = currentPlayer === 1 ? player1Element : player2Element;
    const score = currentPlayer === 1 ? player1Score : player2Score;

    if (currentPlayer === 1) {
        player1Score += points;
    } else {
        player2Score += points;
    }

    scoreElement.textContent = `Player ${currentPlayer}: ${score + points}`;
    scoreElement.classList.add('point-change');
    setTimeout(() => scoreElement.classList.remove('point-change'), 500);
}

function switchPlayer() {
    currentPlayer = currentPlayer === 1 ? 2 : 1;
}

function updateTurnDisplay() {
    playerTurnElement.textContent = `Player ${currentPlayer}'s turn`;
    player1Element.classList.toggle('highlight', currentPlayer === 1);
    player2Element.classList.toggle('highlight', currentPlayer === 2);
}

createGrid();