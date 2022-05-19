import { useState, useEffect, useRef } from 'react';
import classes from './Watch.module.scss';
import { IGame } from '../../../../interface/game.interface';
import { Socket } from 'socket.io-client';
import getSocket from '../../../Socket';
import useWindowSize from '../useWindow/useWindowSize';
import Avatar from '../../../Profile/components/Avatar/Avatar';

const PADDLEW = 10;
// const PADDLEH = 80;
const BACKGROUND = '#000000';
const PADDLE = '#ffffff';
const BALL = '#00007f';

interface Props {
  width: number;
  height: number;
}

function WatchGame(props: Props) {
  const [listGame, setListGame] = useState<any[]>([]);
  const canvasRef = useRef(null);
  const [score, setScore] = useState<Array<number>>([0, 0]);
  const [id, setId] = useState<number>();
  const [match, setMatch] = useState<IGame>();
  const [hideButton, setHideButton] = useState<boolean>(false);
  const [socket, setSocket] = useState<Socket | null>(null);

  const resetWindow = (context: any) => {
    context.clearRect(0, 0, props.width, props.height);
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

  const addListenerGame = (socketEffect: Socket, context: any) => {
    socketEffect.on('startGame', (data: any) => {
      setId(data?.match?.id);
      setMatch(data?.match);
    });
    socketEffect.on('infoGame', (data: IGame) => {
      resetWindow(context);
      drawCircle(
        context,
        calculPercentage(data.ballx, props.width),
        calculPercentage(data.bally, props.height),
        PADDLEW,
      );
      if (data.player1 !== undefined && data.paddleh1 !== undefined) {
        drawPaddle(
          context,
          5,
          calculPercentage(data.player1, props.height) -
            calculPercentage(data.paddleh1, props.height) / 2, // 160
          PADDLEW,
          calculPercentage(data.paddleh1, props.height),
        );
      }
      if (data.player2 !== undefined && data.paddleh2 !== undefined) {
        drawPaddle(
          context,
          props.width - PADDLEW - 2,
          calculPercentage(data.player2, props.height) -
            calculPercentage(data.paddleh2, props.height) / 2,
          PADDLEW,
          calculPercentage(data.paddleh2, props.height),
        );
      }
    });
    socketEffect.on('scoreGame', (data: { score: Array<number> }) => {
      setScore(data.score);
    });
  };

  const WindowSize = useWindowSize();

  useEffect(() => {
    const canvas: any = canvasRef.current;
    const context = canvas.getContext('2d');

    const socketEffect = getSocket('game');
    addListenerGame(socketEffect, context);
    setSocket(socketEffect);

    return () => {
      if (socketEffect && socketEffect.connected === true) {
        socketEffect.disconnect();
      }
    };
  }, []);

  useEffect(() => {
    const canvas: any = canvasRef.current;
    const context = canvas.getContext('2d');

    const socketEffect = getSocket('game');
    addListenerGame(socketEffect, context);
    setSocket(socketEffect);

    return () => {
      if (socketEffect && socketEffect.connected === true) {
        socketEffect.disconnect();
      }
    };
  }, [WindowSize]);

  function showCanva() {
    if (hideButton === true) return classes.canva;
    return classes.hideCanva;
  }

  useEffect(() => {
    const socketEffect = getSocket('game');
    socketEffect.on('listAllGame', (data: any) => {
      setListGame(data.matchs);
    });

    // emit -> problem
    socketEffect.emit('listGame');
    setSocket(socketEffect);
    return () => {
      if (socketEffect && socketEffect.connected === true) {
        socketEffect.disconnect();
      }
    };
  }, []);

  useEffect(() => {
    console.log('list=', listGame);
  }, [listGame]);

  return (
    <div
      className={classes.Watch}
      style={{
        width: props.width,
        height: props.height,
        fontSize: props.width / 50,
      }}
    >
      <div className={classes.ListGame}>
        {listGame &&
          listGame.map((game: any, index: number) => (
            <div className={classes.Game} key={index}>
              <p className={classes.Username} style={{}}>
                {game.players[0].user.username} vs{' '}
                {game.players[1].user.username}
              </p>
              <button
                onClick={() => {
                  const gameID = game.id;
                  socket?.emit('joinGame', gameID);
                  setHideButton(!hideButton);
                }}
                style={{ fontSize: props.width / 45 }}
              >
                Watch
              </button>
            </div>
          ))}
      </div>
      <canvas
        className={showCanva()}
        style={{ backgroundColor: BACKGROUND }}
        width={props.width}
        height={props.height}
        ref={canvasRef}
        tabIndex={0}
        // onKeyUp={(event) => {
        //   if (event.code === 'ArrowUp') socket?.emit('moveTopPaddle', { id });
        //   if (event.code === 'ArrowDown') socket?.emit('moveBotPaddle', { id });
        // }}
      />
      {match ? (
        <div className={classes.Score}>
          <div className={classes.PlayerLeft}>
            <Avatar user={match.players[0].user} />
            <p className={classes.Name} style={{ fontSize: props.width / 40 }}>
              {match.players[0].user.username}
            </p>
            <p style={{ fontSize: props.width / 20 }}>{score[0]}</p>
          </div>
          <span>-</span>
          <div className={classes.PlayerRight}>
            <p style={{ fontSize: props.width / 20 }}>{score[1]}</p>
            <p className={classes.Name} style={{ fontSize: props.width / 40 }}>
              {match.players[1].user.username}
            </p>
            <Avatar user={match.players[1].user} />
          </div>
        </div>
      ) : null}
    </div>
  );
}

export default WatchGame;
