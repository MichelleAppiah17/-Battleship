const gameboardContainer = document.querySelector(".gameBoardContainer")

function createYourBoard(){
    const yourBoard = document.createElement('div')
    yourBoard.classList.add('yourBoard')
    gameboardContainer.appendChild(yourBoard);

    for(let i = 0; i < 100; i++){
        const square = document.createElement('div')
        square.classList.add("square")
        yourBoard.appendChild(square)
    }


}
createYourBoard();

const shipsContainer = document.querySelector('.ships')
gameboardContainer.appendChild(shipsContainer)


function createOpponentBoard(){
    const opponentBoard = document.createElement('div')
    opponentBoard.classList.add('opponentBoard')
    gameboardContainer.appendChild(opponentBoard)

    for(let i = 0; i < 100; i++){
        const square = document.createElement('div')
        square.classList.add("square")
        opponentBoard.appendChild(square)
    }

}
createOpponentBoard();

const ships = document.querySelectorAll('.ship')

function rotateShip(event) {
    const ships = event.target;
    ships.classList.toggle("rotated");
}

ships.forEach(ships => {
    ships.addEventListener('dblclick', rotateShip);
});



