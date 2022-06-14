import React, { useEffect, useState } from 'react';
import { IUser } from '../../../../../../interface/user.interface';
import './Pongopoints.scss';

interface Props {
  user: IUser;
}

function Pongopoints(props: Props) {
  const [elo] = useState(props.user.elo);
  
  useEffect(() => {
    let valuePongopoints = document.getElementById('valuePongopoints');
    let progressPongopoints = 0;
    let speed = 1;
    let progress = setInterval(() => {
      progressPongopoints += 4;
      if (valuePongopoints !== null) {
        valuePongopoints.textContent = `${progressPongopoints}`;
      }

      if (progressPongopoints >= elo) {
        if (valuePongopoints !== null) {
          valuePongopoints.textContent = `${elo}`;
        }
        clearInterval(progress);
      }
    }, speed);
  }, [elo]);

  return (
    <div className="Pongopoints">
      <div className="Top">
        <h4 id="valuePongopoints"></h4>
      </div>
      <div className="Bottom">
        <p>PONGOPOINTS</p>
      </div>
    </div>
  );
}

export default Pongopoints;
