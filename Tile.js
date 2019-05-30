export class Tile{
    constructor(rowLetter, colNumber){
        this.tileString = rowLetter + colNumber;
        this.theTile = document.getElementById(this.tileString);
        this.checked = false;
        this.tileChar = null;
        this.flagged = false;
    }
}