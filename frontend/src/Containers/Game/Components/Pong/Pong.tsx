import { useEffect, useRef, useState } from "react";
import { IGame } from "../../../../interface/game.interface";
import classes from "./Pong.module.scss";
import clsx from "clsx";
import Dropdown from "../Dropdown/Dropdown";
import { Socket } from "socket.io-client";
import getSocket from "../../../Socket";
import Avatar from "../../../Profile/components/Avatar/Avatar";
import { IUser } from "../../../../interface/user.interface";
import api from "../../../../apis/api";
import useWindowSize from "../useWindow/useWindowSize";
import ReactLoading from "react-loading";

const PADDLEW = 10;
// const PADDLEH = 80;
const BACKGROUND = "#000000";
const PADDLE = "#ffffff";
const BALL = "#00007f";

const itemsGameMode = [
  { id: 0, value: "Classic mode" },
  { id: 1, value: "Paddle reduce" },
  { id: 2, value: "Paddle flashing" },
];

const itemsPaddleSensibility = [
  { id: 0, value: "Very slow" },
  { id: 1, value: "Slow" },
  { id: 2, value: "Normal" },
  { id: 3, value: "Fast" },
  { id: 4, value: "Very fast" },
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
    { id: 0, value: "Random", userId: 0 },
  ]);
  const [mode, setMode] = useState<number>(0);
  const [paddleSpeed, setPaddleSpeed] = useState(3);
  const [opponent, setOpponent] = useState(0);
  const [matchEnd, setMatchEnd] = useState(false);

  useEffect(() => {
    api
      .post("/users/sensitivity", { sensitivity: paddleSpeed })
      .catch((reject) => console.error(reject));
  }, [paddleSpeed]);

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
    socketEffect.on("startGame", (data: any) => {
      setId(data?.match?.id);
      setMatch(data?.match);
    });
    socketEffect.on("infoGame", (data: IGame) => {
      resetWindow(context);
      drawCircle(
        context,
        calculPercentage(data.ballx, props.width),
        calculPercentage(data.bally, props.height),
        PADDLEW
      );
      if (data.player1 !== undefined && data.paddleh1 !== undefined) {
        drawPaddle(
          context,
          5,
          calculPercentage(data.player1, props.height) -
            calculPercentage(data.paddleh1, props.height) / 2, // 160
          PADDLEW,
          calculPercentage(data.paddleh1, props.height)
        );
      }
      if (data.player2 !== undefined && data.paddleh2 !== undefined) {
        drawPaddle(
          context,
          props.width - PADDLEW - 2,
          calculPercentage(data.player2, props.height) -
            calculPercentage(data.paddleh2, props.height) / 2,
          PADDLEW,
          calculPercentage(data.paddleh2, props.height)
        );
      }
    });
    socketEffect.on("scoreGame", (data: { score: Array<number> }) => {
      setScore(data.score);
    });
  };

  const WindowSize = useWindowSize();

  useEffect(() => {
    api
      .get("/friends/list")
      .then((response) => {
        response.data.friends.map((friend: IUser, index: number) => {
          setItemsOpponent([
            ...itemsOpponent,
            { id: index + 1, value: friend.username, userId: friend.id },
          ]);
        });
      })
      .catch((reject) => console.error(reject));

    const canvas: any = canvasRef.current;
    const context = canvas.getContext("2d");

    const socketEffect = getSocket("game");
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
    const context = canvas.getContext("2d");

    const socketEffect = getSocket("game");
    addListenerGame(socketEffect, context);
    setSocket(socketEffect);
  }, [WindowSize]);

  function showButton() {
    if (hideButton === false) return classes.ShowButton;
    return classes.HideButton;
  }

  function showCanva() {
    if (hideButton === true) return classes.canva;
    return classes.hideCanva;
  }

  function showLoading() {
    if (hideButton === true && !match) return classes.Loading;
    return classes.HideLoading;
  }

  function ifInvite() {
    if (opponent === 0) {
      console.log("invite=", 0);
      return 0;
    }
    console.log("invite=", 1);
    return 1;
  }

  function ifTarget() {
    if (opponent === 0) {
      console.log("target=", 0);
      return 0;
    }
    console.log("target=", itemsOpponent[opponent].userId);
    return itemsOpponent[opponent].userId;
  }

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
      />
      <button
        className={clsx(classes.ButtonJoinQueue, showButton())}
        style={{ fontSize: props.width / 40 }}
        onClick={() => {
          socket?.emit("joinQueue", {
            mode,
            invite: ifInvite(),
            target: ifTarget(),
          });
          setHideButton(!hideButton);
        }}
      >
        Start Game
      </button>
      <div className={showLoading()}>
        <ReactLoading type="spinningBubbles" color="#fff" width={'100%'} height={'100%'}/>
      </div>
      <canvas
        className={showCanva()}
        style={{ backgroundColor: BACKGROUND }}
        width={props.width}
        height={props.height}
        ref={canvasRef}
        tabIndex={0}
        onKeyUp={(event) => {
          if (event.code === "ArrowUp") socket?.emit("moveTopPaddle", { id });
          if (event.code === "ArrowDown") socket?.emit("moveBotPaddle", { id });
        }}
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

      {/* <div className={classes.Score}>
        <div className={classes.PlayerLeft}>
          <Avatar user={props.user} />
          <p className={classes.Name} style={{ fontSize: props.width / 40 }}>asalam</p>
          <p style={{ fontSize: props.width / 20 }}>3</p>
        </div>
        <span>-</span>
        <div className={classes.PlayerRight}>
          <p style={{ fontSize: props.width / 20 }}>0</p>
          <p className={classes.Name} style={{ fontSize: props.width / 40 }}>ranaili</p>
          <Avatar user={props.user} />
        </div>
      </div> */}
    </div>
  );
};

export default Pong;
