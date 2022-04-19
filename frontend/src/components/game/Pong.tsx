import React, { useEffect, useRef, useState } from 'react';
import api from '../../apis/api';
import Input from '../chat/Input';
import { WebSocket } from '../chat/Socket';
import { IGame } from './interface/game.interface';

const WIDTH = 800;
const HEIGHT = 400;
const PADDLEW = 10;
const PADDLEH = 80;
const BACKGROUND = '#7f0000';
const PADDLE = '#ffffff';
const BALL = '#00007f';
const ws = new WebSocket('http://localhost:3000/game');

const Pong = (props: any) => {
  const canvasRef = useRef(null);
  const [context, setContext] = useState<any>(null);
  const [score, setScore] = useState<Array<number>>([0, 0]);
  const [id, setId] = useState<number>();
  const [listGame, setListGame] = useState<any>();
  const [mode, setMode] = useState<number>(0);

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
    ws.socket.on('startGame', (data: any) => {
      setId(data?.match?.id);
    });
    ws.socket.on('infoGame', (data: IGame) => {
      resetWindow(context);
      drawCircle(
        context,
        calculPercentage(data.ballx, WIDTH),
        calculPercentage(data.bally, HEIGHT),
        PADDLEW
      );

      drawPaddle(
        context,
        5,
        calculPercentage(data.player1, HEIGHT) -
          calculPercentage(data.paddleh1, HEIGHT) / 2, // 160
        PADDLEW,
        calculPercentage(data.paddleh1, HEIGHT)
      );
      drawPaddle(
        context,
        WIDTH - PADDLEW - 2,
        calculPercentage(data.player2, HEIGHT) -
          calculPercentage(data.paddleh2, HEIGHT) / 2,
        PADDLEW,
        calculPercentage(data.paddleh2, HEIGHT)
      );
    });
    ws.socket.on('scoreGame', (data: { score: Array<number> }) => {
      setScore(data.score);
    });
    ws.socket.on('listAllGame', data => {
      console.log(data);
    });

    const canvas: any = canvasRef.current;
    const context = canvas.getContext('2d');
    setContext(context);
  }, []);

  return (
    <div>
      <div>
        <button
          onClick={() => {
            ws.socket.emit('deleteConnected');
          }}
        >
          delete connected user
        </button>
        <button
          onClick={() => {
            ws.socket.emit('joinQueue', { mode, invite: 0, target: 0 });
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
        onKeyDown={event => {}}
        onKeyUp={event => {
          if (event.code === 'ArrowUp') ws.socket.emit('moveTopPaddle', { id });
          if (event.code === 'ArrowDown')
            ws.socket.emit('moveBotPaddle', { id });
        }}
      />
      <button onClick={() => ws.socket.emit('info', { id })}>
        print info backend
      </button>
      <button onClick={() => ws.socket.emit('leaveQueue')}>Leave queue</button>
      <button onClick={() => ws.socket.emit('listGame')}>get all game </button>
      <button
        onClick={() => ws.socket.emit('joinGame', { id: listGame[0].id })}
      >
        Spectate Game
      </button>
      <button
        onClick={() => {
          api
            .get(`/users/history/${props.user.id}`)
            .then(response => console.log(response.data))
            .catch(reject => console.error(reject));
        }}
      >
        Get history
      </button>
      <Input
        label="sensibilité"
        onSubmit={(text: string) => {
          api
            .post('/users/sensitivity', { sensitivity: parseInt(text) })
            .catch(reject => console.error(reject));
        }}
      />
      <br />
      <Input
        label="mode"
        onSubmit={(text: string) => {
          console.log('MODE', parseInt(text));
          setMode(parseInt(text));
        }}
      />
    </div>
  );
};

export default Pong;
