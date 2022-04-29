import React, { useEffect, useState } from "react";
import api from "../../../../apis/api";
import Avatar from "../Avatar/Avatar";
//import classes from './Leaderboard.module.scss';
import "./Leaderboard.scss";
import { IUser } from "../../../../interface/user.interface";

function ftSetLevel(pongopoints: number) {
  if (pongopoints < 100) return "BRONZE 3";
  else if (pongopoints < 200) return "BRONZE 2";
  else if (pongopoints < 300) return "BRONZE 1";
  else if (pongopoints < 400) return "SILVER 3";
  else if (pongopoints < 500) return "SILVER 2";
  else if (pongopoints < 600) return "SILVER 1";
  else if (pongopoints < 700) return "GOLD 3";
  else if (pongopoints < 800) return "GOLD 2";
  else if (pongopoints < 900) return "GOLD 1";
  else if (pongopoints < 1000) return "ELITE 3";
  else if (pongopoints < 1100) return "ELITE 2";
  else return "ELITE 1";
}

const Leaderboard: React.FC = (): JSX.Element => {
  const [leaderboard, setLeaderboard] = useState([]);

  useEffect(() => {
    api
      .get("/users/leaderboard")
      .then((response) => {
        setLeaderboard(response.data);
      })
      .catch((reject) => console.error(reject));
  }, []);

  return (
    <div className="Leaderboard">
      <div className="Header">
        <div className="HeaderLeft">
          <h3>Rank</h3>
          <h3>User</h3>
        </div>
        <h3>Level</h3>
        <h3>Ratio</h3>
        <h3>Pongopoints</h3>
      </div>

      <div className="Users">
        {leaderboard.map((user: any,index:number) => (
          <div className="User">
            <div className="UserLeft">
              <p className="Rank">{index+1}</p>
              <Avatar user={user} />
              <p className="Username">{user.username}</p>
            </div>
            <div className="Right">
              <p className="Level">{ftSetLevel(user.elo)}</p>
              <p className="Ratio">
          <span className="Wins">{user.wins}W</span> /{' '}
          <span className="Losses">{user.losses}L</span>
        </p>
              <p className="Pongopoints">{user.elo}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Leaderboard;
