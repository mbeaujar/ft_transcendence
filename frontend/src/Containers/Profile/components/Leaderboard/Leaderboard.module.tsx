import React, { useEffect, useState } from 'react';
import api from '../../../../apis/api';
import Avatar from '../Avatar/Avatar.module';
import classes from './Leaderboard.module.scss';
import { IUser } from '../../../../interface/user.interface';

const Leaderboard: React.FC = (): JSX.Element => {
  useEffect(() => {}, []);

  return (
    <div className={classes.Leaderboard}>
      <p>Leaderboard</p>
    </div>
  );
};

export default Leaderboard;
