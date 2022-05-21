import React, { useEffect, useState } from 'react';
import api from '../../../../../../apis/api';
import { IUser } from '../../../../../../interface/user.interface';
import './Level.scss';
import imgLevel from './imgLevel';

interface Props {
  user: IUser;
}

// function ftSetLevel(pongopoints: number) {
//   if (pongopoints < 100) return 'Bronze 3';
//   else if (pongopoints < 200) return 'Bronze 2';
//   else if (pongopoints < 300) return 'Bronze 1';
//   else if (pongopoints < 400) return 'Silver 3';
//   else if (pongopoints < 500) return 'Silver 2';
//   else if (pongopoints < 600) return 'Silver 1';
//   else if (pongopoints < 700) return 'Gold 3';
//   else if (pongopoints < 800) return 'Gold 2';
//   else if (pongopoints < 900) return 'Gold 1';
//   else if (pongopoints < 1000) return 'Elite 3';
//   else if (pongopoints < 1100) return 'Elite 2';
//   else return 'Elite 1';
// }

function Level(props: Props) {
  // const [actualLevel, setActualLevel] = useState<string>(
  //   ftSetLevel(props.user.elo),
  // );
  const actualLevel = props.user.rank;

  useEffect(() => {
    let speed = 30;
    let imgLevelElementProgress = 0;
    let imgLevelElement = document.getElementById('imgLevelElement');
    let progressPodium4 = setInterval(() => {
      imgLevelElementProgress++;
      if (imgLevelElement !== null) {
        imgLevelElement.style.width = `${imgLevelElementProgress}%`;
      }
      if (imgLevelElementProgress === 50) {
        clearInterval(progressPodium4);
      }
    }, speed);
  }, []);

  return (
    <div className="Level">
      <div className="Top">
        <img id="imgLevelElement" src={imgLevel.get(actualLevel)}></img>
      </div>
      <div className="Bottom">
        <p>{actualLevel}</p>
      </div>
    </div>
  );
}

export default Level;
