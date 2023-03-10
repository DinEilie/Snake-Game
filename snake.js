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
var difficulty = 0;
var isPaused = false;
$("#restart").fadeToggle(0);

// Initialize Sound
var music = new Audio("sounds/newAdventure.wav");
var musicVolume = 0.5;
var soundVolume = 0.25;
music.volume = musicVolume;
music.loop = true;

// Initialize Snake
var direction = "ArrowRight";
var speed = 175;
const speedLimit = 50;
var xNode = [0];
var yNode = [0];
const img0 = new Image();
const img1 = new Image();
const img2 = new Image();
const img3 = new Image();
const img4 = new Image();
const img5 = new Image();
const img6 = new Image();
const img7 = new Image();
const img8 = new Image();
img0.src = "sprites/0.png";
img1.src = "sprites/1.png";
img2.src = "sprites/2.png";
img3.src = "sprites/3.png";
img4.src = "sprites/4.png";
img5.src = "sprites/5.png";
img6.src = "sprites/6.png";
img7.src = "sprites/7.png";
img8.src = "sprites/8.png";

// Initialize Apple
var xApple = Math.floor(bWidth / nSize / 2);
var yApple = Math.floor(bHeight / nSize / 2);
var apples = ["apple", "apple", "apple", "badApple", "portal", "random"];
var type = apples[0];
var randomColor = 0;
var appleExist = true;
var level = 0;

// Return true if the given coordinates represents the snake's body
function isSnake(x, y) {
  var result = false;
  for (var i = 1; i < xNode.length; i++) {
    if (x == xNode[i] && y == yNode[i]) result = true;
  }
  return result;
}

// Update snake coordinates
function updateSnake(callback) {
  var xPre = xNode[0];
  var yPre = yNode[0];
  switch (direction) {
    case "ArrowUp":
      if (difficulty < 2) {
        if (yNode[0] == 0) yNode[0] = bHeight / nSize - 1;
        else yNode[0] -= 1;
        break;
      } else {
        if (yNode[0] == 0) gameOver();
        else yNode[0] -= 1;
        break;
      }

    case "ArrowDown":
      if (difficulty < 2) {
        if (yNode[0] == bHeight / nSize - 1) yNode[0] = 0;
        else yNode[0] += 1;
        break;
      } else {
        if (yNode[0] == bHeight / nSize - 1) gameOver();
        else yNode[0] += 1;
        break;
      }
    case "ArrowRight":
      if (difficulty < 2) {
        if (xNode[0] == bWidth / nSize - 1) xNode[0] = 0;
        else xNode[0] += 1;
        break;
      } else {
        if (xNode[0] == bWidth / nSize - 1) gameOver();
        else xNode[0] += 1;
        break;
      }
    case "ArrowLeft":
      if (difficulty < 2) {
        if (xNode[0] == 0) xNode[0] = bWidth / nSize - 1;
        else xNode[0] -= 1;
        break;
      } else {
        if (xNode[0] == 0) gameOver();
        else xNode[0] -= 1;
        break;
      }
  }

  // Yum!
  if (xNode[0] == xApple && yNode[0] == yApple) {
    if (type == "random") {
      type = apples[Math.floor(Math.random() * 5)];
      if (type == "apple") {
        level++;
      } else if (type == "badApple") {
        if (level > 1) level--;
      } else {
        if (difficulty >= 1) {
          if (speed - level >= speedLimit) speed = speed - level;
          else speed = speedLimit;
        }
      }
    } else if (type == "apple") {
      level++;
    } else if (type == "badApple") {
      if (level > 1) level--;
    } else {
      if (difficulty >= 1) {
        if (speed - level >= speedLimit) speed = speed - level;
        else speed = speedLimit;
      }
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
    if (difficulty >= 1) type = apples[Math.floor(Math.random() * 6)];
    else type = apples[0];
    console.log("xApple = " + xApple);
    console.log("yApple = " + yApple);
    console.log("Apple type = " + type);
    appleExist = true;
  }
}

// Draw canvas
function draw() {
  // Background
  pen.fillStyle = "rgb(248,249,250)";
  pen.fillRect(0, 0, bWidth, bHeight);

  // Snake
  if (!isOver) {
    for (var i = 0; i < xNode.length; i++) {
      if (i == 0 && img0.complete) {
        pen.translate(Math.floor(bWidth / 2), Math.floor(bHeight / 2));
        if (direction == "ArrowRight")
          pen.drawImage(
            img0,
            -Math.floor(bWidth / 2) + xNode[i] * nSize,
            -Math.floor(bHeight / 2) + yNode[i] * nSize
          );
        if (direction == "ArrowLeft") {
          pen.rotate((180 * Math.PI) / 180);
          pen.drawImage(
            img0,
            Math.floor(bWidth / 2) - xNode[i] * nSize - nSize,
            Math.floor(bHeight / 2) - yNode[i] * nSize - nSize
          );
          pen.rotate((-180 * Math.PI) / 180);
        }
        if (direction == "ArrowDown") {
          pen.rotate((90 * Math.PI) / 180);
          pen.drawImage(
            img0,
            -Math.floor(bHeight / 2) + yNode[i] * nSize,
            Math.floor(bWidth / 2) - xNode[i] * nSize - nSize
          );
          pen.rotate((-90 * Math.PI) / 180);
        }
        if (direction == "ArrowUp") {
          pen.rotate((270 * Math.PI) / 180);
          pen.drawImage(
            img0,
            Math.floor(bHeight / 2) - yNode[i] * nSize - nSize,
            -Math.floor(bWidth / 2) + xNode[i] * nSize
          );
          pen.rotate((-270 * Math.PI) / 180);
        }
        pen.translate(-Math.floor(bWidth / 2), -Math.floor(bHeight / 2));
      } else if (i < xNode.length - 1 && img1.complete)
        pen.drawImage(img1, xNode[i] * nSize, yNode[i] * nSize);
      else if (img2.complete)
        pen.drawImage(img2, xNode[i] * nSize, yNode[i] * nSize);
    }
  } else {
    for (var i = 0; i < xNode.length; i++) {
      if (i == 0 && img3) {
        pen.translate(Math.floor(bWidth / 2), Math.floor(bHeight / 2));
        if (direction == "ArrowRight")
          pen.drawImage(
            img3,
            -Math.floor(bWidth / 2) + xNode[i] * nSize,
            -Math.floor(bHeight / 2) + yNode[i] * nSize
          );
        if (direction == "ArrowLeft") {
          pen.rotate((180 * Math.PI) / 180);
          pen.drawImage(
            img3,
            Math.floor(bWidth / 2) - xNode[i] * nSize - nSize,
            Math.floor(bHeight / 2) - yNode[i] * nSize - nSize
          );
          pen.rotate((-180 * Math.PI) / 180);
        }
        if (direction == "ArrowDown") {
          pen.rotate((90 * Math.PI) / 180);
          pen.drawImage(
            img3,
            -Math.floor(bHeight / 2) + yNode[i] * nSize,
            Math.floor(bWidth / 2) - xNode[i] * nSize - nSize
          );
          pen.rotate((-90 * Math.PI) / 180);
        }
        if (direction == "ArrowUp") {
          pen.rotate((270 * Math.PI) / 180);
          pen.drawImage(
            img3,
            Math.floor(bHeight / 2) - yNode[i] * nSize - nSize,
            -Math.floor(bWidth / 2) + xNode[i] * nSize
          );
          pen.rotate((-270 * Math.PI) / 180);
        }
        pen.translate(-Math.floor(bWidth / 2), -Math.floor(bHeight / 2));
      } else if (i < xNode.length - 1 && img4)
        pen.drawImage(img4, xNode[i] * nSize, yNode[i] * nSize);
      else if (img5.complete)
        pen.drawImage(img5, xNode[i] * nSize, yNode[i] * nSize);
    }
  }

  // Food
  if (type == "apple" && img6.complete)
    pen.drawImage(img6, xApple * nSize, yApple * nSize);
  if (type == "badApple" && img7.complete)
    pen.drawImage(img7, xApple * nSize, yApple * nSize);
  if (type == "portal" && img8.complete)
    pen.drawImage(img8, xApple * nSize, yApple * nSize);
  if (type == "random") {
    if (randomColor == 0 && img6.complete)
      pen.drawImage(img6, xApple * nSize, yApple * nSize);
    if (randomColor == 1 && img7.complete)
      pen.drawImage(img7, xApple * nSize, yApple * nSize);
    if (randomColor == 2 && img8.complete) {
      pen.drawImage(img8, xApple * nSize, yApple * nSize);
      randomColor = -1;
    }
    randomColor++;
  }
}

function drawEmpty() {
  // Background
  pen.fillStyle = "rgb(248,249,250)";
  pen.fillRect(0, 0, bWidth, bHeight);
}

// Play sound
function playSound(value) {
  if (!music.muted) {
    if (
      (value == "apple") |
      (value == "badApple") |
      (value == "over") |
      (value == "portal")
    )
      var audio = new Audio("sounds/" + value + ".mp3");
    else var audio = new Audio("sounds/button.mp3");
    audio.volume = soundVolume;
    audio.play();
  }
}

// Play button animation
function playPress(value) {
  if (!isOver) {
    $("#" + value).addClass("pressed");
    setTimeout(function () {
      $("#" + value).removeClass("pressed");
    }, 200);
  }
}

// Update direction by key
document.addEventListener("keyup", function (event) {
  if (event.key == "ArrowLeft") {
    lastKey.push(mili);
    if (direction != "ArrowRight") {
      if (lastKey.length == 1) direction = event.key;
      else if (
        Math.abs(lastKey[lastKey.length - 1] - lastKey[lastKey.length - 2]) >=
        30
      )
        direction = event.key;
      else {
      }
    }
  } else if (event.key == "ArrowRight") {
    lastKey.push(mili);
    if (direction != "ArrowLeft") {
      if (lastKey.length == 1) direction = event.key;
      else if (
        Math.abs(lastKey[lastKey.length - 1] - lastKey[lastKey.length - 2]) >=
        30
      )
        direction = event.key;
      else {
      }
    }
  } else if (event.key == "ArrowDown") {
    lastKey.push(mili);
    if (direction != "ArrowUp") {
      if (lastKey.length == 1) direction = event.key;
      else if (
        Math.abs(lastKey[lastKey.length - 1] - lastKey[lastKey.length - 2]) >=
        30
      )
        direction = event.key;
      else {
      }
    }
  } else if (event.key == "ArrowUp") {
    lastKey.push(mili);
    if (direction != "ArrowDown") {
      if (lastKey.length == 1) direction = event.key;
      else if (
        Math.abs(lastKey[lastKey.length - 1] - lastKey[lastKey.length - 2]) >=
        30
      )
        direction = event.key;
      else {
      }
    }
  } else {
  }
});

// Update buttons by click functions
$(".game-btn").click(function () {
  if (this.id == "start") {
    if (level < 1) {
      $("#start").addClass("disabled");
      $("#start").html('Pause <i class="bi bi-pause-fill"></i>');
      $("#restart").fadeToggle(200);
      $("#restart").addClass("disabled");
      gameStart();
    } else {
      if (isPaused) {
        isPaused = false;
        $("#start").html('Pause <i class="bi bi-pause-fill"></i>');
      } else {
        isPaused = true;
        $("#start").html('Resume <i class="bi bi-play-fill"></i>');
      }
    }
  } else if (this.id == "restart") {
    $("#start").addClass("disabled");
    $("#restart").addClass("disabled");
    isOver = true;
    music.pause();
    music.load();
    playSound("over");
    $("body").addClass("game-over");
    setTimeout(function () {
      $("body").removeClass("game-over");
    }, 200);
    $("#level-title").text("Restarted!");
    setTimeout(function () {
      $("#level-title").text("Snake Game");
      restartGame();
    }, 2000);
  } else if (this.id == "btnradio1") difficulty = 0;
  else if (this.id == "btnradio2") difficulty = 1;
  else if (this.id == "btnradio3") difficulty = 2;
  else if (this.id == "up") {
    if (musicVolume <= 0.5 && !music.muted) {
      if (musicVolume == 0.5)
        $("#mute").html('<i class="bi bi-volume-up-fill"></i>');
      else $("#mute").html('<i class="bi bi-volume-down-fill"></i>');

      musicVolume *= 2;
      soundVolume *= 2;
      music.volume = musicVolume;
      console.log("mV=" + musicVolume + " sV=" + soundVolume);
    }
  } else if (this.id == "down") {
    if (musicVolume > 0.25 && !music.muted) {
      if (musicVolume == 1)
        $("#mute").html('<i class="bi bi-volume-down-fill"></i>');
      else $("#mute").html('<i class="bi bi-volume-off-fill"></i>');

      musicVolume /= 2;
      soundVolume /= 2;
      music.volume = musicVolume;
      console.log("mV=" + musicVolume + " sV=" + soundVolume);
    }
  } else if (this.id == "muteButton") {
    if (!music.muted) {
      $("#mute").html('<i class="bi bi-volume-mute-fill"></i>');
      music.muted = true;
      console.log("MUTED");
    } else {
      if (musicVolume == 1)
        $("#mute").html('<i class="bi bi-volume-up-fill"></i>');
      if (musicVolume == 0.5)
        $("#mute").html('<i class="bi bi-volume-down-fill"></i>');
      if (musicVolume == 0.25)
        $("#mute").html('<i class="bi bi-volume-off-fill"></i>');
      music.muted = false;
      console.log("UN-MUTED");
    }
  }
});

// Start game
function gameStart() {
  $("#level-title").text("Let the game begins!");
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
    $("#restart").removeClass("disabled");
    $("#start").removeClass("disabled");
    $("#level-title").text("Level " + level);
    music.play();
  }, 5200);
}

// Game over
function gameOver() {
  music.pause();
  music.load();
  $("#restart").addClass("disabled");
  $("#start").addClass("disabled");
  isOver = true;
  playSound("over");
  $("body").addClass("game-over");
  setTimeout(function () {
    $("body").removeClass("game-over");
  }, 200);
  $("#level-title").text("???? Game Over ????");
  setTimeout(function () {
    $("#level-title").text("Shall we play again?");
  }, 2000);
  setTimeout(function () {
    restartGame();
  }, 4000);
}

function restartGame() {
  $("#start").removeClass("disabled");
  $("#start").html('Start <i class="bi bi-play-fill">');
  $("#restart").fadeToggle(200);
  isOver = false;
  isPaused = false;
  level = 0;
  direction = "ArrowRight";
  speed = 175;
  xNode = [0];
  yNode = [0];
  xApple = Math.floor(bWidth / nSize / 2);
  yApple = Math.floor(bHeight / nSize / 2);
  type = apples[0];
  appleExist = true;
  $("#level-title").text("Snake Game");
  drawEmpty();
}

// Update game by 'speed' miliseconds
var update = setInterval(function () {
  if (!isPaused && level > 0) {
    if (!isOver) updateSnake(updateApple);
    draw();
  }
}, speed);

var updateMili = setInterval(function () {
  if (mili == 0) mili = 1000;
  else mili--;
}, 1);
