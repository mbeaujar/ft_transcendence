import React, { useEffect, useRef, useState } from 'react';
import { WebSocket } from '../chat/Socket';
import { IGame } from './interface/game.interface';

const WIDTH = 800;
const HEIGHT = 400;
const BACKGROUND = '#7f0000';
const PADDLE = '#ffffff';
const BALL = '#00007f';
const ws = new WebSocket('http://localhost:3000/game');

const Pong = () => {
  const canvasRef = useRef(null);
  const [context, setContext] = useState<any>(null);
  const [score, setScore] = useState<Array<number>>([0, 0]);
  const [keyUp, setkeyUp] = useState<boolean>(false);
  const [keyDown, setkeyDown] = useState<boolean>(false);

  const resetWindow = (context: any) => {
    context.clearRect(0, 0, WIDTH, HEIGHT);
    context.fillStyle = BACKGROUND;
    context.fillRect(0, 0, WIDTH, HEIGHT);
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

  useEffect(() => {
    ws.socket.on('startGame', (data: any) => {});
    ws.socket.on('infoGame', (data: IGame) => {
      resetWindow(context);
      drawCircle(context, data.ballx, data.bally, 10);
      drawPaddle(context, 10, data.player1, 10, 75);
      drawPaddle(context, WIDTH - 20, data.player2, 10, 75);
      if (keyUp) ws.socket.emit('moveTopPaddle');
      if (keyDown) ws.socket.emit('moveBotPaddle');
    });
    ws.socket.on('scoreGame', (data: Array<number>) => {
      setScore(data);
    });

    const canvas: any = canvasRef.current;
    const context = canvas.getContext('2d');
    context.fillStyle = BACKGROUND;
    context.fillRect(0, 0, WIDTH, HEIGHT);
    setContext(context);
  }, []);

  console.log('context', context);

  return (
    <div>
      <div>
        <button
          onClick={() => {
            ws.socket.emit('joinQueue');
          }}
        >
          joinQueue
        </button>
      </div>
      <div>
        {score[0]} | {score[1]}
      </div>
      <canvas
        width={WIDTH}
        height={HEIGHT}
        ref={canvasRef}
        onKeyDown={event => {
          if (event.code === 'ArrowUp') setkeyUp(true);
          if (event.code === 'ArrowDown') setkeyDown(true);
        }}
        onKeyUp={event => {
          if (event.code === 'ArrowUp') setkeyUp(false);
          if (event.code === 'ArrowDown') setkeyDown(false);
        }}
      />
      <button onClick={() => resetWindow(context)}>click</button>
      <button onClick={() => ws.socket.emit('lala')}>draw circle</button>
      <button onClick={() => ws.socket.emit('deleteQueue')}>
        delete queue
      </button>
    </div>
  );
};

export default Pong;
