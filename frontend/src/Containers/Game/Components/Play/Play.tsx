import React from 'react';
import classes from './Play.module.scss';
import clsx from 'clsx';
import { BrowserRouter as Router, Link } from 'react-router-dom';

interface Props {
  width: number;
  height: number;
}

function Play(props: Props) {
  let object = { name: 'ali', surname: 'salam' };
  return (
    <div
      className={clsx(classes.Play)}
      style={{ width: props.width, height: props.height }}
    >
      <div className={clsx(classes.playOrWatch, classes.showGameVue)}>
        <Link
          className={clsx(classes.Link, classes.LinkTop)}
          style={{ fontSize: props.width / 40 }}
          to="/game/play/room/pong"
          state={{
            from: { opponent: '',mode:-1 },
          }}
        >
          Room
        </Link>
        <Link
          className={clsx(classes.Link, classes.LinkBottom)}
          style={{ fontSize: props.width / 40 }}
          to="/game/play/invite"
        >
          Current game invite
        </Link>
      </div>
    </div>
  );
}

export default Play;
