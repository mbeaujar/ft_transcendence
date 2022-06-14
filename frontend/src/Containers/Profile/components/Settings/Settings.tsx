import React from 'react';
import './Settings.scss';
import { IUser } from '../../../../interface/user.interface';
import Username from './Components/Username/Username';
import AvatarSettings from './Components/AvatarSettings/AvatarSettings';
import Theme from './Components/Theme/Theme';
import DoubleAuthSettings from './Components/DoubleAuthSettings/DoubleAuthSettings';
import BlockedUsers from './Components/BlockedUsers/BlockedUsers';

interface Props {
  user: IUser;
  refresh: number;
  setRefresh: (value: number) => void;
  theme: string;
  setTheme: (value: string) => void;
}

const Settings: React.FC<Props> = (props: Props): JSX.Element => {
  return (
    <div className="Settings">
      <div className="SettingsLeft">
        <Username
          user={props.user}
          refresh={props.refresh}
          setRefresh={props.setRefresh}
        />
        <AvatarSettings
          user={props.user}
          refresh={props.refresh}
          setRefresh={props.setRefresh}
        />
        <Theme theme={props.theme} setTheme={props.setTheme} />
      </div>
      <div className="SettingsRight">
        <DoubleAuthSettings
          user={props.user}
          refresh={props.refresh}
          setRefresh={props.setRefresh}
        />
        <BlockedUsers />
      </div>
    </div>
  );
};

export default Settings;
