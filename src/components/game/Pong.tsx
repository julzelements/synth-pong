import React, { Component, RefObject } from "react";

interface Paddle {
  x: number;
  y: number;
  width: number;
  height: number;
  dy: number;
}

interface Ball {
  x: number;
  y: number;
  width: number;
  height: number;
  resetting: boolean;
  dx: number;
  dy: number;
}

interface GameState {
  canvasWidth: number;
  canvasHeight: number;
  grid: number;
  paddleHeight: number;
  maxPaddleY: number;
  paddleSpeed: number;
  ballSpeed: number;
  leftPaddle: Paddle;
  rightPaddle: Paddle;
  ball: Ball;
}

class Pong extends Component<{}, GameState> {
  private canvasRef: RefObject<HTMLCanvasElement>;
  private canvas: HTMLCanvasElement | null = null;
  private canvasContext: CanvasRenderingContext2D | null = null;

  constructor(props: {}) {
    super(props);

    this.canvasRef = React.createRef();

    this.state = {
      canvasWidth: 750,
      canvasHeight: 585,
      grid: 15,
      paddleHeight: 15 * 5,
      maxPaddleY: 585 - 15 - 15 * 5,
      paddleSpeed: 6,
      ballSpeed: 5,
      leftPaddle: {
        x: 15 * 2,
        y: 585 / 2 - (15 * 5) / 2,
        width: 15,
        height: 15 * 5,
        dy: 0,
      },
      rightPaddle: {
        x: 750 - 15 * 3,
        y: 585 / 2 - (15 * 5) / 2,
        width: 15,
        height: 15 * 5,
        dy: 0,
      },
      ball: {
        x: 750 / 2,
        y: 585 / 2,
        width: 15,
        height: 15,
        resetting: false,
        dx: 5,
        dy: -5,
      },
    };
  }

  componentDidMount() {
    this.canvas = this.canvasRef.current;
    if (this.canvas) {
      this.canvasContext = this.canvas.getContext("2d")!;
      this.loop();
      document.addEventListener("keydown", this.handleKeyDown);
      document.addEventListener("keyup", this.handleKeyUp);
    }
  }

  componentWillUnmount() {
    document.removeEventListener("keydown", this.handleKeyDown);
    document.removeEventListener("keyup", this.handleKeyUp);
  }

  collides(
    obj1: { x: number; y: number; width: number; height: number },
    obj2: { x: number; y: number; width: number; height: number }
  ) {
    return (
      obj1.x < obj2.x + obj2.width &&
      obj1.x + obj1.width > obj2.x &&
      obj1.y < obj2.y + obj2.height &&
      obj1.y + obj1.height > obj2.y
    );
  }

  handleKeyDown = (e: KeyboardEvent) => {
    const { rightPaddle, leftPaddle, paddleSpeed } = this.state;
    if (e.which === 38) {
      rightPaddle.dy = -paddleSpeed;
    } else if (e.which === 40) {
      rightPaddle.dy = paddleSpeed;
    }

    if (e.which === 87) {
      leftPaddle.dy = -paddleSpeed;
    } else if (e.which === 83) {
      leftPaddle.dy = paddleSpeed;
    }
  };

  handleKeyUp = (e: KeyboardEvent) => {
    const { rightPaddle, leftPaddle } = this.state;
    if (e.which === 38 || e.which === 40) {
      rightPaddle.dy = 0;
    }

    if (e.which === 83 || e.which === 87) {
      leftPaddle.dy = 0;
    }
  };

  loop = () => {
    requestAnimationFrame(this.loop);
    const {
      canvasContext: context,
      state: { canvasWidth, canvasHeight, grid, maxPaddleY, leftPaddle, rightPaddle, ball, paddleSpeed, ballSpeed },
    } = this;

    if (context) {
      context.clearRect(0, 0, canvasWidth, canvasHeight);

      leftPaddle.y += leftPaddle.dy;
      rightPaddle.y += rightPaddle.dy;

      if (leftPaddle.y < grid) {
        leftPaddle.y = grid;
      } else if (leftPaddle.y > maxPaddleY) {
        leftPaddle.y = maxPaddleY;
      }

      if (rightPaddle.y < grid) {
        rightPaddle.y = grid;
      } else if (rightPaddle.y > maxPaddleY) {
        rightPaddle.y = maxPaddleY;
      }

      if (context) {
        context.fillStyle = "white";
        context.fillRect(leftPaddle.x, leftPaddle.y, leftPaddle.width, leftPaddle.height);
        context.fillRect(rightPaddle.x, rightPaddle.y, rightPaddle.width, rightPaddle.height);

        ball.x += ball.dx;
        ball.y += ball.dy;

        if (ball.y < grid) {
          ball.y = grid;
          ball.dy *= -1;
        } else if (ball.y + grid > canvasHeight - grid) {
          ball.y = canvasHeight - grid * 2;
          ball.dy *= -1;
        }

        if ((ball.x < 0 || ball.x > canvasWidth) && !ball.resetting) {
          ball.resetting = true;

          setTimeout(() => {
            ball.resetting = false;
            ball.x = canvasWidth / 2;
            ball.y = canvasHeight / 2;
          }, 400);
        }

        if (this.collides(ball, leftPaddle)) {
          ball.dx *= -1;
          ball.x = leftPaddle.x + leftPaddle.width;
        } else if (this.collides(ball, rightPaddle)) {
          ball.dx *= -1;
          ball.x = rightPaddle.x - ball.width;
        }

        if (context) {
          context.fillRect(ball.x, ball.y, ball.width, ball.height);

          context.fillStyle = "lightgrey";
          context.fillRect(0, 0, canvasWidth, grid);
          context.fillRect(0, canvasHeight - grid, canvasWidth, canvasHeight);

          for (let i = grid; i < canvasHeight - grid; i += grid * 2) {
            context.fillRect(canvasWidth / 2 - grid / 2, i, grid, grid);
          }
        }
      }
    }
  };

  render() {
    const { canvasWidth, canvasHeight } = this.state;
    return (
      <canvas
        ref={this.canvasRef}
        width={canvasWidth}
        height={canvasHeight}
        id="game"
        style={{ background: "black", display: "block", margin: "0 auto" }}
      />
    );
  }
}

export default Pong;
