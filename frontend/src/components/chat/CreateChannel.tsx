import React, { useState } from 'react';
import { IChannel } from '../interface/channel.interface';
import { IUser } from '../interface/user.interface';
import Checkbox from './Checkbox';
import { Scope } from '../interface/scope.enum';
import api from '../../apis/api';

interface Props {
  user: IUser;
  socketEmit: any;
}

const CreateChannel: React.FC<Props> = (props: Props): JSX.Element => {
  const [name, setName] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [user, setUser] = useState<string>('');
  const [scope, setScope] = useState<Scope>(Scope.public);

  return (
    <div>
      <p>Create Channel: </p>
      <div>
        <label>name: </label>
        <input
          type="text"
          value={name}
          onChange={e => setName(e.target.value)}
        />
      </div>
      <Checkbox
        label="public"
        value={scope === Scope.public}
        onChange={() => setScope(Scope.public)}
      />
      <Checkbox
        label="private"
        value={scope === Scope.private}
        onChange={() => setScope(Scope.private)}
      />
      <Checkbox
        label="protected"
        value={scope === Scope.protected}
        onChange={() => setScope(Scope.protected)}
      />
      <Checkbox
        label="discussion"
        value={scope === Scope.discussion}
        onChange={() => setScope(Scope.discussion)}
      />
      {scope === Scope.protected ? (
        <div>
          <label>password: </label>
          <input
            type="text"
            value={password}
            onChange={e => setPassword(e.target.value)}
          />
        </div>
      ) : null}
      {scope === Scope.discussion ? (
        <div>
          <label>user: </label>
          <input
            type="text"
            value={user}
            onChange={e => setUser(e.target.value)}
          />
        </div>
      ) : null}
      <div>
        <button
          onClick={() => {
            const channel: IChannel = {
              name,
              state: scope,
              users: [],
            };
            if (channel.state === Scope.protected) {
              channel.password = password;
            }
            if (channel.state !== Scope.discussion) {
              props.socketEmit('createChannel', channel);
            } else {
              api
                .get(`/users/username/${user}`)
                .then(resp =>
                  props.socketEmit('createDiscussion', {
                    channel,
                    user: resp.data,
                  })
                )
                .catch(reject => console.error(reject));
            }
            setName('');
            setPassword('');
            setScope(Scope.public);
          }}
        >
          create
        </button>
      </div>
    </div>
  );
};

export default CreateChannel;
