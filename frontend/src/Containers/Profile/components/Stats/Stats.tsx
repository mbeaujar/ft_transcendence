import React, { useEffect, useState, useRef } from 'react';
import api from '../../../../apis/api';
import clsx from 'clsx';
import './Stats.scss';
import styles from './Stats.module.scss';
import { IUser } from '../../../../interface/user.interface';
import { IFriends } from '../../../../interface/friends.interface';
import Avatar from '../Avatar/Avatar';
import Pongopoints from './Components/Pongopoints/Pongopoints';
import Ratio from './Components/Ratio/Ratio';
import Rank from './Components/Rank/Rank';
import Level from './Components/Level/Level';
import HistoryBlock from './Components/HistoryBlock/HistoryBlock';
import FriendsBlock from './Components/FriendsBlock/FriendsBlock';

interface Props {
  user: IUser;
}

const Stats: React.FC<Props> = (props: Props): JSX.Element => {
  useEffect(() => {}, []);

  return (
    <div className="Stats">
      <div className="StatsGeneral">
        <Pongopoints user={props.user}/>
        <Ratio user={props.user}/>
        <Rank user={props.user}/>
        <Level />
      </div>
      <div className="Bottom">
        <HistoryBlock />
        <FriendsBlock />
        
      </div>
    </div>
  );
};
export default Stats;
