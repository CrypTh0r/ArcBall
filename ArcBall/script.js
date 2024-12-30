const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');

// Game dimensions and variables
const gameWidth = canvas.width;
const gameHeight = canvas.height;
const ballSize = 15;
const arrowLength = 32;

// Constants for initial speeds
const CONSTANT_ARROW_SPEED = 0.007;  // Fixed constant arrow speed
const CONSTANT_BALL_SPEED = 3;       // Fixed constant ball speed

// Game state variables
let arrowAngle = Math.PI / 6;          // Start at π/6
let arrowDirection = 1;
let ballX = gameWidth / 2;             // Initial ball position
let ballY = gameHeight - ballSize;      // Initial ball position
let ballDX = 0;                         // Change in X (ball movement)
let ballDY = 0;                         // Change in Y (ball movement)
let player1Score = 0;                   // Player score
let isGamePaused = false;               // Game paused state
let isGameOver = false;                 // Game over state
let gameLoopActive = true;              // Control for the game loop

// Goal dimensions
const goalWidth = 85;
const goalHeight = 5;
const goalX = (gameWidth - goalWidth) / 2;
const goalY = 0;

// Load ball image
const ballImage = new Image();
ballImage.src = 'ball.png';

// Event listeners
document.getElementById('reset-button').addEventListener('click', resetGame);
document.getElementById('pause-button').addEventListener('click', togglePause);

// Drawing functions
function drawBall() {
    ctx.drawImage(ballImage, ballX - ballSize / 2, ballY - ballSize / 2, ballSize, ballSize);
}

function drawArrow() {
    ctx.beginPath();
    ctx.moveTo(ballX, ballY);
    ctx.lineTo(ballX + arrowLength * Math.cos(arrowAngle), ballY - arrowLength * Math.sin(arrowAngle));
    ctx.strokeStyle = "#FF0000";
    ctx.stroke();
    ctx.closePath();
}

function drawGoal() {
    ctx.beginPath();
    ctx.rect(goalX, goalY, goalWidth, goalHeight);
    ctx.fillStyle = "#00FF00";
    ctx.fill();
    ctx.closePath();
}

function drawScores() {
    ctx.font = '18px Arial';
    ctx.fillStyle = 'white';
    ctx.fillText('Player: ' + player1Score, 20, 30);
}

// Clearing the canvas
function clearCanvas() {
    ctx.clearRect(0, 0, gameWidth, gameHeight);
}

// Update arrow movement
function updateArrow() {
    arrowAngle += arrowDirection * CONSTANT_ARROW_SPEED; // Use constant speed
    if (arrowAngle > (16 * Math.PI) / 18 || arrowAngle < Math.PI / 9) {
        arrowDirection *= -1;
    }
}

// Move the ball
function moveBall() {
    ballX += ballDX;
    ballY += ballDY;

    // Bounce off walls
    if (ballX + ballSize / 2 > gameWidth || ballX - ballSize / 2 < 0) {
        ballDX = -ballDX;
    }

    // Goal detection
    if (ballY - ballSize / 2 < 0) { // Ball reaches the top (goal)
        if (ballX > goalX && ballX < goalX + goalWidth) {
            player1Score++; // Increase player's score if goal is made

            // Check if player1Score reaches 5 and trigger Game Over
            if (player1Score >= 5) {
                gameOver(); // Trigger game over
            }
        }
        resetBallPosition(); // Reset the ball for the next turn
    } else if (ballY + ballSize / 2 > gameHeight) { // Ball hits bottom
        resetBallPosition();
    }
}

// Reset ball position and restore constant speeds after each turn
function resetBallPosition() {
    ballX = gameWidth / 2;
    ballY = gameHeight - ballSize;
    ballDX = 0; // Reset ball movement
    ballDY = 0; // Reset ball movement

    arrowAngle = Math.PI / 6; // Reset arrow angle
    arrowDirection = 1; // Reset arrow movement direction
}

// End the game and show the Game Over screen
function gameOver() {
    isGameOver = true;
    document.getElementById('game-over').style.display = 'block'; // Show game over screen
    document.getElementById('player1-score').textContent = player1Score; // Display Player 1's score
    document.getElementById('player2-score').textContent = 0; // Player 2 score (0 since only Player 1 scores)
    gameLoopActive = false; // Stop the game loop
}

// Main game loop
function gameLoop() {
    if (!isGamePaused && !isGameOver && gameLoopActive) {
        clearCanvas();
        drawGoal();
        drawBall();
        if (ballDX === 0 && ballDY === 0) {
            drawArrow();
            updateArrow();
        } else {
            moveBall();
        }
        drawScores();
        requestAnimationFrame(gameLoop);
    }
}

// Reset game and restart without changing the speed
function resetGame() {
    // Stop the game loop temporarily
    gameLoopActive = false;

    // Reset player score
    player1Score = 0;

    // Reset game state
    isGameOver = false;
    isGamePaused = false;

    // Hide the Game Over screen
    document.getElementById('game-over').style.display = 'none';  // Hide the game over screen

    // Reset ball and arrow positions, but do not change speeds
    resetBallPosition();

    // Clear the screen and draw the updated state
    clearCanvas();
    drawGoal();
    drawBall();
    drawArrow();
    drawScores();

    // Restart the game loop with constant speeds
    gameLoopActive = true;
    requestAnimationFrame(gameLoop);
}

// Toggle pause
function togglePause() {
    isGamePaused = !isGamePaused; // Toggle pause state
    if (!isGamePaused) {
        requestAnimationFrame(gameLoop); // Resume game loop if unpaused
    }
}

// Controls to shoot the ball (keyboard)
document.addEventListener('keydown', (event) => {
    if (event.key === 'ArrowUp') {
        if (ballDX === 0 && ballDY === 0) {
            ballDX = CONSTANT_BALL_SPEED * Math.cos(arrowAngle); // Use constant ball speed
            ballDY = -CONSTANT_BALL_SPEED * Math.sin(arrowAngle); // Use constant ball speed
            requestAnimationFrame(gameLoop);
        }
    }
});

// Controls to shoot the ball (mouse click)
canvas.addEventListener('click', () => {
    if (ballDX === 0 && ballDY === 0) {
        ballDX = CONSTANT_BALL_SPEED * Math.cos(arrowAngle); // Use constant ball speed
        ballDY = -CONSTANT_BALL_SPEED * Math.sin(arrowAngle); // Use constant ball speed
        requestAnimationFrame(gameLoop);
    }
});

// Controls to shoot the ball (touch event for mobile compatibility)
canvas.addEventListener('touchstart', (event) => {
    event.preventDefault(); // Prevent default touch behavior (e.g., scrolling)
    if (ballDX === 0 && ballDY === 0) {
        ballDX = CONSTANT_BALL_SPEED * Math.cos(arrowAngle); // Use constant ball speed
        ballDY = -CONSTANT_BALL_SPEED * Math.sin(arrowAngle); // Use constant ball speed
        requestAnimationFrame(gameLoop);
    }
});

// Start the game loop
requestAnimationFrame(gameLoop);