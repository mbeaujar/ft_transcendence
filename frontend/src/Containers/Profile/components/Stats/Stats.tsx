import React, { useEffect } from 'react';
import './Stats.scss';
import { IUser } from '../../../../interface/user.interface';
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
        <div className="StatsGeneralLeft">
          <Pongopoints user={props.user} />
          <Ratio user={props.user} />
        </div>
        <div className="StatsGeneralRight">
          <Rank user={props.user} />
          <Level user={props.user} />
        </div>
      </div>
      <div className="Bottom">
        <HistoryBlock user={props.user} />
        <FriendsBlock />
      </div>
    </div>
  );
};
export default Stats;
