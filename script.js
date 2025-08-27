const gameBoard = document.querySelector("#game-board")
const context = gameBoard.getContext("2d")
const scoreText = document.querySelector("#score-text")

const GAME_WIDTH = gameBoard.width
const GAME_HEIGHT = gameBoard.height

const PADDLE_WIDTH = 100
const PADDLE_HEIGHT = 25
const PADDLE_X = GAME_WIDTH / 2 - PADDLE_WIDTH / 2
const PADDLE_Y = GAME_HEIGHT - PADDLE_HEIGHT - 10
const PADDLE_SPEED = 20

const BALL_RADIUS = 12.5
const BALL_SPEED_X = 5
const BALL_SPEED_Y = 5

const BRICK_ROWS = 5
const BRICK_COLUMNS = 10
const BRICK_GAP = 5
const BRICK_WIDTH = (GAME_WIDTH - BRICK_GAP) / BRICK_COLUMNS - BRICK_GAP
const BRICK_HEIGHT = 20
const BRICK_COLOR = "red"
const BRICK_BORDER_COLOR = "black"

let bricks = []

let leftPressed = false
let rightPressed = false

let score = 0

const paddle = {
  x: PADDLE_X,
  y: PADDLE_Y,
  width: PADDLE_WIDTH,
  height: PADDLE_HEIGHT,
  speed: PADDLE_SPEED,
}

const ball = {
  x: GAME_WIDTH / 2,
  y: PADDLE_Y - BALL_RADIUS,
  radius: BALL_RADIUS,
  speedX: BALL_SPEED_X,
  speedY: -BALL_SPEED_Y,
}

document.addEventListener("keydown", e => {
  if (e.key === "ArrowLeft") {
    leftPressed = true
  }
  if (e.key === "ArrowRight") {
    rightPressed = true
  }
})

document.addEventListener("keyup", e => {
  if (e.key === "ArrowLeft") {
    leftPressed = false
  }
  if (e.key === "ArrowRight") {
    rightPressed = false
  }
})

function createBricks() {
  for (let i = 0; i < BRICK_COLUMNS; i++) {
    for (let j = 0; j < BRICK_ROWS; j++) {
      const brick = {
        x: BRICK_GAP + i * (BRICK_WIDTH + BRICK_GAP),
        y: BRICK_GAP + j * (BRICK_HEIGHT + BRICK_GAP) + 20,
        width: BRICK_WIDTH,
        height: BRICK_HEIGHT,
        isBroken: false,
      }
      bricks.push(brick)
    }
  }
}

function update() {
  if (leftPressed && paddle.x > 0) {
    paddle.x -= paddle.speed
  }
  if (rightPressed && paddle.x < GAME_WIDTH - paddle.width) {
    paddle.x += paddle.speed
  }

  ball.x += ball.speedX
  ball.y += ball.speedY

  if (ball.x + ball.radius > GAME_WIDTH || ball.x - ball.radius < 0) {
    ball.speedX *= -1
  }
  if (ball.y - ball.radius < 0) {
    ball.speedY *= -1
  }
  if (ball.y + ball.radius > GAME_HEIGHT) {
    resetGame()
  }

  if (
    ball.y + ball.radius > paddle.y &&
    ball.x > paddle.x &&
    ball.x < paddle.x + paddle.width
  ) {
    ball.speedY *= -1
    ball.y = paddle.y - ball.radius
  }

  bricks.forEach(brick => {
    if (
      !brick.isBroken &&
      ball.x > brick.x &&
      ball.x < brick.x + brick.width &&
      ball.y > brick.y &&
      ball.y < brick.y + brick.height
    ) {
      ball.speedY *= -1
      brick.isBroken = true
      score += 100
    }
  })

  if (bricks.every(brick => brick.isBroken)) {
    resetGame()
  }
}

function draw() {
  context.clearRect(0, 0, GAME_WIDTH, GAME_HEIGHT)

  context.fillStyle = "blue"
  context.fillRect(paddle.x, paddle.y, paddle.width, paddle.height)

  context.fillStyle = "white"
  context.beginPath()
  context.arc(ball.x, ball.y, ball.radius, 0, Math.PI * 2)
  context.fill()
  context.closePath()

  bricks.forEach(brick => {
    if (!brick.isBroken) {
      context.fillStyle = BRICK_COLOR
      context.fillRect(brick.x, brick.y, brick.width, brick.height)
      context.strokeStyle = BRICK_BORDER_COLOR
      context.strokeRect(brick.x, brick.y, brick.width, brick.height)
    }
  })

  context.fillStyle = "white"
  context.font = "20px Arial"
  context.fillText(`Score: ${score}`, 10, 20)
}

function resetGame() {
  paddle.x = PADDLE_X
  paddle.y = PADDLE_Y
  ball.x = GAME_WIDTH / 2
  ball.y = PADDLE_Y - BALL_RADIUS
  ball.speedX = BALL_SPEED_X * (Math.random() > 0.5 ? 1 : -1)
  ball.speedY = -BALL_SPEED_Y
  bricks = []
  createBricks()
  score = 0
}

function gameLoop() {
  update()
  draw()
  requestAnimationFrame(gameLoop)
}

createBricks()
gameLoop()