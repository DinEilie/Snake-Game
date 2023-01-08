// Initialize Canvas
var page = document.getElementById("world");
var pen = page.getContext("2d");

// Initialize Board
var bHeight = document.getElementById("world").getAttribute("height");
var bWidth = document.getElementById("world").getAttribute("width");
var nSize = 20;
var isOver = false;
var lastKey = [];
var mili = 1000;

// Initialize Menu
var difficulty;
$("#info").slideToggle(0);
$("#difficulty").slideToggle(0);
$("#game").slideToggle(0);

// Initialize Music
var music = new Audio("sounds/" + value + ".mp3");
music.play();


// Initialize Snake
var direction = "ArrowRight";
var speed = 175;
var xNode = [0];
var yNode = [0];

// Initialize Apple
var xApple = Math.floor((bWidth / nSize) / 2);
var yApple = Math.floor((bHeight / nSize) / 2);
var apples = ["apple", "apple", "apple", "badApple", "portal", "random"];
var type = apples[0];
var randomColor = 0;
var appleExist = true;
var level = 0;

// Return true if the given coordinates represents the snake's body
function isSnake(x, y) {
    var result = false;
    for (var i = 1; i < xNode.length; i++) {
        if (x == xNode[i] && y == yNode[i])
            result = true;
    }
    return result;
}

// Update snake coordinates
function updateSnake(callback) {
    var xPre = xNode[0];
    var yPre = yNode[0];
    switch (direction) {
        case "ArrowUp":
            if (yNode[0] == 0)
                yNode[0] = (bHeight / nSize) - 1;
            else
                yNode[0] -= 1;
            break;
        case "ArrowDown":
            if (yNode[0] == (bHeight / nSize) - 1)
                yNode[0] = 0;
            else
                yNode[0] += 1;
            break;
        case "ArrowRight":
            if (xNode[0] == (bWidth / nSize) - 1)
                xNode[0] = 0;
            else
                xNode[0] += 1;
            break;
        case "ArrowLeft":
            if (xNode[0] == 0)
                xNode[0] = (bWidth / nSize) - 1;
            else
                xNode[0] -= 1;
            break;
    }


    // Yum!
    if (xNode[0] == xApple && yNode[0] == yApple) {
        if (type == "random") {
            type = apples[Math.floor(Math.random() * 5)]
            if (type == "apple") {
                level++;
            } else if (type == "badApple") {
                if (level > 1)
                    level--;
            } else {
                //?
            }
        } else if (type == "apple") {
            level++;
        } else if (type == "badApple") {
            if (level > 1)
                level--;
        } else {
            //?
        }
        playSound(type);
        console.log("apple consumed!");
        $("#level-title").text("Level " + level);
        appleExist = false;
    }

    // Activate "Game Over" screen
    if (isSnake(xNode[0], yNode[0])) {
        gameOver();
    }

    // Update snake body
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

    // Create new body node
    if (!appleExist) {
        xNode.push(xPre);
        yNode.push(yPre);
    }

    console.log("updateSnake is finished");
    callback();
}

// Update apple coordinates
function updateApple() {
    if (!appleExist) {
        // Valid the new coordinate
        var xTmp = Math.floor(Math.random() * (bWidth / nSize));
        var yTmp = Math.floor(Math.random() * (bHeight / nSize));
        while (isSnake(xTmp, yTmp) || (xTmp == xNode[0] && yTmp == yNode[0])) {
            console.log("Invalid coordinate!");
            xTmp = Math.floor(Math.random() * (bWidth / nSize));
            yTmp = Math.floor(Math.random() * (bHeight / nSize));
        }

        // Generate new apple
        xApple = xTmp;
        yApple = yTmp;
        console.log("updateApple is finished");
        if (difficulty == 2)
            type = apples[Math.floor(Math.random() * 6)];
        else
            type = apples[0];
        console.log("xApple = " + xApple);
        console.log("yApple = " + yApple);
        console.log("Apple type = " + type);
        appleExist = true;
    }
}

// Draw canvas
function draw() {

    // Background
    pen.fillStyle = "rgb(0,0,0)";
    pen.fillRect(0, 0, bWidth, bHeight);

    // Snake
    if (!isOver)
        pen.fillStyle = "rgb(0,100,0)";
    else
        pen.fillStyle = "rgb(100,0,0)";
    for (var i = 0; i < xNode.length; i++) {
        pen.fillRect(xNode[i] * nSize, yNode[i] * nSize, nSize, nSize);
    }
    if (!isOver)
        pen.fillStyle = "rgb(0,200,0)";
    else
        pen.fillStyle = "rgb(200,0,0)";
    pen.fillRect(xNode[0] * nSize, yNode[0] * nSize, nSize, nSize);


    // Food
    if (type == "apple")
        pen.fillStyle = "rgb(255,0,0)";
    if (type == "badApple")
        pen.fillStyle = "rgb(0,255,255)";
    if (type == "portal")
        pen.fillStyle = "rgb(255,255,0)";
    if (type == "random") {
        if (randomColor == 0)
            pen.fillStyle = "rgb(255,0,0)";
        if (randomColor == 1)
            pen.fillStyle = "rgb(0,255,255)";
        if (randomColor == 2) {
            pen.fillStyle = "rgb(255,255,0)";
            randomColor = -1;
        }
        randomColor++;
    }
    pen.fillRect(xApple * nSize, yApple * nSize, nSize, nSize);
}

// Play sound
function playSound(value) {
    if (value == "apple" | value == "badApple" | value == "over" | value == "portal")
        var audio = new Audio("sounds/" + value + ".mp3");
    else
        var audio = new Audio("sounds/button.mp3");
    audio.play();
}

// Play button animation
function playPress(value) {
    if (!isOver) {
        $("#" + value).addClass("pressed");
        setTimeout(function () { $("#" + value).removeClass("pressed"); }, 200);
    }
}

// Update direction by key
document.addEventListener("keyup", function (event) {
    if (event.key == "ArrowLeft") {
        lastKey.push(mili);
        if (direction != "ArrowRight") {
            if (lastKey.length == 1)
                direction = event.key;
            else if (Math.abs(lastKey[lastKey.length - 1] - lastKey[lastKey.length - 2]) >= 30)
                direction = event.key;
            else { }
        }
    } else if (event.key == "ArrowRight") {
        lastKey.push(mili);
        if (direction != "ArrowLeft") {
            if (lastKey.length == 1)
                direction = event.key;
            else if (Math.abs(lastKey[lastKey.length - 1] - lastKey[lastKey.length - 2]) >= 30)
                direction = event.key;
            else { }
        }
    } else if (event.key == "ArrowDown") {
        lastKey.push(mili);
        if (direction != "ArrowUp") {
            if (lastKey.length == 1)
                direction = event.key;
            else if (Math.abs(lastKey[lastKey.length - 1] - lastKey[lastKey.length - 2]) >= 30)
                direction = event.key;
            else { }
        }
    } else if (event.key == "ArrowUp") {
        lastKey.push(mili);
        if (direction != "ArrowDown") {
            if (lastKey.length == 1)
                direction = event.key;
            else if (Math.abs(lastKey[lastKey.length - 1] - lastKey[lastKey.length - 2]) >= 30)
                direction = event.key;
            else { }
        }
    } else { }
});

// Update buttons by click functions
$(".btn").click(function () {
    playSound(this.id);
    playPress(this.id);
    if (this.id == "start") {
        gameStart();
    } else if (this.id == "explain") {
        $("#info").slideToggle(200);
    } else if (this.id == "easy") {
        $("#difficulty").slideToggle(200);
        $("#game").slideToggle(200);
        difficulty = 0;
        setTimeout(function () {
            $("#level-title").text("Game begins in 3");
            playSound("button");
        }, 1200);
        setTimeout(function () {
            $("#level-title").text("Game begins in 2");
            playSound("button");
        }, 2200);
        setTimeout(function () {
            $("#level-title").text("Game begins in 1");
            playSound("button");
        }, 3200);
        setTimeout(function () {
            $("#level-title").text("Go!!!");
            playSound("portal");
            level++;
        }, 4200);
        setTimeout(function () {
            $("#level-title").text("Level " + level);
        }, 5200);
    } else if (this.id == "medium") {
        $("#difficulty").slideToggle(200);
        $("#game").slideToggle(200);
        difficulty = 1;
        speed *= 0.8;
        setTimeout(function () {
            $("#level-title").text("Game begins in 3");
            playSound("button");
        }, 1200);
        setTimeout(function () {
            $("#level-title").text("Game begins in 2");
            playSound("button");
        }, 2200);
        setTimeout(function () {
            $("#level-title").text("Game begins in 1");
            playSound("button");
        }, 3200);
        setTimeout(function () {
            $("#level-title").text("Go!!!");
            playSound("portal");
            level++;
        }, 4200);
        setTimeout(function () {
            $("#level-title").text("Level " + level);
        }, 5200);
    } else if (this.id == "hard") {
        $("#difficulty").slideToggle(200);
        $("#game").slideToggle(200);
        difficulty = 2;
        speed *= 0.6;
        setTimeout(function () {
            $("#level-title").text("Game begins in 3");
            playSound("button");
        }, 1200);
        setTimeout(function () {
            $("#level-title").text("Game begins in 2");
            playSound("button");
        }, 2200);
        setTimeout(function () {
            $("#level-title").text("Game begins in 1");
            playSound("button");
        }, 3200);
        setTimeout(function () {
            $("#level-title").text("Go!!!");
            playSound("portal");
            level++;
        }, 4200);
        setTimeout(function () {
            $("#level-title").text("Level " + level);
        }, 5200);
    }
});

// Start game
function gameStart() {
    $("#menu").slideToggle(200);
    $("#info").slideUp(200);
    $("#difficulty").slideToggle(200);
    $("#level-title").text("Choose difficulty");
}

// Game over
function gameOver() {
    isOver = true;
    playSound("over");
    $("body").addClass("game-over");
    setTimeout(function () { $("body").removeClass("game-over"); }, 200);
    $("#level-title").text("💀 Game Over 💀");

    setTimeout(function () {
        $("#level-title").text("Shall we play again?");
        $("#game").slideToggle(200);
        isOver = false;
        direction = "ArrowRight";
        speed = 175;
        xNode = [0];
        yNode = [0];
        xApple = Math.floor((bWidth / nSize) / 2);
        yApple = Math.floor((bHeight / nSize) / 2);
        type = apples[0];
        appleExist = true;
        level = 0;
        $("#menu").slideToggle(200);
    }, 2000);
}

// Update game by 'speed' miliseconds
var update = setInterval(function () {
    if (level > 0 && !isOver) {
        updateSnake(updateApple);
    }
    draw();
}, speed);

var updateMili = setInterval(function () {
    if (mili == 0)
        mili = 1000;
    else
        mili--;
}, 1);