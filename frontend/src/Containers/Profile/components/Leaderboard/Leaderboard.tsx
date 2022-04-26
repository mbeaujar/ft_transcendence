import React, { useEffect, useState } from 'react';
import api from '../../../../apis/api';
import Avatar from '../Avatar/Avatar';
//import classes from './Leaderboard.module.scss';
import './Leaderboard.scss';
import { IUser } from '../../../../interface/user.interface';

const Leaderboard: React.FC = (): JSX.Element => {

  useEffect(() => {
    api
    .get('/users/leaderboard')
    .then((response) => console.log("leaderboard=",response.data))
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
        
        <div className="User">
          <div className="UserLeft">
            <p className="Rank">1</p>
            <div  className="divImg">
            <img
              src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSppkq9EOR9dtyDFm5mDlJ0-eJ2ddp8G9MSVw&usqp=CAU"
              className="Avatar"
            ></img></div>
            <p className="Username">Livaï</p>
          </div>
          <div className="Right">
            <p className="Level">E1</p>
            <p className="Ratio">13W / 0L</p>
            <p className="Pongopoints">5324</p>
          </div>
        </div>
        <div className="User">
          <div className="UserLeft">
            <p className="Rank">2</p>
            <div  className="divImg"><img
              src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRa_ZFA7Nc5_IkQinevA7dBIwquje91csViyQ&usqp=CAU"
              className="Avatar"
            ></img></div>
            <p className="Username">Eren</p>
          </div>
          <div className="Right">
            <p className="Level">E2</p>
            <p className="Ratio">10W / 2L</p>
            <p className="Pongopoints">134</p>
          </div>
        </div>
        <div className="User">
          <div className="UserLeft">
            <p className="Rank">3</p>
            <div className="divImg"><img
              src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRyhWqTEVwIMyW5Mx90y44YZjlkPVH-dm908g&usqp=CAU"
              className="Avatar"
            ></img></div>
            <p className="Username">Sommecaise</p>
          </div>
          <div className="Right">
            <p className="Level">G3</p>
            <p className="Ratio">10W / 10L</p>
            <p className="Pongopoints">54</p>
          </div>
        </div>
        <div className="User">
          <div className="UserLeft">
            <p className="Rank">4</p>
            <div  className="divImg"><img
              src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTwD1TQPCWvR6RTQ9SNgeRnw0tlF4QoUitDmg&usqp=CAU"
              className="Avatar"
            ></img></div>
            <p className="Username">Rick</p>
          </div>
          <div className="Right">
            <p className="Level">S1</p>
            <p className="Ratio">349W/485L</p>
            <p className="Pongopoints">4</p>
          </div>
        </div>
        <div className="User">
          <div className="UserLeft">
            <p className="Rank">4</p>
            <div  className="divImg"><img
              src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTwD1TQPCWvR6RTQ9SNgeRnw0tlF4QoUitDmg&usqp=CAU"
              className="Avatar"
            ></img></div>
            <p className="Username">Rick</p>
          </div>
          <div className="Right">
            <p className="Level">S1</p>
            <p className="Ratio">349W/485L</p>
            <p className="Pongopoints">4</p>
          </div>
        </div>
        <div className="User">
          <div className="UserLeft">
            <p className="Rank">4</p>
            <div  className="divImg"><img
              src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTwD1TQPCWvR6RTQ9SNgeRnw0tlF4QoUitDmg&usqp=CAU"
              className="Avatar"
            ></img></div>
            <p className="Username">Rick</p>
          </div>
          <div className="Right">
            <p className="Level">S1</p>
            <p className="Ratio">349W/485L</p>
            <p className="Pongopoints">4</p>
          </div>
        </div>
        <div className="User">
          <div className="UserLeft">
            <p className="Rank">4</p>
            <div  className="divImg"><img
              src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTwD1TQPCWvR6RTQ9SNgeRnw0tlF4QoUitDmg&usqp=CAU"
              className="Avatar"
            ></img></div>
            <p className="Username">Rick</p>
          </div>
          <div className="Right">
            <p className="Level">S1</p>
            <p className="Ratio">349W/485L</p>
            <p className="Pongopoints">4</p>
          </div>
        </div>
        <div className="User">
          <div className="UserLeft">
            <p className="Rank">4</p>
            <div  className="divImg"><img
              src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTwD1TQPCWvR6RTQ9SNgeRnw0tlF4QoUitDmg&usqp=CAU"
              className="Avatar"
            ></img></div>
            <p className="Username">Rick</p>
          </div>
          <div className="Right">
            <p className="Level">S1</p>
            <p className="Ratio">349W/485L</p>
            <p className="Pongopoints">4</p>
          </div>
        </div>
        <div className="User">
          <div className="UserLeft">
            <p className="Rank">4</p>
            <div  className="divImg"><img
              src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTwD1TQPCWvR6RTQ9SNgeRnw0tlF4QoUitDmg&usqp=CAU"
              className="Avatar"
            ></img></div>
            <p className="Username">Rick</p>
          </div>
          <div className="Right">
            <p className="Level">S1</p>
            <p className="Ratio">349W/485L</p>
            <p className="Pongopoints">4</p>
          </div>
        </div>
        <div className="User">
          <div className="UserLeft">
            <p className="Rank">4</p>
            <div  className="divImg"><img
              src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTwD1TQPCWvR6RTQ9SNgeRnw0tlF4QoUitDmg&usqp=CAU"
              className="Avatar"
            ></img></div>
            <p className="Username">Rick</p>
          </div>
          <div className="Right">
            <p className="Level">S1</p>
            <p className="Ratio">349W/485L</p>
            <p className="Pongopoints">4</p>
          </div>
        </div>
        <div className="User">
          <div className="UserLeft">
            <p className="Rank">4</p>
            <div  className="divImg"><img
              src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTwD1TQPCWvR6RTQ9SNgeRnw0tlF4QoUitDmg&usqp=CAU"
              className="Avatar"
            ></img></div>
            <p className="Username">Rick</p>
          </div>
          <div className="Right">
            <p className="Level">S1</p>
            <p className="Ratio">349W/485L</p>
            <p className="Pongopoints">4</p>
          </div>
        </div>
        <div className="User">
          <div className="UserLeft">
            <p className="Rank">4</p>
            <div  className="divImg"><img
              src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTwD1TQPCWvR6RTQ9SNgeRnw0tlF4QoUitDmg&usqp=CAU"
              className="Avatar"
            ></img></div>
            <p className="Username">Rick</p>
          </div>
          <div className="Right">
            <p className="Level">S1</p>
            <p className="Ratio">349W/485L</p>
            <p className="Pongopoints">4</p>
          </div>
        </div>
        <div className="User">
          <div className="UserLeft">
            <p className="Rank">4</p>
            <div  className="divImg"><img
              src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTwD1TQPCWvR6RTQ9SNgeRnw0tlF4QoUitDmg&usqp=CAU"
              className="Avatar"
            ></img></div>
            <p className="Username">Rick</p>
          </div>
          <div className="Right">
            <p className="Level">S1</p>
            <p className="Ratio">349W/485L</p>
            <p className="Pongopoints">4</p>
          </div>
        </div>
        <div className="User">
          <div className="UserLeft">
            <p className="Rank">4</p>
            <div  className="divImg"><img
              src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTwD1TQPCWvR6RTQ9SNgeRnw0tlF4QoUitDmg&usqp=CAU"
              className="Avatar"
            ></img></div>
            <p className="Username">Rick</p>
          </div>
          <div className="Right">
            <p className="Level">S1</p>
            <p className="Ratio">349W/485L</p>
            <p className="Pongopoints">4</p>
          </div>
        </div>
      </div>

    </div>
  );
};

export default Leaderboard;
