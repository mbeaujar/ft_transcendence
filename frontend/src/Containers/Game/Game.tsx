/* eslint-disable @typescript-eslint/no-unused-vars */
import { useEffect, useState } from 'react';
// import api from "../../apis/api";
import clsx from 'clsx';
import classes from './Game.module.scss';
// import styles from "./Game.module.scss";
import { BrowserRouter as Router, Link } from 'react-router-dom';
import api from '../../apis/api';
import { IUser } from '../../interface/user.interface';

interface Props {
  width: number;
  height: number;
}

function Game(props: Props) {
  const [user, setUser] = useState<IUser | null>(null);

  useEffect(() => {
    const controller = new AbortController();

    api
      .get('/auth/status', {
        signal: controller.signal,
      })
      .then((response) => setUser(response.data))
      .catch((reject) => console.error(reject));

    return () => {
      controller.abort();
    };
  }, []);

  return (
    <>
      {user ? (
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
      ) : null}
    </>
  );
}

export default Game;
