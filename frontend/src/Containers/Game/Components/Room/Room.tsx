import React, {  } from 'react';
import classes from './Room.module.scss';
import clsx from 'clsx';
//import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Link } from 'react-router-dom';

/*const itemsGameMode = [
  { id: 1, value: 'Classic mode' },
  { id: 2, value: 'Paddle reduce' },
  { id: 3, value: 'Paddle flashing' },
];

const itemsPaddleSensibility = [
  { id: 1, value: 'Very slow' },
  { id: 2, value: 'Slow' },
  { id: 3, value: 'Normal' },
  { id: 3, value: 'Fast' },
  { id: 3, value: 'Very fast' },
];

const itemsOpponent = [
  { id: 1, value: 'Random' },
  { id: 2, value: 'Ramzi' },
  { id: 3, value: 'Mael' },
];*/

interface Props {
  width: number;
  height: number;
}

function Room(props: Props) {
  //const [mode, setMode] = useState<number>(0);

  return (
    <div
      className={classes.Room}
      style={{
        width: props.width,
        height: props.height,
        fontSize: props.width / 20,
      }}
    >
      {/* <Dropdown
        title="Game Mode"
        items={itemsGameMode}
        multiselect={false}
        WIDTH={props.width}
        HEIGHT={props.height}
        id="{1}"
        hideButton={false}
      />
      <Dropdown
        title="Paddle speed"
        items={itemsPaddleSensibility}
        multiselect={false}
        WIDTH={props.width}
        HEIGHT={props.height}
        id="{2}"
        hideButton={false}
      />
      <Dropdown
        title="Opponent"
        items={itemsOpponent}
        multiselect={false}
        WIDTH={props.width}
        HEIGHT={props.height}
        id="{3}"
        hideButton={false}
      /> */}
      <button
        className={clsx(classes.ButtonJoinQueue)}
        style={{ fontSize: props.width / 40 }}
        // onClick={() => {
        //   props.socket?.emit("joinQueue", { mode, invite: 0, target: 0 });
        // }}
      >
        <Link
          className={clsx(classes.Link)}
          style={{ fontSize: props.width / 40 }}
          to="/game/play/room/pong"
        >
          Start game
        </Link>
      </button>
    </div>
  );
}

export default Room;
