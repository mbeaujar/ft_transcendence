import React, { useState, useEffect } from "react";
import classes from "./WatchGame.module.scss";
import { WebSocket } from "../../../Chat/Socket.module";
import { IGame } from "../../../../interface/game.interface";

const ws = new WebSocket("http://localhost:3000/game");

function WatchGame(props: any) {
  const [listGame, setListGame] = useState<[IGame|null]>([null]);

  useEffect(() => {
    ws.socket.on("listAllGame", (data) => {
      console.log(data);
      setListGame(data);
    });

    ws.socket.emit("listGame");
  }, []);

  useEffect(() => {
    console.log("list===",listGame)
  }, [listGame]);

  return (
    <div className={classes.WatchGame}>
      {/*listGame && listGame.map((game:IGame)=>{

      })*/}
    </div>
  );
}

export default WatchGame;
