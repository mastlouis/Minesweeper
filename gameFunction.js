//import {Tile} from "Tile.js";

let numRows = 10;
let numCols = 10;
let numMines = 16;
let gameboard = null;
let giveUpButton = document.getElementById('giveup');
let newGameButton = document.getElementById('NewGame');
let statusParagraph = document.getElementById('status');
let gameIsWon = false;
let gameIsLost = false;
let gameGenerated = false;

class Tile{
    constructor(rowLetter, colNumber){
        this.tileString = rowLetter + colNumber;
        this.theTile = document.getElementById(this.tileString);
        this.checked = false;
        this.tileChar = null;
        this.flagged = false;
    }
}

getNumber = function(letter){
    let multiplier = letter.length - 1;
    let num = null;
    switch(letter.charAt(0)){
        case 'A': num = 0; break;
        case 'B': num = 1; break;
        case 'C': num = 2; break;
        case 'D': num = 3; break;
        case 'E': num = 4; break;
        case 'F': num = 5; break;
        case 'G': num = 6; break;
        case 'H': num = 7; break;
        case 'I': num = 8; break;
        case 'J': num = 9; break;
        case 'K': num = 10; break;
        case 'L': num = 11; break;
        case 'M': num = 12; break;
        case 'N': num = 13; break;
        case 'O': num = 14; break;
        case 'P': num = 15; break;
        case 'Q': num = 16; break;
        case 'R': num = 17; break;
        case 'S': num = 18; break;
        case 'T': num = 19; break;
        case 'U': num = 20; break;
        case 'V': num = 21; break;
        case 'W': num = 22; break;
        case 'X': num = 23; break;
        case 'Y': num = 24; break;
        case 'Z': num = 25; break;
        default: num = null; break;
    }
    return num + (26*multiplier);
};

getLetter = function(num){
    //26 letters in the alphabet
    let times = Math.trunc(num/26) + 1;
    let letter = null;
    num %= 26;
    switch(num){
        case 0: letter = 'A'; break;
        case 1: letter = 'B'; break;
        case 2: letter = 'C'; break;
        case 3: letter = 'D'; break;
        case 4: letter = 'E'; break;
        case 5: letter = 'F'; break;
        case 6: letter = 'G'; break;
        case 7: letter = 'H'; break;
        case 8: letter = 'I'; break;
        case 9: letter = 'J'; break;
        case 10: letter = 'K'; break;
        case 11: letter = 'L'; break;
        case 12: letter = 'M'; break;
        case 13: letter = 'N'; break;
        case 14: letter = 'O'; break;
        case 15: letter = 'P'; break;
        case 16: letter = 'Q'; break;
        case 17: letter = 'R'; break;
        case 18: letter = 'S'; break;
        case 19: letter = 'T'; break;
        case 20: letter = 'U'; break;
        case 21: letter = 'V'; break;
        case 22: letter = 'W'; break;
        case 23: letter = 'X'; break;
        case 24: letter = 'Y'; break;
        case 25: letter = 'Z'; break;
        default: letter = null; break;
    }
    //Concatenate the letter onto itself
    for(let i = 1; i < times; i++){
        letter += letter;
    }
    return letter
}

initializeGame = function(){
    //Initialize the game
    let coordString = '';
    for(let i = 0; i < numRows; i++){
        for(let j = 0; j < numCols; j++){
            coordString = getLetter(i) + j.toString();
        }
    }

    //Construct a 2D array for the board
    gameboard = [];
    for(let rowNumber = 0; rowNumber < numRows; rowNumber++){
        let newRow = [];
        for(let colNumber = 0; colNumber < numCols; colNumber++){
            newRow.push(new Tile(getLetter(rowNumber), colNumber));
        }
        gameboard.push(newRow);
    }

    //Add all of the event listeners
    for(let rowNumber = 0; rowNumber < numRows; rowNumber++){
        for(let colNumber = 0; colNumber < numCols; colNumber++){
            gameboard[rowNumber][colNumber].theTile.addEventListener('click', function(){
                if(!gameGenerated) 
                    makeBoard(rowNumber, colNumber);
                checkSquare(rowNumber, colNumber);
            });
            //gameboard[rowNumber][colNumber].theTile.addEventListener('auxclick', function(){toggleFlag(rowNumber, colNumber)});
            gameboard[rowNumber][colNumber].theTile.addEventListener('contextmenu', function(){toggleFlag(rowNumber, colNumber)});
        }
    }

    
    giveUpButton.addEventListener('click', function(){
            revealBoard(); 
            statusParagraph.innerHTML = "It's a hard game, man."
            newGameButton.innerHTML = 'New Game -_-'});
    newGameButton.addEventListener('click', newGame);
}

makeBoard = function(cursorRow, cursorCol){
    addMines(numMines, cursorRow, cursorCol);
    addValues();
    gameGenerated = true;
}

revealBoard = function() {
    for(let r = 0; r < numRows; r++){
        for(let c = 0; c < numCols; c++){
            if(gameboard[r][c].flagged && gameboard[r][c].tileChar !== '*')
                gameboard[r][c].flagged = false;
            checkSquare(r,c);
        }
    }
}

addMines = function(numMines, cursorRow, cursorCol){
    let chosen = false;
    for(let m = 0; m < numMines; m++){
        while(!chosen){
            let newMine = Math.trunc(Math.random()*numRows*numCols);
            let newMineRow = Math.trunc(newMine/numRows);
            let newMineCol = newMine%numCols
            if(gameboard[newMineRow][newMine%numCols].tileChar !== '*'
                    && (cursorRow !== newMineRow || cursorCol !== newMineCol)){
                gameboard[newMineRow][newMine%numCols].tileChar = '*';
                console.log(`square [${getLetter(newMineRow)}, ${newMine%numCols}] is now a mine.`);
                chosen = true;
            }
        }
        chosen = false;
    }
}

addValues = function(numMines){
    for(let r = 0; r < numRows; r++){
        for(let c = 0; c < numCols; c++){
            //If the space is not already a mine
            if(gameboard[r][c].tileChar === null){
                gameboard[r][c].tileChar = getValue(r,c).toString();
            }
        }
    }
}

getValue = function(rowNumber, colNumber){
    let total = 0;
    let hasLeft = 0 < colNumber;
    let hasRight = colNumber < numCols - 1;
    let hasAbove = 0 < rowNumber;
    let hasBelow = rowNumber < numRows - 1;
    
    //Check tile above and to the left
    if(hasAbove && hasLeft && gameboard[rowNumber-1][colNumber-1].tileChar === '*') total++;
    //check tile above
    if(hasAbove && gameboard[rowNumber-1][colNumber].tileChar === '*') total++;
    //Check tile above and to the right
    if(hasAbove && hasRight && gameboard[rowNumber-1][colNumber+1].tileChar === '*') total ++;

    //Check the tile to the left
    if(hasLeft && gameboard[rowNumber][colNumber-1].tileChar === '*') total++;
    //Check the tile to the right
    if(hasRight && gameboard[rowNumber][colNumber+1].tileChar === '*') total++;

    //Check tile below and to the left
    if(hasBelow && hasLeft && gameboard[rowNumber+1][colNumber-1].tileChar === '*') total++;
    //check tile below
    if(hasBelow && gameboard[rowNumber+1][colNumber].tileChar === '*') total++;
    //Check tile below and to the right
    if(hasBelow && hasRight && gameboard[rowNumber+1][colNumber+1].tileChar === '*') total++;
    return total;
}

checkSquare = function(rowNumber, colNumber){
    //console.log(`row: ${rowNumber} column: ${colNumber} value: ${gameboard[rowNumber][colNumber].tileChar}`);

    //This line prevents infinite recursion for chain reveal
    if(gameboard[rowNumber][colNumber].checked) return;

    //You can't check a flagged square
    if(gameboard[rowNumber][colNumber].flagged) return;

    //Set it as checked now to prevent recursion problems
    gameboard[rowNumber][colNumber].checked = true;

    //Change from 'unclicked' to 'mine' or the number
    let newClass = null;
    let shouldChainReveal = false;
    let gameIsOver = false;
    switch(gameboard[rowNumber][colNumber].tileChar){
        case '*': newClass = 'mine'; gameIsOver = true; break;
        case '1': newClass = 'one'; break;
        case '2': newClass = 'two'; break;
        case '3': newClass = 'three'; break;
        case '4': newClass = 'four'; break;
        case '5': newClass = 'five'; break;
        case '6': newClass = 'six'; break;
        case '7': newClass = 'seven'; break;
        case '8': newClass = 'eight'; break;
        case '0': newClass = 'zero'; shouldChainReveal = true; break;
        default: newClass = 'error'; break;
    }
    if(newClass !== 'zero')
        gameboard[rowNumber][colNumber].theTile.innerText = gameboard[rowNumber][colNumber].tileChar;
    //Attempt at fixing spacing issues. Didn't work
    else
        gameboard[rowNumber][colNumber].theTile.innerText = ' ';
    if(newClass === 'error')
        gameboard[rowNumber][colNumber].theTile.innerText = '!';
    gameboard[rowNumber][colNumber].theTile.setAttribute('class', newClass);
    if(shouldChainReveal) chainReveal(rowNumber, colNumber);
    if(gameIsOver) {
        //If this is the first mine on the call stack
        if(!gameIsLost)
            gameboard[rowNumber][colNumber].theTile.setAttribute('class', 'mineHit');
        gameOver();
    }
    else if(gameIsLost === false) checkWin();
}

chainReveal = function(r,c){
    console.log(`initiating chain reveal on cell [${getLetter(r)}, ${c}]`)
    let hasLeft = 0 < c;
    let hasRight = c < numCols-1;
    //If there is a row to check above this
    if(0 < r){
        if(hasLeft) checkSquare(r-1, c-1);
        checkSquare(r-1, c);
        if(hasRight) checkSquare(r-1, c+1);
    }
    if(hasLeft) checkSquare(r, c-1);
    if(hasRight) checkSquare(r,c+1);
    if(r < numRows - 1){
        if(hasLeft) checkSquare(r+1, c-1);
        checkSquare(r+1, c);
        if(hasRight) checkSquare(r+1, c+1);
    }
}

toggleFlag = function(rowNumber, colNumber){
    //Don't let them unflag if the game is over.
    if(gameIsWon)
        return;
    
        //Only squares that have not been checked can be flagged
    if(gameboard[rowNumber][colNumber].checked)
        return;

    //If there's no flag yet
    if(!gameboard[rowNumber][colNumber].flagged){
        gameboard[rowNumber][colNumber].theTile.innerHTML = '|>';
        gameboard[rowNumber][colNumber].theTile.setAttribute('class', 'flag');
        gameboard[rowNumber][colNumber].flagged = true;
        checkWin();
        return;
    }
    //if there already was a flag
        gameboard[rowNumber][colNumber].theTile.innerHTML = '';
        gameboard[rowNumber][colNumber].theTile.setAttribute('class', 'unclicked');
        gameboard[rowNumber][colNumber].flagged = false;

}

gameOver = function(){
    gameIsLost = true;
    revealBoard();
    newGameButton.innerHTML = 'New Game x_x';
    statusParagraph.innerHTML = 'Aw. That sucks.';
}

checkWin = function(){
    for(let r = 0; r < numRows; r++){
        for(let c = 0; c < numCols; c++){
            //For the player to win, every square must be a flagged mine or checked and not a mine
            //Checked mines exist when the board is being revealed after a defeat
            if(gameboard[r][c].flagged && gameboard[r][c].tileChar === '*'){}
            else if(gameboard[r][c].checked && gameboard[r][c].tileChar !== '*'){}
            //If this is not ture, the player has not won.
            else{
                console.log(`Tile [${r}, ${c}] is not valid for win.`);
                return;
            }
        }
    }
    gameIsWon = true;
    newGameButton.innerHTML = 'New Game ^.^';
    statusParagraph.innerHTML = 'Well done! You win!';
    window.alert('*** You win! ***');
}

newGame = function(){
    for(let r = 0; r < numRows; r++){
        for(let c = 0; c < numCols; c++){
            gameboard[r][c].tileChar = null;
            gameboard[r][c].theTile.setAttribute('class','unclicked');
            gameboard[r][c].theTile.innerHTML = '';
            gameboard[r][c].checked = false;
            gameboard[r][c].tileChar = null;
            gameboard[r][c].flagged = false;
            statusParagraph.innerHTML = 'Good Luck!';
            newGameButton.innerHTML = "New Game '_'";
        }
    }
    gameIsWon = false;
    gameIsLost = false;
    gameGenerated = false;  
}

//Begin code to execute
initializeGame();

document.oncontextmenu = function(){
    //if()
        return false;
    //return true;
}