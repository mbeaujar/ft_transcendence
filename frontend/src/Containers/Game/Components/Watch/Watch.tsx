import { useState, useEffect, useRef } from 'react';
import classes from './Watch.module.scss';
import { IGame } from '../../../../interface/game.interface';
import { Socket } from 'socket.io-client';
import getSocket from '../../../Socket';
import useWindowSize from '../useWindow/useWindowSize';
import Avatar from '../../../Profile/components/Avatar/Avatar';
import { BrowserRouter as Router, Link } from 'react-router-dom';
import { IUser } from '../../../../interface/user.interface';

const PADDLEW = 10;
// const PADDLEH = 80;
let BACKGROUND = '#000000';
const PADDLE = '#ffffff';
const BALL = '#FFA500';

interface Props {
  width: number;
  height: number;
  user: IUser;
}

function WatchGame(props: Props) {
  const [listGame, setListGame] = useState<any[]>([]);
  const [score, setScore] = useState<Array<number>>([0, 0]);
  const [match, setMatch] = useState<IGame | null>(null);
  const [hideButton, setHideButton] = useState<boolean>(false);
  const [socket, setSocket] = useState<Socket | null>(null);
  const [refresh, setRefresh] = useState(0);
  const canvasRef = useRef(null);

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

  // const WindowSize = useWindowSize();

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

    if (socket) {
      socket.removeAllListeners();
      addListenerGame(socket, context);
    }
  }, [window.innerWidth, refresh]);

  // useEffect(() => {
  //   const canvas: any = canvasRef.current;
  //   const context = canvas.getContext('2d');

  //   const socketEffect = getSocket('game');
  //   addListenerGame(socketEffect, context);
  //   setSocket(socketEffect);

  //   return () => {
  //     if (socketEffect && socketEffect.connected === true) {
  //       socketEffect.disconnect();
  //     }
  //   };
  // }, [WindowSize]);

  function showCanva() {
    if (match) {
      if (score[0] === 3 || score[1] === 3) {
        setMatch(null);
        return classes.hideCanva;
      }
      return classes.canva;
    }
    return classes.hideCanva;
  }

  useEffect(() => {
    const socketEffect = getSocket('game');
    socketEffect.on('listAllGame', (data: any) => {
      setListGame(data.matchs);
    });

    socketEffect.on('newGame', (data: any) => {
      console.log('datanewgame==', data);
      setListGame([...listGame, data]);
    });

    socketEffect.on('removeGame', (data: any) => {
      const index = listGame.findIndex((element) => element.id === data.id);
      console.log('dataremovegame==', data);
      console.log('== ', listGame);
      listGame.splice(index, 1);
      // setListGame([...listGame]);
      console.log('=+ ', listGame);
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
        {listGame.length > 0 ? (
          listGame.map((game: any, index: number) =>
            game.players[0].user.username !== props.user.username &&
            game.players[1].user.username !== props.user.username ? (
              <div className={classes.Game} key={index}>
                <p className={classes.Username} style={{}}>
                  {game.players[0].user.username} vs{' '}
                  {game.players[1].user.username}
                </p>
                <button
                  onClick={() => {
                    socket?.emit('joinGame', game.id);
                    setMatch(game);

                    setHideButton(!hideButton);
                    setRefresh(refresh + 1);
                  }}
                  style={{ fontSize: props.width / 45 }}
                >
                  Watch
                </button>
              </div>
            ) : (
              <p className={classes.NoInvitation}>
                There are currently no users playing
              </p>
            ),
          )
        ) : (
          <p className={classes.NoInvitation}>
            There are currently no users playing
          </p>
        )}
      </div>
      <canvas
        className={showCanva()}
        style={{ backgroundColor: BACKGROUND }}
        width={props.width}
        height={props.height}
        ref={canvasRef}
        tabIndex={0}
      />
      <Link to="/game" className={classes.Back}>
        Back
      </Link>
      {match ? (
        <div className={classes.Score}>
          <div className={classes.PlayerLeft}>
            <Avatar user={match.players[0].user} />
            <p className={classes.Name} style={{ fontSize: props.width / 40 }}>
              {match.players[0].user.username}
            </p>
            <p style={{ fontSize: props.width / 20 }}>{score[0]}</p>
          </div>
          <span style={{ fontSize: props.width / 20 }}>-</span>
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
