// Initialize Canvas
var page = document.getElementById("world");
var pen = page.getContext("2d");

//Initialize Board
var bHeight = document.getElementById("world").getAttribute("height");
var bWidth = document.getElementById("world").getAttribute("width");
var nSize = 20;
var board = new Array(bWidth / nSize);
for (var i = 0; i < board.length; i++) {
    board[i] = new Array(bWidth / nSize);
    for (var j = 0; j < board[i].length; j++) {
        board[i][j] = false;
    }
}

// Initialize Snake
var direction = "ArrowRight";
var speed = 125;
var xNode = [0];
var yNode = [0];

// Initialize Apple
var xApple = 14;
var yApple = 14;
var appleExist = true;
var level = 0;

// Update the 2D array with 'TRUE' values according to the snake body
function updateBoard() {
    for (var i = 0; i < xNode.length; i++) {
        board[xNode[i], yNode[i]] = true;
        console.log("board[" + xNode[i] + "][" + yNode[i] + "] = true");
    }
}

// remove 'TRUE' values of the snake body
function removeBoard() {
    for (var i = 0; i < xNode.length; i++) {
        board[xNode[i], yNode[i]] = false;
        console.log("board[" + xNode[i] + "][" + yNode[i] + "] = false");
    }
}

function updateSnake(value) {
    var xPre = xNode[0];
    var yPre = yNode[0];
    switch (value) {
        case "ArrowUp":
            if (yNode[0] == 0)
                yNode[0] = 29;
            else
                yNode[0] -= 1;
            break;
        case "ArrowDown":
            if (yNode[0] == 29)
                yNode[0] = 0;
            else
                yNode[0] += 1;
            break;
        case "ArrowRight":
            if (xNode[0] == 29)
                xNode[0] = 0;
            else
                xNode[0] += 1;
            break;
        case "ArrowLeft":
            if (xNode[0] == 0)
                xNode[0] = 29;
            else
                xNode[0] -= 1;
            break;
    }

    if (xNode[0] == xApple && yNode[0] == yApple) {
        level++;
        console.log("apple consumed!");
        appleExist = false;
    }

    if (xNode.length >= 1) {
        for (var i = 1; i < xNode.length; i++) {
            var xNum = xNode[i];
            var yNum = yNode[i];
            xNode[i] = xPre;
            yNode[i] = yPre;
            xPre = xNum;
            yPre = yNum;
        }
    }

    if (!appleExist) {
        xNode.push(xPre);
        yNode.push(yPre);
    }
}

function updateApple() {
    if (!appleExist) {
        // Valid the new coordinate
        var xTmp = Math.floor(Math.random() * (bWidth / nSize));
        var yTmp = Math.floor(Math.random() * (bWidth / nSize));
        while (board[xTmp][yTmp] == true) {
            console.log("Invalid coordinate!");
            xTmp = Math.floor(Math.random() * (bWidth / nSize));
            yTmp = Math.floor(Math.random() * (bWidth / nSize));
        }

        // Generate new apple
        xApple = xTmp;
        yApple = yTmp;
        console.log("xApple = " + xApple);
        console.log("yApple = " + yApple);
        appleExist = true;
    }
}

function draw() {

    // Background
    pen.fillStyle = "rgb(0,0,0)";
    pen.fillRect(0, 0, bHeight, bWidth);

    // Snake
    pen.fillStyle = "rgb(0,200,0)";
    for (var i = 0; i < xNode.length; i++) {
        pen.fillRect(xNode[i] * nSize, yNode[i] * nSize, nSize, nSize);
    }
    pen.fillStyle = "rgb(0,255,0)";
    pen.fillRect(xNode[0] * nSize, yNode[0] * nSize, nSize, nSize);


    // Food
    pen.fillStyle = "rgb(255,0,0)";
    pen.fillRect(xApple * nSize, yApple * nSize, nSize, nSize);
}

function update(value) {
    removeBoard();
    updateSnake(value);
    updateBoard();
    updateApple();
    draw();
}

document.addEventListener("keydown", function (event) {
    if (event.key == "ArrowUp" | event.key == "ArrowDown" | event.key == "ArrowRight" | event.key == "ArrowLeft")
        direction = event.key;
    console.log(event.key);
});

var showInterval = setInterval(function () {
    update(direction);
}, speed);