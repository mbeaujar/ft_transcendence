import React, { useEffect, useState } from "react";
import api from "../../../../../../apis/api";
import { IUser } from "../../../../../../interface/user.interface";
import "./Rank.scss";

interface Props {
  user: IUser;
}

function Level(props: Props) {
  const [rank, setRank] = useState(0);
  useEffect(() => {
    api
      .get(`/users/ranking`)
      .then((response) => setRank(response.data))
      .catch((reject) => console.log(reject));
    let podium2: any = document.getElementById("Podium2");
    let podium1: any = document.getElementById("Podium1");
    let podium3: any = document.getElementById("Podium3");

    let podium2Progress = 0;
    let podium3Progress = 0;
    let podium1Progress = 0;

    let speed = 30;
    let progressPodium2 = setInterval(() => {
      podium2Progress++;
      if (podium2 != null) {
        podium2.style.height = `${podium2Progress}%`;
      }
      if (podium2Progress == 45) {
        clearInterval(progressPodium2);
      }
    }, speed);
    let progressPodium1 = setInterval(() => {
      podium1Progress++;
      if (podium1 != null) {
        podium1.style.height = `${podium1Progress}%`;
      }
      if (podium1Progress == 60) {
        clearInterval(progressPodium1);
      }
    }, speed);
    let progressPodium3 = setInterval(() => {
      podium3Progress++;
      if (podium3 != null) {
        podium3.style.height = `${podium3Progress}%`;
      }
      if (podium3Progress == 30) {
        clearInterval(progressPodium3);
      }
    }, speed);
  }, []);

  return (
    <div className="Rank">
      <div className="Top">
        <div id="Podium2"></div>
        <div id="Podium1"></div>
        <div id="Podium3"></div>
      </div>
      <div className="Bottom">
        <p>{rank}</p>
        <span>th</span>
      </div>
    </div>
  );
}

export default Level;
