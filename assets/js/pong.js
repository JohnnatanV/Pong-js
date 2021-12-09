// Canvas
const cvs = document.getElementById("pong");
const ctx = cvs.getContext("2d");

// User Paddle
const user = {
  x: 0,
  y: cvs.height / 2 - 50,
  width: 10,
  height: 100,
  color: "white",
  score: 0,
};

// Com Paddle
const com = {
  x: cvs.width - 10,
  y: cvs.height / 2 - 50,
  width: 10,
  height: 100,
  color: "white",
  score: 0,
};

// Ball
const ball = {
  x: cvs.width / 2,
  y: cvs.height / 2,
  radius: 10,
  speed: 7,
  velocityX: 5,
  velocityY: 5,
  color: "white",
};

// Net
const net = {
  x: cvs.width / 2 - 1,
  y: 0,
  width: 2,
  height: 10,
  color: "white",
};

//Draw Net

const drawNet = () => {
  for (let i = 0; i <= cvs.height; i += 15) {
    drawRect(net.x, net.y + i, net.width, net.height, net.color);
  }
};

// Board
const drawRect = (x, y, w, h, color) => {
  ctx.fillStyle = color;
  ctx.fillRect(x, y, w, h);
};

// Draw Circle
const drawCircle = (x, y, r, color) => {
  ctx.fillStyle = color;
  ctx.beginPath();
  ctx.arc(x, y, r, 0, Math.PI * 2, false);
  ctx.closePath();
  ctx.fill();
};

// Draw Text
const drawText = (text, x, y, color) => {
  ctx.fillStyle = color;
  ctx.font = "bold 45px Courier New";
  ctx.fillText(text, x, y);
};

// Control paddle

const movePaddle = (event) => {
  let rect = cvs.getBoundingClientRect();

  user.y = event.clientY - rect.top - user.height / 2;
};

cvs.addEventListener("mousemove", movePaddle);

//Collition function
const collision = (b, p) => {
  b.top = b.y - b.radius;
  b.bottom = b.y + b.radius;
  b.left = b.x - b.radius;
  b.right = b.x + b.radius;

  p.top = p.y;
  p.bottom = p.y + p.height;
  p.left = p.x;
  p.right = p.x + p.width;

  return (
    b.right > p.left &&
    b.bottom > p.top &&
    (b.left < p.right) & (b.top < p.bottom)
  );
};

// Reset ball
const resetBall = () => {
  ball.x = cvs.width / 2;
  ball.y = cvs.height / 2;

  ball.speed = 5;
  ball.velocityX = -ball.velocityX;
};

// Update game data
const update = () => {
  ball.x += ball.velocityX;
  ball.y += ball.velocityY;

  //Simple AI
  let computerLevel = 0.1;
  com.y += (ball.y - (com.y + com.height / 2)) * computerLevel;

  if (ball.y + ball.radius > cvs.height || ball.y - ball.radius < 0) {
    ball.velocityY = -ball.velocityY;
  }

  let player = ball.x + ball.radius < cvs.width / 2 ? user : com;

  if (collision(ball, player)) {
    let collidePoint = ball.y - (player.y + player.height / 2);

    collidePoint = collidePoint / (player.height / 2);

    //Calculate angle
    let angle = collidePoint * (Math.PI / 4);

    // X direction
    let direction = ball.x + ball.radius < cvs.width / 2 ? 1 : -1;

    //Vel X and Y
    ball.velocityX = direction * ball.speed * Math.cos(angle);
    ball.velocityY = ball.speed * Math.sin(angle);

    // Incresse speed on every hit
    ball.speed += 0.5;
  }

  // Update Score

  if (ball.x - ball.radius < 0) {
    com.score++;
    resetBall();
  } else if (ball.x + ball.radius > cvs.width) {
    user.score++;
    resetBall();
  }
};

//  Rendering
const render = () => {
  // Clear the canvas
  drawRect(0, 0, cvs.width, cvs.height, "black");

  // Net
  drawNet();

  // Score
  drawText(user.score, cvs.width / 4, cvs.height / 5, "white");
  drawText(com.score, (3 * cvs.width) / 4, cvs.height / 5, "#F5F5F5");

  // Draw the user and com paddle
  drawRect(user.x, user.y, user.width, user.height, user.color);
  drawRect(com.x, com.y, com.width, com.height, com.color);

  //Draw ball
  drawCircle(ball.x, ball.y, ball.radius, ball.color);
};

// Game Init
const game = () => {
  update();
  render();
};

// Loop

const framePerSecond = 50;

setInterval(game, 1000 / framePerSecond);
