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

      </div>
    </div>
  );
};

export default OtherUserProfile;
