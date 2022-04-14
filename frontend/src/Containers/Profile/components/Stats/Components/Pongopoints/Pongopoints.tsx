import React, { useEffect } from 'react';
import './Pongopoints.scss';

function Pongopoints(props: any) {
  let speed = 1;
  useEffect(() => {
    let valuePongopoints: any = document.getElementById('valuePongopoints');
    let progressPongopoints = 0;
    let speed = 1;
    let progress2 = setInterval(() => {
      progressPongopoints++;
      if (valuePongopoints != null) {
        valuePongopoints.textContent = `${progressPongopoints}`;
      }

      if (progressPongopoints >= 561) {
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
