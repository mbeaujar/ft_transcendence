import React, { useEffect, useState } from 'react';
import api from '../../../../apis/api';
import Avatar from '../Avatar/Avatar.module';
import classes from './Settings.module.scss';
import { IUser } from '../../../../interface/user.interface';

const Settings: React.FC = (): JSX.Element => {
  useEffect(() => {}, []);

  return (
    <div className={classes.Settings}>
      <div className={classes.SettingsLeft}>
        <div className={classes.DoubleAuth}></div>
        <div className={classes.Username}></div>
        <div className={classes.Avatar}></div>
      </div>
      <div className={classes.UsersBlock}></div>
    </div>
  );
};

export default Settings;
