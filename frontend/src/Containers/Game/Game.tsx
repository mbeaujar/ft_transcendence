import React, { useRef } from "react";
import { useEffect, useState } from "react";
import api from "../../apis/api";
import clsx from "clsx";
import classes from "./Game.module.scss";
import styles from "./Game.module.scss";
import Pong from "./Components/Pong/Pong";
import useWindowSize from "./Components/useWindow/useWindowSize";
import WatchGame from "./Components/WatchGame/WatchGame";

let WIDTH = 800;
let HEIGHT = 400;

function Game() {
  const [activeGameVue, setActiveGameVue] =
    useState<string>("choosePlayOrWatch");

  const WindowSize = useWindowSize();

  useEffect(() => {
    if (WindowSize.innerWidth < 160.01) {
      WIDTH = 100;
      HEIGHT = 50;
    } else if (WindowSize.innerWidth < 215.01) {
      WIDTH = 150;
      HEIGHT = 75;
    } else if (WindowSize.innerWidth < 330.01) {
      WIDTH = 200;
      HEIGHT = 100;
    } else if (WindowSize.innerWidth < 430.01) {
      WIDTH = 300;
      HEIGHT = 150;
    } else if (WindowSize.innerWidth < 650.01) {
      WIDTH = 400;
      HEIGHT = 200;
    } else if (WindowSize.innerWidth < 840.01) {
      WIDTH = 600;
      HEIGHT = 300;
    } else {
      WIDTH = 800;
      HEIGHT = 400;
    }
  }, [WindowSize]);

  const ftShowGameVue: any = (divName: string) => {
    if (divName === activeGameVue) return classes.showGameVue;
    else return classes.hideGameVue;
  };

  return (
    <div
      className={clsx(classes.Game)}
      style={{ width: WIDTH, height: HEIGHT }}
    >
      <div
        className={clsx(
          classes.playOrWatch,
          ftShowGameVue("choosePlayOrWatch")
        )}
      >
        <button
          className={clsx(
            classes.configButton,
            classes.butttonGame,
            classes.configButtonTop
          )}
          onClick={() => setActiveGameVue("chooseGameType")}
          style={{ fontSize: WIDTH / 40 }}
        >
          Play a game
        </button>
        <button
          className={clsx(
            classes.configButton,
            classes.butttonGame,
            classes.configButtonBottom
          )}
          onClick={() => setActiveGameVue("watchGame")}
          style={{ fontSize: WIDTH / 40 }}
        >
          Watch other users play
        </button>
      </div>

      <div
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
        <Pong />
      </div>
    </div>
  );
}

export default Game;
