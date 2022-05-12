import React, { useState } from "react";
import Dropdown from "../Dropdown/Dropdown";
import classes from "./Room.module.scss";
import clsx from "clsx";
import { Socket } from "socket.io-client";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Pong from "../Pong/Pong";
import { Link } from "react-router-dom";

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

function Room(props: Props) {
  const [mode, setMode] = useState<number>(0);

  return (
    <div
      className={classes.Room}
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
        className={clsx(classes.ButtonJoinQueue)}
        style={{ fontSize: props.width / 40 }}
        // onClick={() => {
        //   props.socket?.emit("joinQueue", { mode, invite: 0, target: 0 });
        // }}
      >
        <Link
          className={clsx(classes.Link)}
          style={{ fontSize: props.width / 40 }}
          to="/test"
        >
          Start game
        </Link>
      </button>
    </div>
  );
}

export default Room;
