import React,{useEffect, useState} from 'react';
import { IUser } from '../../../../../../interface/user.interface';
import './Ratio.scss';

interface Props {
  user: IUser;
}

function Ratio(props: Props) {
  const [wins,setWins] = useState<number>(props.user.wins);
  const [losses,setLosses] = useState<number>(props.user.losses);

  useEffect(() => {
    let progressBar = document.getElementById('circular_progress');
    let progressValue = 0;
    let progressEndValue:number = wins + losses==0?50:(100 / (wins + losses)) * losses;
    let speed = 20;

    let progress = setInterval(() => {
      progressValue++;
      if (progressBar != null) {
        progressBar.style.background = `conic-gradient(
        red ${progressValue * 3.6}deg,
        #000000 ${progressValue * 3.6}deg
        )`;
        if (progressValue >= progressEndValue) {
          progressBar.style.background = `conic-gradient(
            red 0deg,
            red ${progressEndValue * 3.6}deg,
            #4bec00 ${progressEndValue * 3.6}deg,
            #4bec00 ${progressValue * 3.6}deg,
            rgb(0, 0, 0) ${progressValue * 3.6}deg,
            rgb(0, 0, 0) 360deg
            )`;
        }
      }
      if (progressValue === 100) {
        clearInterval(progress);
      }
    }, speed);
  }, []);

  return (
    <div className="Ratio">
      <div className="Top">
        <div className="container">
          <div id="circular_progress"></div>
        </div>
      </div>
      <div className="Bottom">
        <p>
          <span className="Wins">{wins} wins</span> /{' '}
          <span className="Losses">{losses} losses</span>
        </p>
      </div>
    </div>
  );
}

export default Ratio;
