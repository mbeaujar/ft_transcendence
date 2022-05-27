import { useEffect, useRef, useState } from 'react';
import { IGame } from '../../../../interface/game.interface';
import classes from './Pong.module.scss';
import clsx from 'clsx';
import Dropdown from '../Dropdown/Dropdown';
import { Socket } from 'socket.io-client';
import getSocket from '../../../Socket';
import Avatar from '../../../Profile/components/Avatar/Avatar';
import { IUser } from '../../../../interface/user.interface';
import api from '../../../../apis/api';
import useWindowSize from '../useWindow/useWindowSize';
import ReactLoading from 'react-loading';
import { useParams } from 'react-router';
import { useLocation } from 'react-router';
import { Link } from 'react-router-dom';

let PADDLEW = 10;
// const PADDLEH = 80;
const BACKGROUND = '#000000';
const PADDLE = '#ffffff';
let BALL = '#00007f';
BALL = '#00ff00';

const itemsGameMode = [
  { id: 0, value: 'Classic mode' },
  { id: 1, value: 'Paddle reduce' },
  { id: 2, value: 'Paddle flashing' },
];

const itemsPaddleSensibility = [
  { id: 1, value: 'Very slow' },
  { id: 2, value: 'Slow' },
  { id: 3, value: 'Normal' },
  { id: 4, value: 'Fast' },
  { id: 5, value: 'Very fast' },
];

interface Props {
  width: number;
  height: number;
  user: IUser;
}

const Pong = (props: Props) => {
  const canvasRef = useRef(null);
  const [score, setScore] = useState<Array<number>>([0, 0]);
  const [id, setId] = useState<number>();
  const [match, setMatch] = useState<IGame>();
  const [hideButton, setHideButton] = useState<boolean>(false);
  const [socket, setSocket] = useState<Socket | null>(null);
  const [itemsOpponent, setItemsOpponent] = useState([
    { id: 0, value: 'Random', userId: 0 },
  ]);
  const [mode, setMode] = useState<number>(0);
  const [paddleSpeed, setPaddleSpeed] = useState(props.user.sensitivity);
  const [opponent, setOpponent] = useState(0);
  const [matchEnd, setMatchEnd] = useState(true);
  const [blockDropdownMode, setBlockDropdownMode] = useState(0);
  const [blockDropdownOpponent, setBlockDropdownOpponent] = useState(0);
  const [indexMode, setIndexMode] = useState(0);
  const [indexOpponent, setIndexOpponent] = useState(0);
  const WindowSize = useWindowSize();
  let from: any = null;
  let location = useLocation();
  if (location) from = location.state;
  const stateGame = useRef<any>({
    player1Top: Boolean(false),
    player1Bottom: Boolean(false),
  });

  useEffect(() => {
    api
      .post('/users/sensitivity', { sensitivity: paddleSpeed })
      .catch((reject) => console.error(reject));
  }, [paddleSpeed]);

  useEffect(() => {
    api
      .get('/friends/list')
      .then((response) => {
        response.data.friends.map((friend: IUser, index: number) => {
          setItemsOpponent([
            ...itemsOpponent,
            { id: index + 1, value: friend.username, userId: friend.id },
          ]);
          if (from.from.opponent === friend.username) {
            setOpponent(index + 1);
          }
        });
      })
      .catch((reject) => console.error(reject));

    if (from.from.opponent !== '') setBlockDropdownOpponent(1);
    if (from.from.mode !== -1) {
      setBlockDropdownMode(1);
      setIndexMode(from.from.mode);
    }

    const canvas: any = canvasRef.current;
    const context = canvas.getContext('2d');

    const socketEffect = getSocket('game');
    addListenerGame(socketEffect, context);
    setSocket(socketEffect);

    return () => {
      if (socketEffect && socketEffect.connected === true) {
        socketEffect?.emit('leaveGame', { id });
        socketEffect.disconnect();
      }
    };
  }, []);

  // useEffect(() => {
  //   // const canvas: any = canvasRef.current;
  //   // const context = canvas.getContext('2d');

  //   // const socketEffect = getSocket('game');
  //   // addListenerGame(socketEffect, context);
  //   // setSocket(socketEffect);

  //   // return () => {
  //   //   if (socketEffect && socketEffect.connected === true) {
  //   //     socketEffect.disconnect();
  //   //   }
  //   // };
  // }, [WindowSize]);

  const resetWindow = (context: any) => {
    context.clearRect(0, 0, props.width, props.height);
  };

  const drawCircle = (context: any, x: number, y: number, r: number) => {
    context.fillStyle = BALL;
    context.beginPath();
    context.arc(x, y, r, 0, Math.PI * 2, true);
    context.closePath();
    context.fill();
  };

  const drawPaddle = (
    context: any,
    x: number,
    y: number,
    w: number,
    h: number,
  ) => {
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
    PADDLEW = props.width / 80;
    socketEffect.on('startGame', (data: any) => {
      setId(data?.match?.id);
      setMatch(data?.match);
     //console.log("match=",match," id=",id);
    });
    socketEffect.on('infoGame', (data: IGame) => {
      //console.log("data=",data);
      setId(data.id);
     // console.log("id===",data.id,"  match=",match);
      if (data.id && !match)
      {
      //  console.log("callemit")
        // socketEffect.emit('getGame',id);
      }
      setMatchEnd(false);
      setHideButton(true);
      resetWindow(context);
      drawCircle(
        context,
        calculPercentage(data.ballx, props.width),
        calculPercentage(data.bally, props.height),
        PADDLEW,
      );
      // if (stateGame.current.player1Top === true) {
      //   console.log('t');
      //   console.log("socket=",socket);
      //   socketEffect?.emit('moveTopPaddle', { id });
      // }
      // if (stateGame.current.player1Bottom === true) {
      //   console.log('b');
      //   socketEffect?.emit('moveBotPaddle', { id });
      // }
      if (data.player1 !== undefined && data.paddleh1 !== undefined) {
        drawPaddle(
          context,
          0,
          calculPercentage(data.player1, props.height) -
            calculPercentage(data.paddleh1, props.height) / 2, // 160
          PADDLEW,
          calculPercentage(data.paddleh1, props.height),
        );
      }
      if (data.player2 !== undefined && data.paddleh2 !== undefined) {
        drawPaddle(
          context,
          props.width - PADDLEW,
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

  function showButton() {
    if (hideButton === false) return classes.ShowButton;
    return classes.HideButton;
    // if (matchEnd === true) return classes.ShowButton;
    // return classes.HideButton;
  }

  function showCanva() {
    if (hideButton === true) {
      if (score[0] === 3 || score[1] === 3) {
        // setMatchEnd(true);
        return classes.hideCanva;
      }

      return classes.canva;
    }
    return classes.hideCanva;
    // if (matchEnd === false) {
    //   if (score[0] === 3 || score[1] === 3) {
    //      setMatchEnd(true);
    //     return classes.hideCanva;
    //   }
    //   return classes.canva;
    // }
    // return classes.hideCanva;
  }

  function showMatchEnd() {
    if (hideButton === true) {
      if (score[0] === 3 || score[1] === 3) return classes.MatchEnd;
    }
    return classes.HideMatchEnd;
  }

  function showGiveUp() {
    if (hideButton === true && match) {
      if (score[0] === 3 || score[1] === 3) return classes.HideGiveUp;
      return classes.GiveUp;
    }
    return classes.HideGiveUp;
  }

  function showLoading() {
    // if (hideButton === true && !match) return classes.Loading;
    // return classes.HideLoading;
    if (hideButton === true && matchEnd===true) return classes.Loading;
    return classes.HideLoading;
  }

  function showLoadingText() {
    // if (hideButton === true && !match) return classes.LoadingText;
    // return classes.HideLoadingText;
    if (hideButton === true && matchEnd===true) return classes.LoadingText;
    return classes.HideLoadingText;
  }

  function showBack() {
    if (hideButton === false) return classes.Back;
    return classes.HideBack;
  }

  function showCancel() {
    // if (hideButton === true && !match) return classes.Cancel;
    // return classes.HideCancel;
    if (hideButton === true && matchEnd===true) return classes.Cancel;
    return classes.HideCancel;
  }

  function ifInvite() {
    if (opponent === 0) {
      console.log('invite=', 0);
      return 0;
    }
    console.log('invite=', 1);
    return 1;
  }

  function ifTarget() {
    if (opponent === 0) {
      console.log('target=', 0);
      return 0;
    }
    console.log('target=', itemsOpponent[opponent].userId);
    return itemsOpponent[opponent].userId;
  }

  const keyDownHandler = (event: React.KeyboardEvent<Element>) => {
    if (event.code === 'ArrowLeft') {
      stateGame.current.player1Top = true;
      socket?.emit('moveTopPaddle', { id });
      console.log('Top');
    }

    if (event.code === 'ArrowRight') {
      stateGame.current.player1Bottom = true;
      socket?.emit('moveBotPaddle', { id });
      console.log('Bottom');
    }

    
  };

  const keyUpHandler = (event: React.KeyboardEvent<Element>) => {
    if (event.code === 'ArrowLeft') {
      stateGame.current.player1Top = false;
    }

    if (event.code === 'ArrowRight') {
      stateGame.current.player1Bottom = false;
    }
  };

  return (
    <div
      className={classes.Pong}
      style={{
        width: props.width,
        height: props.height,
        fontSize: props.width / 20,
      }}
    >
      <Dropdown
        title="Game Mode"
        items={itemsGameMode}
        multiselect={false}
        WIDTH={props.width}
        HEIGHT={props.height}
        id="GameMode"
        hideButton={hideButton}
        setState={setMode}
        index={indexMode}
        blockDropdown={blockDropdownMode}
        paramRouteMode={from.from.mode}
        paramRouteOpponent={from.from.opponent}
      />
      <Dropdown
        title="Paddle speed"
        items={itemsPaddleSensibility}
        multiselect={false}
        WIDTH={props.width}
        HEIGHT={props.height}
        id="PaddleSpeed"
        hideButton={hideButton}
        setState={setPaddleSpeed}
        index={paddleSpeed - 1}
        blockDropdown={0}
        paramRouteOpponent={from.from.opponent}
      />
      <Dropdown
        title="Opponent"
        items={itemsOpponent}
        multiselect={false}
        WIDTH={props.width}
        HEIGHT={props.height}
        id="Opponent"
        hideButton={hideButton}
        setState={setOpponent}
        index={indexOpponent}
        blockDropdown={blockDropdownOpponent}
        paramRouteOpponent={from.from.opponent}
      />
      <button
        className={clsx(classes.ButtonJoinQueue, showButton())}
        style={{ fontSize: props.width / 40 }}
        onClick={() => {
          const invite = ifInvite();
          const target = ifTarget();
          if (invite) {
            api
              .post('/game/invite', { target, mode })
              .then(({ data }) => console.log('invite send', data))
              .catch((rej) => console.error(rej.response.data.message));
          }
          socket?.emit('joinQueue', {
            mode,
            invite,
            target,
          });
          setHideButton(!hideButton);
        }}
      >
        Start Game
      </button>
      <div className={showLoading()}>
        <ReactLoading
          type="spinningBubbles"
          color="#fff"
          width={'100%'}
          height={'100%'}
        />
      </div>
      <p className={showLoadingText()} style={{ fontSize: props.width / 40 }}>
        Waiting for your opponent
      </p>
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
        onKeyDown={(event) => keyDownHandler(event)}
        onKeyUp={(event) => keyUpHandler(event)}
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
      <div className={showMatchEnd()} style={{ fontSize: props.width / 30 }}>
        <Link className={classes.LinkEnd} to="/game/play">
          Start a new game
        </Link>
      </div>
      <Link
        to="/game/play"
        className={showBack()}
        style={{ fontSize: props.width / 45 }}
      >
        Back
      </Link>
      <button
        className={showCancel()}
        style={{ fontSize: props.width / 45 }}
        onClick={() => {
          socket?.emit('leaveQueue');
          setHideButton(!hideButton);
        }}
      >
        Cancel
      </button>
      <button
        className={showGiveUp()}
        style={{ fontSize: props.width / 45 }}
        onClick={() => {
          socket?.emit('leaveGame', { id });
        }}
      >
        Give Up
      </button>
    </div>
  );
};

export default Pong;
