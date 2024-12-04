//board
var blockSize = 25;
var rows = 20;
var cols = 20;
var board;
var context;

//snake head
var snakeX = blockSize * 5;
var snakeY = blockSize * 5;

var velocityX = 0;
var velocityY = 0;

var snakeBody = [];

//food
var foodX;
var foodY;

//score
var score = 0;

//game over
var gameOver = false;

//intervalId for game loop
var intervalId;

window.onload = function() {
    board = document.getElementById("board");
    board.height = rows * blockSize;
    board.width = cols * blockSize;
    context = board.getContext("2d");

    // Create and display the score
    var scoreDisplay = document.createElement('div');
    scoreDisplay.id = 'score';
    scoreDisplay.innerHTML = 'Pontok: 0';
    document.body.appendChild(scoreDisplay);

    placeFood();
    document.addEventListener("keyup", changeDirection);
    
    // Start the game loop with initial interval
    intervalId = setInterval(update, 1000 / 10); // 100 ms
}

function update() {
    if (gameOver) {
        showGameOver();
        return;
    }

    // Clear the board
    context.fillStyle = "black";
    context.fillRect(0, 0, board.width, board.height);

    // Draw food
    context.fillStyle = "red";
    context.fillRect(foodX, foodY, blockSize, blockSize);

    // Check if snake eats the food
    if (snakeX == foodX && snakeY == foodY) {
        snakeBody.push([foodX, foodY]);
        placeFood();
        score += 1; // Increase score when snake eats food
        updateScore(); // Update score display
    }

    // Move snake body
    for (let i = snakeBody.length - 1; i > 0; i--) {
        snakeBody[i] = snakeBody[i - 1];
    }
    if (snakeBody.length) {
        snakeBody[0] = [snakeX, snakeY];
    }

    // Move snake head
    context.fillStyle = "lime";
    snakeX += velocityX * blockSize;
    snakeY += velocityY * blockSize;
    context.fillRect(snakeX, snakeY, blockSize, blockSize);

    // Draw the body
    for (let i = 0; i < snakeBody.length; i++) {
        context.fillRect(snakeBody[i][0], snakeBody[i][1], blockSize, blockSize);
    }

    // Check for game over conditions
    if (snakeX < 0 || snakeX >= cols * blockSize || snakeY < 0 || snakeY >= rows * blockSize) {
        gameOver = true;
    }

    // Check if snake collides with itself
    for (let i = 0; i < snakeBody.length; i++) {
        if (snakeX == snakeBody[i][0] && snakeY == snakeBody[i][1]) {
            gameOver = true;
        }
    }
}

function changeDirection(e) {
    if (e.code == "ArrowUp" && velocityY != 1) {
        velocityX = 0;
        velocityY = -1;
    }
    else if (e.code == "ArrowDown" && velocityY != -1) {
        velocityX = 0;
        velocityY = 1;
    }
    else if (e.code == "ArrowLeft" && velocityX != 1) {
        velocityX = -1;
        velocityY = 0;
    }
    else if (e.code == "ArrowRight" && velocityX != -1) {
        velocityX = 1;
        velocityY = 0;
    }
}

function placeFood() {
    foodX = Math.floor(Math.random() * cols) * blockSize;
    foodY = Math.floor(Math.random() * rows) * blockSize;
}

// Function to update the score on the screen
function updateScore() {
    var scoreDisplay = document.getElementById('score');
    scoreDisplay.innerHTML = 'Pontok: ' + score;
}

// Function to show the game over screen and restart button
function showGameOver() {
    // Darken the board background
    context.fillStyle = "rgba(0, 0, 0, 0.7)"; // Semi-transparent black
    context.fillRect(0, 0, board.width, board.height);

    // Show the Game Over message in the middle of the screen
    context.fillStyle = "white";
    context.font = "30px Arial";
    context.textAlign = "center";
    context.textBaseline = "middle";
    context.fillText("Játék vége!", board.width / 2, board.height / 2 - 30);
    context.font = "20px Arial";
    context.fillText("Szerzett pontok: " + score, board.width / 2, board.height / 2);

    // Only create the restart button once
    if (!document.querySelector('button')) {
        var restartButton = document.createElement('button');
        restartButton.innerHTML = "Újrakezdés";
        restartButton.onclick = restartGame;
        document.body.appendChild(restartButton);
    }
}

// Function to restart the game
function restartGame() {
    // Reset variables to initial state
    snakeX = blockSize * 5;
    snakeY = blockSize * 5;
    velocityX = 0;
    velocityY = 0;
    snakeBody = [];
    score = 0;
    gameOver = false;

    // Stop the current interval (to avoid multiple intervals running at once)
    clearInterval(intervalId);

    // Remove the restart button and game over screen
    var restartButton = document.querySelector('button');
    if (restartButton) {
        document.body.removeChild(restartButton);
    }

    // Reset the score display
    updateScore();

    // Restart the game loop with the correct speed
    intervalId = setInterval(update, 1000 / 10); // 100 milliseconds
}
