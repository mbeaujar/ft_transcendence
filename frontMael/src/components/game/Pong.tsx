import React, { useEffect, useRef, useState } from "react";
import api from "../../apis/api";
import Input from "../chat/Input";
import { Socket } from "socket.io-client";
import getSocket from "./Socket";
import { IGame } from "./interface/game.interface";

const WIDTH = 800;
const HEIGHT = 400;
const PADDLEW = 10;
const PADDLEH = 80;
const BACKGROUND = "#7f0000";
const PADDLE = "#ffffff";
const BALL = "#00007f";

const Pong = (props: any) => {
  const canvasRef = useRef(null);
  const [score, setScore] = useState<Array<number>>([0, 0]);
  const [id, setId] = useState<number>();
  const [mode, setMode] = useState<number>(0);
  const [socket, setSocket] = useState<Socket | null>(null);



  const startListenerGame = (socketEffect: Socket, context: any) => {
    socketEffect.on("startGame", (data: any) => {
      setId(data?.match?.id);
    });
    socketEffect.on("infoGame", (data: IGame) => {
      resetWindow(context);
      drawCircle(
        context,
        calculPercentage(data.ballx, WIDTH),
        calculPercentage(data.bally, HEIGHT),
        PADDLEW
      );
      if (data.player1 !== undefined && data.paddleh1 !== undefined) {
        drawPaddle(
          context,
          5,
          calculPercentage(data.player1, HEIGHT) -
            calculPercentage(data.paddleh1, HEIGHT) / 2, // 160
          PADDLEW,
          calculPercentage(data.paddleh1, HEIGHT)
        );
      }
      if (data.player2 !== undefined && data.paddleh2 !== undefined) {
  
        drawPaddle(
          context,
          WIDTH - PADDLEW - 2,
          calculPercentage(data.player2, HEIGHT) -
            calculPercentage(data.paddleh2, HEIGHT) / 2,
          PADDLEW,
          calculPercentage(data.paddleh2, HEIGHT)
        );
      }
    });
    socketEffect.on("scoreGame", (data: { score: Array<number> }) => {
      setScore(data.score);
    });
  };

  const resetWindow = (context: any) => {
    context.clearRect(0, 0, WIDTH, HEIGHT);
  };

  const drawCircle = (context: any, x: any, y: any, r: any) => {
    context.fillStyle = BALL;
    context.beginPath();
    context.arc(x, y, r, 0, Math.PI * 2, true);
    context.closePath();
    context.fill();
  };

  const drawPaddle = (context: any, x: any, y: any, w: any, h: any) => {
    context.fillStyle = PADDLE;
    context.beginPath();
    context.rect(x, y, w, h);
    context.closePath();
    context.fill();
  };

  const calculPercentage = (percentage: number, max: number) => {
    return (percentage * max) / 100;
  };

  useEffect(() => {
    const canvas: any = canvasRef ? canvasRef.current : null;
    const context = canvas ? canvas.getContext("2d") : null;

    const socketEffect = getSocket("game");
    startListenerGame(socketEffect, context);
    setSocket(socketEffect);
    return () => {
      if (socketEffect && socketEffect.connected === true) {
        socketEffect.disconnect();
      }
    };
  }, []);

  return (
    <div>
      <div>
        <button
          onClick={() => {
            socket?.emit("joinQueue", { mode, invite: 0, target: 0 });
          }}
        >
          joinQueue
        </button>
      </div>
      <div>
        {score[0]} | {score[1]}
      </div>
      <canvas
        style={{ backgroundColor: BACKGROUND }}
        width={WIDTH}
        height={HEIGHT}
        ref={canvasRef}
        tabIndex={0}
        onKeyUp={(event) => {
          if (event.code === "ArrowUp") socket?.emit("moveTopPaddle", { id });
          if (event.code === "ArrowDown") socket?.emit("moveBotPaddle", { id });
        }}
      />
    </div>
  );
};

export default Pong;
