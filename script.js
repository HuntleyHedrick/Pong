const canvas = document.getElementById('game');
const context = canvas.getContext('2d');
const grid = 15;
const paddleHeight = grid * 5; // 80
const maxPaddleY = canvas.height - grid - paddleHeight;

var paddleSpeed = 10;
var ballSpeed = 5;
var leftScore =0;
var rightScore =0;





const leftPaddle = {
  // start in the middle of the game on the left side
  x: grid * 2,
  y: canvas.height / 2 - paddleHeight / 2,
  width: grid,
  height: paddleHeight,

  // paddle velocity
  dy: 0
};
const rightPaddle = {
  // start in the middle of the game on the right side
  x: canvas.width - grid * 3,
  y: canvas.height / 2 - paddleHeight / 2,
  width: grid,
  height: paddleHeight,

  // paddle velocity
  dy: 0
};
const ball = {
  // start in the middle of the game
  x: canvas.width / 2,
  y: canvas.height / 2,
  width: grid,
  height: grid,

  // keep track of when need to reset the ball position
  resetting: false,

  // ball velocity (start going to the top-right corner)
  dx: ballSpeed,
  dy: -ballSpeed
};

function collides(obj1, obj2) {
  return obj1.x < obj2.x + obj2.width &&
         obj1.x + obj1.width > obj2.x &&
         obj1.y < obj2.y + obj2.height &&
         obj1.y + obj1.height > obj2.y;
}

// game loop
function loop() {
  requestAnimationFrame(loop);

  context.clearRect(0,0,canvas.width,canvas.height);

  // move paddles by their velocity
  leftPaddle.y += leftPaddle.dy;
  rightPaddle.y += rightPaddle.dy;

  // prevent paddles from going through walls
  if (leftPaddle.y < grid) {
    leftPaddle.y = grid;
  }
  else if (leftPaddle.y > maxPaddleY) {
    leftPaddle.y = maxPaddleY;
  }

  if (rightPaddle.y < grid) {
    rightPaddle.y = grid;
  }
  else if (rightPaddle.y > maxPaddleY) {
    rightPaddle.y = maxPaddleY;
  }

  // draw paddles
  context.fillStyle = 'CadetBlue';
  context.fillRect(leftPaddle.x, leftPaddle.y, leftPaddle.width, leftPaddle.height);
  context.fillStyle = 'DarkGray';
  context.fillRect(rightPaddle.x, rightPaddle.y, rightPaddle.width, rightPaddle.height);

  // move ball by its velocity
  ball.x += ball.dx;
  ball.y += ball.dy;

  // prevent ball from going through walls by changing its velocity
  if (ball.y < grid) {
    ball.y = grid;
    ball.dy *= -1.05;
  }
  else if (ball.y + grid > canvas.height - grid) {
    ball.y = canvas.height - grid * 2;
    ball.dy *= -1.05;
  }

  // reset ball if it goes past paddle (but only if we haven't already done so)
  //left score
  if (( ball.x < 0) && !ball.resetting) {
    leftScore += 1;
    
    document.getElementById("leftScore").innerHTML = leftScore; 
    
    ball.resetting = true;

    // give some time for the player to recover before launching the ball again
   
    setTimeout(() => {
      ball.resetting = false;
      ball.x = canvas.width / 2;
      ball.y = canvas.height / 2;
      ball.dx = -5
      ball.dy = 5
    }, 1500);
  }
   //right score
  else if (( ball.x > canvas.width) && !ball.resetting) {
    rightScore += 1;

    document.getElementById("rightScore").innerHTML = rightScore; 
    ball.resetting = true;
    // give some time for the player to recover before launching the ball again
    setTimeout(() => {
      ball.resetting = false;
      ball.x = canvas.width / 2;
      ball.y = canvas.height / 2;
      ball.dx = 5
      ball.dy = -5
    }, 1500);
  }


  // check to see if ball collides with paddle. if they do change x velocity
  if (collides(ball, leftPaddle)) {
    ball.dx *= -1.1;

    // move ball next to the paddle otherwise the collision will happen again in the next frame
    ball.x = leftPaddle.x + leftPaddle.width;
    paddleSpeed
  }
  else if (collides(ball, rightPaddle)) {
    ball.dx *= -1.1;

    // move ball next to the paddle otherwise the collision will happen again in the next frame
    ball.x = rightPaddle.x - ball.width;
  }

  // draw ball
  //context.fillRect(ball.x, ball.y, ball.width, ball.height);
  context.beginPath();
context.arc(ball.x + ball.width / 2, ball.y + ball.height / 2, ball.width / 2, 0, Math.PI * 2); // Draw circle for ball
context.fillStyle = 'white';
context.fill();
context.lineWidth = 1;
context.strokeStyle = 'black';
context.stroke();
context.fillStyle = 'black';
const squareSize = 5;
context.fillRect(ball.x + 5, ball.y + 5, squareSize, squareSize);

  // draw walls
  context.fillStyle = 'white';
  context.fillRect(0, 0, canvas.width, grid);
  context.fillRect(0, canvas.height - grid, canvas.width, canvas.height);
  context.fillStyle = 'white'; 
  context.fillRect(0, 0, 5, canvas.height); 
  context.fillRect(canvas.width - grid +10, 0, 5, canvas.height); 
  context.fillRect(canvas.width / 2 - grid / 2, canvas.height, grid, grid);
  for (let i = grid; i < canvas.height - grid; i += grid * 2) {
    context.fillRect(canvas.width / 2 - grid / 2, i, grid, canvas.height);
  }
  context.fillStyle = 'lightgrey';
  context.beginPath();
  context.arc(canvas.width / 2, canvas.height / 2, 50, 0, Math.PI * 2); 
  context.strokeStyle = 'white';
  context.lineWidth = grid;
  context.stroke();
  context.closePath();
  
}

// listen to keyboard events to move the paddles
document.addEventListener('keydown', function(e) {

  // up arrow key
  if (e.which === 38) {
    rightPaddle.dy = -paddleSpeed;
  }
  // down arrow key
  else if (e.which === 40) {
    rightPaddle.dy = paddleSpeed;
  }

  // w key
  if (e.which === 87) {
    leftPaddle.dy = -paddleSpeed;
  }
  // a key
  else if (e.which === 83) {
    leftPaddle.dy = paddleSpeed;
  }
});

// listen to keyboard events to stop the paddle if key is released
document.addEventListener('keyup', function(e) {
  if (e.which === 38 || e.which === 40) {
    rightPaddle.dy = 0;
  }

  if (e.which === 83 || e.which === 87) {
    leftPaddle.dy = 0;
  }
});


requestAnimationFrame(loop);

