import React, { useEffect, useState } from 'react';
import api from '../../apis/api';
import clsx from 'clsx';
import classes from './OtherUserProfile.module.scss';
import { IUser } from '../../interface/user.interface';
import Avatar from '../Profile/components/Avatar.module';

interface Props {
  user: IUser;
}

const OtherUserProfile: React.FC<Props> = (props: Props): JSX.Element => {
  return (
    <div className={classes.OtherUserProfile}>
      <div className={classes.OtherUserProfileLeft}>
        <Avatar user={props.user} />
        <h1>{props.user?.username}</h1>
      </div>
      <div className={classes.OtherUserProfileRight}>
        <div className={classes.Stats}>
          <div className={classes.Pongopoints}></div>
          <div className={classes.Ratio}></div>
          <div className={classes.Rank}></div>
          <div className={classes.Pongopoints}></div>
        </div>
        <div className={classes.Bottom}>
          <div className={classes.Hitory}>
            <h3 className={classes.title}>History</h3>
          </div>
          <div className={classes.Friends}>
            <h3 className={classes.title}>Friends</h3>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OtherUserProfile;
