import React from 'react';
import classes from './Play.module.scss';
import clsx from 'clsx';

interface Props 
{
  width:number;
  height:number;
}

function Play(props:Props)
{
return (
  <div className={classes.Play} style={{ width: props.width, height: props.height }}>
          <div
        className={clsx(
          classes.chooseGameType,
          classes.showGameVue
        )}
      >
        <button
          className={clsx(
            classes.configButton,
            classes.butttonGame,
            classes.configButtonTop
          )}
          style={{ fontSize: props.width / 40 }}
        >
          Room
        </button>
        <button
          className={clsx(
            classes.configButton,
            classes.butttonGame,
            classes.configButtonBottom
          )}
          style={{ fontSize: props.width / 40 }}
        >
          Current game invites
        </button>
      </div>
  </div>
);
}

export default Play;