import { useRef } from 'react';
import { useEffect, useState } from 'react';
// import api from "../../apis/api";
import clsx from 'clsx';
import classes from './Game.module.scss';
// import styles from "./Game.module.scss";
import Pong from './Components/Pong/Pong';
import useWindowSize from './Components/useWindow/useWindowSize';
import { BrowserRouter as Router, Link } from 'react-router-dom';

interface Props {
  width: number;
  height: number;
}

function Game(props: Props) {
  // useEffect(() => {}, []);

  return (
    <div
      className={clsx(classes.Game)}
      style={{ width: props.width, height: props.height }}
    >
      <div className={clsx(classes.playOrWatch, classes.showGameVue)}>
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
    </div>
  );
}

export default Game;
