import { useState, useEffect } from "react";
import classes from "./WatchGame.module.scss";
import { IGame } from "../../../../interface/game.interface";
import { Socket } from "socket.io-client";
import getSocket from "../../../Socket";

// interface Props {}

function WatchGame(/*props: Props*/) {
  const [listGame, setListGame] = useState<[IGame | null]>([null]);
  const [socket, setSocket] = useState<Socket | null>(null);

  useEffect(() => {
    const socketEffect = getSocket("game");
    socketEffect.on("listAllGame", (data: any) => {
      console.log(data);
      setListGame(data);
    });

    socketEffect.emit("listGame");
    setSocket(socketEffect);
    return () => {
      if (socketEffect && socketEffect.connected === true) {
        socketEffect.disconnect();
      }
    };
  }, []);

  useEffect(() => {
    console.log("list", listGame);
  }, [listGame]);

  return (
    <div className={classes.WatchGame}>
      {/*listGame && listGame.map((game:IGame)=>{

      })*/}
    </div>
  );
}

export default WatchGame;
