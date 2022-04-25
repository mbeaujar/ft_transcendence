import React, { useEffect, useState } from 'react';
import { IUser } from '../../../../../../interface/user.interface';
import './Pongopoints.scss';

interface Props {
  user: IUser;
}

function Pongopoints(props: Props) {
  const [elo,setElo] = useState(props.user.elo);
  useEffect(() => {
    let valuePongopoints: any = document.getElementById('valuePongopoints');
    let progressPongopoints = 0;
    let speed = (100/elo);
    let progress2 = setInterval(() => {
      progressPongopoints++;
      if (valuePongopoints != null) {
        valuePongopoints.textContent = `${progressPongopoints}`;
      }

      if (progressPongopoints >= elo) {
        clearInterval(progress2);
      }
    }, speed);
  }, []);

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
