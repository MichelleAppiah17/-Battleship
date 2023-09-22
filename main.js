const gameboardContainer = document.querySelector(".gameBoardContainer");

function createYourBoard() {
    const yourBoard = document.createElement('div');
    yourBoard.classList.add('yourBoard');

    for (let i = 0; i < 100; i++) {
        const square = document.createElement('div');
        square.classList.add("square");
        square.id = i;
        yourBoard.appendChild(square);
    }
    gameboardContainer.appendChild(yourBoard);
}

createYourBoard();

const shipsContainer = document.querySelector('.shipsContainer');
gameboardContainer.appendChild(shipsContainer);

function createOpponentBoard() {
    const opponentBoard = document.createElement('div');
    opponentBoard.classList.add('opponentBoard');

    for (let i = 0; i < 100; i++) {
        const square = document.createElement('div');
        square.classList.add("square");
        square.id = i;
        opponentBoard.appendChild(square);
    }
    gameboardContainer.appendChild(opponentBoard);
}

createOpponentBoard();

const gameShips = document.querySelectorAll('.ship');
const squares = document.querySelectorAll('.square');
let selectedShip = null;

function rotateShip(event) {
    const Sship = event.target;
    Sship.classList.toggle("rotated");
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

function randomPositionShips(size) {
    const isHorizontal = Math.random() < 0.5;
    const maxPosition = gridSize - (isHorizontal ? size : 1);
    const randomRow = Math.floor(Math.random() * gridSize);
    const randomColumn = Math.floor(Math.random() * maxPosition);

    return { randomRow, randomColumn, isHorizontal };
}


function correctPosition(ship, position) {
    const { randomRow, randomColumn, isHorizontal } = position;
    for (let i = 0; i < ship.size; i++) {
        if (isHorizontal) {
            if (grid[randomRow][randomColumn + i]) return false;
        } else {
            if (grid[randomRow + i][randomColumn]) return false;
        }
    }
    return true;
}

function positionShip(ship) {
    let position;
    do {
        position = randomPositionShips(ship.size);
    } while (!correctPosition(ship, position));

    const { randomRow, randomColumn, isHorizontal } = position;
    for (let i = 0; i < ship.size; i++) {
        if (isHorizontal) {
            grid[randomRow][randomColumn + i] = true;
        } else {
            grid[randomRow + i][randomColumn] = true;
        }
    }
    ship.position = position;
}

ships.forEach(ship => positionShip(ship));

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
        }
    }
}


