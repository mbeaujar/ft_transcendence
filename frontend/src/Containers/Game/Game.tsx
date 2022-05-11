import { useRef } from "react";
import { useEffect, useState } from "react";
// import api from "../../apis/api";
import clsx from "clsx";
import classes from "./Game.module.scss";
// import styles from "./Game.module.scss";
import Pong from "./Components/Pong/Pong";
import useWindowSize from "./Components/useWindow/useWindowSize";
import { BrowserRouter as Router, Link } from "react-router-dom";


interface Props 
{
  width:number;
  height:number;
}

function Game(props:Props) {
  const [activeGameVue, setActiveGameVue] =
    useState<string>("choosePlayOrWatch");

  const WindowSize = useWindowSize();
  useEffect(() => {

  }, []);



  return (
    <div
      className={clsx(classes.Game)}
      style={{ width: props.width, height: props.height }}
    >
      <div
        className={clsx(
          classes.playOrWatch,
          classes.showGameVue
        )}
      >
        <Link
          className={clsx(classes.Link, classes.LinkTop)}
          style={{ fontSize: props.width / 40 }}
          to="/game/play"
        >
          Play game
        </Link>
        <Link
          className={clsx(classes.Link, classes.LinkBottom)}
          style={{ fontSize: props.width / 40 }}
          to="/game/watch"
        >
          Watch other users play
        </Link>
      </div>

      {/* <div
        className={clsx(
          classes.chooseGameType,
          ftShowGameVue("chooseGameType")
        )}
      >
        <button
          className={clsx(
            classes.configButton,
            classes.butttonGame,
            classes.configButtonTop
          )}
          onClick={() => setActiveGameVue("pong")}
          style={{ fontSize: WIDTH / 40 }}
        >
          Room
        </button>
        <button
          className={clsx(
            classes.configButton,
            classes.butttonGame,
            classes.configButtonBottom
          )}
          style={{ fontSize: WIDTH / 40 }}
        >
          Current game invites
        </button>
      </div>
      <div className={clsx(classes.WatchGame, ftShowGameVue("watchGame"))}>
         <WatchGame /> 
      </div>

      <div className={clsx(classes.pong, ftShowGameVue("pong"))}>
        <Pong width={WIDTH} height={HEIGHT} />
      </div> */}
    </div>
  );
}

export default Game;
