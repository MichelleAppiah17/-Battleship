const gameStarted = false;
// Creating boards for user, and opponent
const gameboardContainer = document.querySelector(".gameBoardContainer");

function createBoard(boardName, boardColor) { // boardName = yourBoard OR opponentBoard
    const board = document.createElement('div');
    board.classList.add('board');
    board.classList.add(boardName);
    board.style.backgroundColor = boardColor;
    for (let i = 0; i < 100; i++) {
        const square = document.createElement('div');
        square.classList.add("square");
        square.id = i;
        board.appendChild(square);
    }
    gameboardContainer.appendChild(board);
}

createBoard('yourBoard')
const shipsContainer = document.querySelector('.shipsContainer');
gameboardContainer.appendChild(shipsContainer);
createBoard('opponentBoard')

// Ship arrangement
const gameShips = document.querySelectorAll('.ship');
const squares = document.querySelectorAll('.square');

//Ship Rotation on doubleclick
let selectedShip = null;

function rotateShip(event) {
    const selectedShip = event.target;
    selectedShip.classList.toggle("rotated");
}
gameShips.forEach(ship => {
    ship.addEventListener('dblclick', rotateShip);
});

const opponentBoard = document.querySelector(".opponentBoard"); 

const ships = [
    { name: "carrier", size: 5, id: "carrier" },
    { name: "battleship", size: 4, id: "battleship" },
    { name: "cruiser", size: 3, id: "cruiser" },
    { name: "submarine", size: 3, id: "submarine" },
    { name: "destroyer", size: 2, id: "destroyer" },
];

const gridSize = 10;

const grid = new Array(gridSize).fill(null).map(() => new Array(gridSize).fill(false));

const playerGrid = new Array(gridSize).fill(null).map(() => new Array(gridSize).fill(false));
const opponentGrid = new Array(gridSize).fill(null).map(() => new Array(gridSize).fill(false));


function randomPositionShips(size) {
    const isHorizontal = Math.random() < 0.5;
    const maxPosition = gridSize - (isHorizontal ? size : 1);
    const randomRow = Math.floor(Math.random() * gridSize);
    const randomColumn = Math.floor(Math.random() * maxPosition);
    return { randomRow, randomColumn, isHorizontal };
}

function correctPosition(ship, position, targetGrid) {
    const { randomRow, randomColumn, isHorizontal } = position;

    for (let i = 0; i < ship.size; i++) {
        if (isHorizontal) {
            if (randomColumn + i >= targetGrid[0].length || !targetGrid[randomRow] || targetGrid[randomRow][randomColumn + i]) {
                return false;
            }
        } else {
            if (randomRow + i >= targetGrid.length || !targetGrid[randomRow + i] || targetGrid[randomRow + i][randomColumn]) return false;
        }
    }
    return true;
}


function positionShip(ship, targetGrid) {
    let position;
    do {
        position = randomPositionShips(ship.size);
    } while (!correctPosition(ship, position, targetGrid));

    const { randomRow, randomColumn, isHorizontal } = position;

    for (let i = 0; i < ship.size; i++) {
        if (isHorizontal) {
            targetGrid[randomRow][randomColumn + i] = true;
        } else {
            targetGrid[randomRow + i][randomColumn] = true;
        }
    }
    ship.position = position;
}


ships.forEach(ship => positionShip(ship, opponentGrid));

for (let row = 0; row < gridSize; row++) {
    for (let col = 0; col < gridSize; col++) {
        const square = document.querySelector(`.opponentBoard .square[id="${row * gridSize + col}"]`);

        const ship = ships.find(ship => {
            const { randomRow: shipRow, randomColumn: shipCol, isHorizontal } = ship.position;
            if (isHorizontal) {
                return row === shipRow && col >= shipCol && col < shipCol + ship.size;
            } else {
                return col === shipCol && row >= shipRow && row < shipRow + ship.size;
            }
        });

        if (ship) {
            square.style.backgroundColor = getComputedStyle(document.querySelector(`.${ship.name}`)).backgroundColor;
            // opponentBoard.style.backgroundColor = "pink"
            square.style.backgroundColor ="pink"
        }
    }
}

let currentShip = null;
const occupiedCells = new Set();

gameShips.forEach(ship => {
    ship.addEventListener('click', () => {
        if (currentShip) {
            currentShip.classList.remove('selected');
        }
            currentShip = ship;
            currentShip.classList.add('selected');
        
    });
});

const yourBoard = document.querySelector('.yourBoard')
yourBoard.addEventListener('click', (e) => {
    if (currentShip) {
        const square = e.target;

        const row = parseInt(square.id / gridSize);
        const col = square.id % gridSize;

        const position = {
            randomRow: row,
            randomColumn: col,
            isHorizontal: !currentShip.classList.contains('rotated'),
        };

        const canFit = canShipFit(currentShip, position);

        if (canFit && correctPosition(currentShip, position) && !doesOverlap(position, currentShip)) {

            for (let i = 0; i < currentShip.getAttribute('data-size'); i++) {
                if (position.isHorizontal) {
                    grid[row][col + i] = true;
                } else {
                    grid[row + i][col] = true;
                }
                occupiedCells.add(row * gridSize + col + (position.isHorizontal ? i : i * gridSize));
            }
            currentShip.position = position;

            for (let i = 0; i < currentShip.getAttribute('data-size'); i++) {
                const cellId = row * gridSize + col + (position.isHorizontal ? i : i * gridSize);
                const cell = document.querySelector(`.yourBoard .square[id="${cellId}"]`);
                cell.classList.add('occupied');
                cell.style.backgroundColor = window.getComputedStyle(currentShip).backgroundColor;
                cell.style.backgroundColor = "purple"
            }

            currentShip.style.display = 'none';
            currentShip.classList.remove('selected'); 
            currentShip = null;
        }
    }

});

function doesOverlap(position, ship) {
    const { randomRow, randomColumn, isHorizontal } = position;

    for (let i = 0; i < ship.getAttribute('data-size'); i++) {
        const cellId = randomRow * gridSize + randomColumn + (isHorizontal ? i : i * gridSize);
        if (occupiedCells.has(cellId)) return true;
    }
    return false;
}

function canShipFit(ship, position) {
    const gridSize = 10; 
    const { randomRow, randomColumn, isHorizontal } = position;
    const shipSize = parseInt(ship.getAttribute('data-size'));

    if (isHorizontal) {
        if (randomColumn + shipSize > gridSize) {
            return false; 
        }
    } else {
        if (randomRow + shipSize > gridSize) {
            return false; 
        }
    }
    return true; 
}

const opponentSquares = opponentBoard.querySelectorAll('.square');

const startButton = document.querySelector('.startBtn');

const arrangeShipsButton = document.querySelector('.arrangeShipsBtn');

arrangeShipsButton.addEventListener('click', () => {
    shipsContainer.style.display = 'flex';
    arrangeShipsButton.style.display = 'none';
    startButton.style.display = 'flex';
});

const yourSquares = document.querySelectorAll('.yourBoard .square');

let yourHits = 0;
let computerHits = 0;
let gameIsOver = false;

function handleSquareClick(square, targetGrid) {
    if (gameIsOver || square.classList.contains('checked')) {
        return;
    }

  const row = parseInt(square.id / gridSize);
  const col = square.id % gridSize;
  const containsShip = targetGrid[row][col];

  if (containsShip) {
    square.classList.add('hit'); // Adding the 'hit' class
    if (square.parentElement.classList.contains('opponentBoard')) {
        yourHits++;
    } else {
        computerHits++;
    }
} else {
    square.classList.add('miss'); // Adding the 'miss' class
}

  square.classList.add('checked')
  square.style.pointerEvents = 'none';

  if (yourHits === totalShipsSize) {
    alert("Congratulations! You won the game!");
    gameIsOver = true;
  } else if (computerHits === totalShipsSize) {
    alert("Game over. The computer won the game.");
    gameIsOver = true;
  }
}

const totalShipsSize = ships.reduce((acc, ship) => acc + ship.size, 0);

opponentSquares.forEach(opponentSquare => {
    opponentSquare.addEventListener('click', () => {
      if (!opponentSquare.classList.contains('checked')) {
          handleSquareClick(opponentSquare, opponentGrid);
          opponentSquare.classList.add('checked')
  
          setTimeout(() => {
            let yourSquare;
            do {
              const randomIndex = Math.floor(Math.random() * yourSquares.length);
              yourSquare = yourSquares[randomIndex];
            } while (yourSquare.style.pointerEvents === 'none');
  
            handleSquareClick(yourSquare, playerGrid);
  
            setTimeout(() => {
              opponentSquares.forEach(square => {
                square.style.pointerEvents = 'auto';
              });
            }, 100);
          }, 100);
      }
    });
  });
