import React, { useState, useEffect } from "react";
import classes from "./WatchGame.module.scss";
import { WebSocket } from "../../../Chat/Socket.module";

const ws = new WebSocket("http://localhost:3000/game");

function WatchGame(props: any) {
  const [listGame, setListGame] = useState<any>();

  useEffect(() => {
    ws.socket.on("listAllGame", (data) => {
      console.log(data);
      setListGame(data);
    });

    ws.socket.emit("listGame");
  }, []);

  return (
    <div className={classes.WatchGame}>
      {listGame.map((game:any)=>{
        
      })}
    </div>
  );
}

export default WatchGame;
