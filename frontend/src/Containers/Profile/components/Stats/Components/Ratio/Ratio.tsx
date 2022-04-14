import React,{useEffect} from 'react';
import './Ratio.scss';

function Ratio(props: any) {
  useEffect(() => {
    let progressBar: any = document.getElementById('circular_progress');
    let progressValue = 0;
    let progressEndValue = 30;
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
      if (progressValue == 100) {
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
          <span className="Wins">7 wins</span> /{' '}
          <span className="Losses">3 losses</span>
        </p>
      </div>
    </div>
  );
}

export default Ratio;
