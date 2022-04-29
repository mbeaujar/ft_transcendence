import React, { useState } from "react";
import { IChannel } from "../../../../interface/channel.interface";
import { IUser } from "../../../../interface/user.interface";
import { Scope } from "../../../../interface/scope.enum";
import Checkbox from "../Checkbox/Checkbox.module";
import classes from "./CreateChannel.module.scss";
import { toast } from "react-toastify";

interface Props {
  user: IUser;
  socketEmit: any;
}

const CreateChannel: React.FC<Props> = (props: Props): JSX.Element => {
  const [name, setName] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [scope, setScope] = useState<Scope>(Scope.public);

  function isValidChannelName(newName: string) {
    let i = 0;
    while (i < newName.length) {
      if (
        !(
          (newName.charCodeAt(i) >= 48 && newName.charCodeAt(i) <= 57) ||
          (newName.charCodeAt(i) >= 65 && newName.charCodeAt(i) <= 90) ||
          (newName.charCodeAt(i) >= 97 && newName.charCodeAt(i) <= 122) ||
          newName.charCodeAt(i) == 45 ||
          newName.charCodeAt(i) == 95
        )
      ) {
        return false;
      }
      i++;
    }
    return true;
  }

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
          className={classes.CreateChannelButton}
          onClick={() => {
            if (isValidChannelName(name) === false) {
              toast.error(
                "Your channel name can only containe number,letter,- and _"
              );
            } else if (name.length < 4 || name.length > 9) {
              toast.error("Your channel name must contain between 4 and 9 letters");
            } else {
              let channel: IChannel;
              if (scope===Scope.public||scope===Scope.private)
              {
                channel = {
                  name,
                  state: scope,
                  users: [],
                };
              }
              else 
              {
                channel = {
                  name,
                  state: scope,
                  password,
                  users: [],
                };
              }
              props.socketEmit(channel);
              setName("");
              setPassword("");
              setScope(Scope.public);
            }
          }}
        >
          Create
        </button>
      </div>
    </div>
  );
};

export default CreateChannel;
