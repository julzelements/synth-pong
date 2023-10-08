import React, { useEffect, useRef, useState } from "react";

const useFrameTime = () => {
  const [frameTime, setFrameTime] = React.useState(performance.now());
  React.useEffect(() => {
    let frameId: number;
    const frame = (time: React.SetStateAction<number>) => {
      setFrameTime(time);
      frameId = requestAnimationFrame(frame);
    };
    requestAnimationFrame(frame);
    return () => cancelAnimationFrame(frameId);
  }, []);
  return frameTime;
};

function Pong() {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [gameState, setGameState] = useState({
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
  });

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const canvasContext = canvas.getContext("2d");
    if (!canvasContext) return;

    const collides = (
      obj1: { x: any; y: any; width: any; height: any; resetting?: boolean; dx?: number; dy?: number },
      obj2: { x: any; y: any; width: any; height: any; dy?: number }
    ) => {
      return (
        obj1.x < obj2.x + obj2.width &&
        obj1.x + obj1.width > obj2.x &&
        obj1.y < obj2.y + obj2.height &&
        obj1.y + obj1.height > obj2.y
      );
    };

    const loop = () => {
      requestAnimationFrame(loop);

      const { canvasWidth, canvasHeight, grid, maxPaddleY, leftPaddle, rightPaddle, ball, paddleSpeed, ballSpeed } =
        gameState;

      canvasContext.clearRect(0, 0, canvasWidth, canvasHeight);

      setGameState((prevState) => ({
        ...prevState,
        leftPaddle: { ...leftPaddle, y: leftPaddle.y + leftPaddle.dy },
        rightPaddle: { ...rightPaddle, y: rightPaddle.y + rightPaddle.dy },
      }));

      if (leftPaddle.y < grid) {
        setGameState((prevState) => ({
          ...prevState,
          leftPaddle: { ...leftPaddle, y: grid },
        }));
      } else if (leftPaddle.y > maxPaddleY) {
        setGameState((prevState) => ({
          ...prevState,
          leftPaddle: { ...leftPaddle, y: maxPaddleY },
        }));
      }

      if (rightPaddle.y < grid) {
        setGameState((prevState) => ({
          ...prevState,
          rightPaddle: { ...rightPaddle, y: grid },
        }));
      } else if (rightPaddle.y > maxPaddleY) {
        setGameState((prevState) => ({
          ...prevState,
          rightPaddle: { ...rightPaddle, y: maxPaddleY },
        }));
      }

      canvasContext.fillStyle = "white";
      canvasContext.fillRect(leftPaddle.x, leftPaddle.y, leftPaddle.width, leftPaddle.height);
      canvasContext.fillRect(rightPaddle.x, rightPaddle.y, rightPaddle.width, rightPaddle.height);

      setGameState((prevState) => ({
        ...prevState,
        ball: { ...ball, x: ball.x + ball.dx, y: ball.y + ball.dy },
      }));

      if (ball.y < grid) {
        setGameState((prevState) => ({
          ...prevState,
          ball: { ...ball, y: grid, dy: ball.dy * -1 },
        }));
      } else if (ball.y + grid > canvasHeight - grid) {
        setGameState((prevState) => ({
          ...prevState,
          ball: { ...ball, y: canvasHeight - grid * 2, dy: ball.dy * -1 },
        }));
      }

      if ((ball.x < 0 || ball.x > canvasWidth) && !ball.resetting) {
        setGameState((prevState) => ({
          ...prevState,
          ball: {
            ...ball,
            resetting: true,
          },
        }));

        setTimeout(() => {
          setGameState((prevState) => ({
            ...prevState,
            ball: {
              ...ball,
              resetting: false,
              x: canvasWidth / 2,
              y: canvasHeight / 2,
            },
          }));
        }, 400);
      }

      if (collides(ball, leftPaddle)) {
        setGameState((prevState) => ({
          ...prevState,
          ball: { ...ball, dx: ball.dx * -1, x: leftPaddle.x + leftPaddle.width },
        }));
      } else if (collides(ball, rightPaddle)) {
        setGameState((prevState) => ({
          ...prevState,
          ball: { ...ball, dx: ball.dx * -1, x: rightPaddle.x - ball.width },
        }));
      }

      canvasContext.fillRect(ball.x, ball.y, ball.width, ball.height);

      canvasContext.fillStyle = "lightgrey";
      canvasContext.fillRect(0, 0, canvasWidth, grid);
      canvasContext.fillRect(0, canvasHeight - grid, canvasWidth, canvasHeight);

      for (let i = grid; i < canvasHeight - grid; i += grid * 2) {
        canvasContext.fillRect(canvasWidth / 2 - grid / 2, i, grid, grid);
      }
    };

    // loop();

    return () => {};
  }, [gameState]);

  return (
    <canvas
      ref={canvasRef}
      width={gameState.canvasWidth}
      height={gameState.canvasHeight}
      id="game"
      style={{ background: "black", display: "block", margin: "0 auto" }}
    />
  );
}

export default Pong;
