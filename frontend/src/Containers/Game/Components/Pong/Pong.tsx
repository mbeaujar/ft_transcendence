import { useEffect, useRef, useState } from "react";
import { IGame } from "../../../../interface/game.interface";
import classes from "./Pong.module.scss";
// import useWindowSize from "../useWindow/useWindowSize";
import clsx from "clsx";
import Dropdown from "../Dropdown/Dropdown";
import { Socket } from "socket.io-client";
import getSocket from "../../../Socket";

// let WIDTH = 800;
// let HEIGHT = 400;

const PADDLEW = 10;
// const PADDLEH = 80;
const BACKGROUND = "#000000";
const PADDLE = "#ffffff";
const BALL = "#00007f";

const itemsGameMode = [
  { id: 1, value: "Classic mode" },
  { id: 2, value: "Paddle reduce" },
  { id: 3, value: "Paddle flashing" },
];

const itemsPaddleSensibility = [
  { id: 1, value: "Very slow" },
  { id: 2, value: "Slow" },
  { id: 3, value: "Normal" },
  { id: 3, value: "Fast" },
  { id: 3, value: "Very fast" },
];

const itemsOpponent = [
  { id: 1, value: "Random" },
  { id: 2, value: "Ramzi" },
  { id: 3, value: "Mael" },
];

interface Props {
  width: number;
  height: number;
}

const Pong = (props: Props) => {
  const canvasRef = useRef(null);
  // const [context, setContext] = useState<any>(null);
  const [score, setScore] = useState<Array<number>>([0, 0]);
  const [id, setId] = useState<number>();
  const [listGame, setListGame] = useState<any>();
  const [mode, setMode] = useState<number>(0);
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

  useEffect(() => {
    const socketEffect = getSocket("game");
    console.log("socket", socketEffect);
    const canvas: any = canvasRef ? canvasRef.current : null;
    const context = canvas ? canvas.getContext("2d") : null;
    // setContext(context);
    socketEffect.on("startGame", (data: any) => {
      setId(data?.match?.id);
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
    socketEffect.on("listAllGame", (data: any) => {
      console.log(data);
      setListGame(data);
    });
    setSocket(socketEffect);
    return () => {
      if (socketEffect && socketEffect.connected === true) {
        socketEffect.disconnect();
      }
    };
  }, []);

  function showButton() {
    if (hideButton === false) return classes.ShowButton;
    return classes.HideButton;
  }

  if (!socket) {
    return <div>Socket not connected</div>;
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
      <div className={classes.Score}>
        <span style={{ fontSize: props.width / 21 }}>{score[0]}</span> |{" "}
        <span style={{ fontSize: props.width / 21 }}>{score[1]}</span>
      </div>
      <Dropdown
        title="Game Mode"
        items={itemsGameMode}
        multiselect={false}
        WIDTH={props.width}
        HEIGHT={props.height}
        id={1}
      />
      <Dropdown
        title="Paddle speed"
        items={itemsPaddleSensibility}
        multiselect={false}
        WIDTH={props.width}
        HEIGHT={props.height}
        id={2}
      />
      <Dropdown
        title="Opponent"
        items={itemsOpponent}
        multiselect={false}
        WIDTH={props.width}
        HEIGHT={props.height}
        id={3}
      />
      <button
        className={clsx(classes.ButtonJoinQueue, showButton())}
        style={{ fontSize: props.width / 40 }}
        onClick={() => {
          socket.emit("joinQueue", { mode, invite: 0, target: 0 });
          setHideButton(!hideButton);
        }}
      >
        Start Game
      </button>
      <canvas
        className={classes.canva}
        style={{ backgroundColor: BACKGROUND }}
        width={props.width}
        height={props.height}
        ref={canvasRef}
        tabIndex={0}
        // onKeyDown={(event) => {}}
        onKeyUp={(event) => {
          if (event.code === "ArrowUp") socket.emit("moveTopPaddle", { id });
          if (event.code === "ArrowDown") socket.emit("moveBotPaddle", { id });
        }}
      />
    </div>
  );
};

export default Pong;
