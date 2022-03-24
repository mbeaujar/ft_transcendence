import React, { useState } from 'react';
import { IChannel } from '../../../../interface/channel.interface';
import { IUser } from '../../../../interface/user.interface';
import { Scope } from '../../../../interface/scope.enum';
import Checkbox from '../Checkbox/Checkbox.module';
import classes from './CreateChannel.module.scss';

interface Props {
  user: IUser;
  socketEmit: any;
}

const CreateChannel: React.FC<Props> = (props: Props): JSX.Element => {
  const [name, setName] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [scope, setScope] = useState<Scope>(Scope.public);

  return (
    <div className={classes.CreateChannel}>
      <h1>Create channel</h1>
      <div className={classes.ChannelName}>
        <h2>Name of channel </h2>
        <input
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />
      </div>
      <div className={classes.ChannelType}>
        <h2>Type of channel</h2>
        <div className={classes.ChannelCheckbox}>
        <div className={classes.CheckboxPublic}>
          <Checkbox
            label="Public"
            value={scope === Scope.public}
            onChange={() => setScope(Scope.public)}
          />
          </div>
          <div className={classes.CheckboxPrivate}>
          <Checkbox
            label="Private"
            value={scope === Scope.private}
            onChange={() => setScope(Scope.private)}
          />
          </div>
          <div className={classes.CheckboxProtected}>
          <Checkbox
            label="Protected"
            value={scope === Scope.protected}
            onChange={() => setScope(Scope.protected)}
          />
          </div>
        </div>
      </div>
      {scope === Scope.protected ? (
        <div className={classes.ChannelPassword}>
          <h2>Password </h2>
          <input
            type="text"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </div>
      ) : null}
      <div>
        <button
          onClick={() => {
            const channel: IChannel = {
              name,
              state: scope,
              password,
              users: [],
            };
            props.socketEmit(channel);
            setName('');
            setPassword('');
            setScope(Scope.public);
          }}
        >
          Create
        </button>
      </div>
    </div>
  );
};

export default CreateChannel;
