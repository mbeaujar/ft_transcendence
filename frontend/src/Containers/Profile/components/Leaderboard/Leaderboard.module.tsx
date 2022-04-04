import React, { useEffect, useState } from 'react';
import api from '../../../../apis/api';
import Avatar from '../Avatar/Avatar.module';
import classes from './Leaderboard.module.scss';
import { IUser } from '../../../../interface/user.interface';

const Leaderboard: React.FC = (): JSX.Element => {
  useEffect(() => {}, []);

  return (
    <div className={classes.Leaderboard}>
      <div className={classes.Header}>
        <div className={classes.Left}>
          <h3>Rank</h3>
          <h3>User</h3>
        </div>
        <h3>Level</h3>
        <h3>Ratio</h3>
        <h3>Pongopoints</h3>
      </div>
      <div className={classes.Users}>
        
        <div className={classes.User}>
          <div className={classes.Left}>
            <p className={classes.Rank}>1</p>
            <img
              src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSppkq9EOR9dtyDFm5mDlJ0-eJ2ddp8G9MSVw&usqp=CAU"
              className={classes.Avatar}
            ></img>
            <p className={classes.Username}>Livaï</p>
          </div>
          <div className={classes.Right}>
            <p className={classes.Level}>ELITE 1</p>
            <p className={classes.Ratio}>13W / 0L</p>
            <p className={classes.Pongopoints}>5324</p>
          </div>
        </div>
        <div className={classes.User}>
          <div className={classes.Left}>
            <p className={classes.Rank}>2</p>
            <img
              src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRa_ZFA7Nc5_IkQinevA7dBIwquje91csViyQ&usqp=CAU"
              className={classes.Avatar}
            ></img>
            <p className={classes.Username}>Eren</p>
          </div>
          <div className={classes.Right}>
            <p className={classes.Level}>ELITE 2</p>
            <p className={classes.Ratio}>10W / 2L</p>
            <p className={classes.Pongopoints}>134</p>
          </div>
        </div>
        <div className={classes.User}>
          <div className={classes.Left}>
            <p className={classes.Rank}>3</p>
            <img
              src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRyhWqTEVwIMyW5Mx90y44YZjlkPVH-dm908g&usqp=CAU"
              className={classes.Avatar}
            ></img>
            <p className={classes.Username}>Erwin</p>
          </div>
          <div className={classes.Right}>
            <p className={classes.Level}>Golden 3</p>
            <p className={classes.Ratio}>10W / 10L</p>
            <p className={classes.Pongopoints}>54</p>
          </div>
        </div>
        <div className={classes.User}>
          <div className={classes.Left}>
            <p className={classes.Rank}>4</p>
            <img
              src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTwD1TQPCWvR6RTQ9SNgeRnw0tlF4QoUitDmg&usqp=CAU"
              className={classes.Avatar}
            ></img>
            <p className={classes.Username}>Rick</p>
          </div>
          <div className={classes.Right}>
            <p className={classes.Level}>SILVER 1</p>
            <p className={classes.Ratio}>3W / 5L</p>
            <p className={classes.Pongopoints}>4</p>
          </div>
        </div>
      </div>

    </div>
  );
};

export default Leaderboard;
