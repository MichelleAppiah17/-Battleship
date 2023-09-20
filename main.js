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



