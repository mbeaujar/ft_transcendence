import React, { useState, useEffect } from 'react';
import api from '../../../../../../apis/api';
import { toast } from 'react-toastify';
import './Username.scss';
import { IUser } from '../../../../../../interface/user.interface';

export interface Props {
  user: IUser;
  setRefresh: (value: number) => void;
  refresh: number;
}

function Username(props: Props) {
  const [activeUsernameBottom, setActiveUsernameBottom] =
    useState<boolean>(true);
  const [newName, setNewName] = useState<string>(props.user?.username);
  const [refresh, setRefresh] = useState<number>(0);

  useEffect(() => {
    props.setRefresh(props.refresh + 1);
    props.user.username = newName;
  }, [refresh]);

  function isValidUsername() {
    let i = 0;
    while (i < newName.length) {
      if (
        !(
          (newName.charCodeAt(i) >= 48 && newName.charCodeAt(i) <= 57) ||
          (newName.charCodeAt(i) >= 65 && newName.charCodeAt(i) <= 90) ||
          (newName.charCodeAt(i) >= 97 && newName.charCodeAt(i) <= 122) ||
          newName.charCodeAt(i) === 45 ||
          newName.charCodeAt(i) === 95
        )
      ) {
        return false;
      }
      i++;
    }
    return true;
  }

  function handleSubmitFormUsername(event: React.FormEvent<HTMLFormElement>) {
    if (isValidUsername() === false)
      toast.error('Your username can only containe number,letter,- and _');
    else if (newName.length < 4 || newName.length > 9) {
      toast.error('Your username must contain between 4 and 9 letters');
    } else {
      api
        .post('/users/username', { username: newName })
        .then(() => {
          setRefresh(refresh + 1);
          toast.success('Username successfully change');
          setActiveUsernameBottom(!activeUsernameBottom);
        })
        .catch((reject) => {
          console.error(reject);
          toast.error('This username is already choosen');
        });
    }
    event.preventDefault();
  }

  function handleChangeUsername(event: React.FormEvent<HTMLInputElement>) {
    var value = event.currentTarget.value;
    setNewName(value);
  }

  function showUsernameBottom() {
    if (activeUsernameBottom === true) return 'ShowUsernameBottom';
    else return 'HideUsernameBottom';
  }

  function showUsernameBottomChange() {
    if (activeUsernameBottom === false) return 'ShowUsernameBottomChange';
    else return 'HideUsernameBottomChange';
  }
  return (
    <div className="Username">
      <h3>Username</h3>
      <div className={showUsernameBottom()}>
        <p>{newName}</p>
        <button onClick={() => setActiveUsernameBottom(!activeUsernameBottom)}>
          <span className="material-icons">edit</span>
        </button>
      </div>
      <div className={showUsernameBottomChange()}>
        <form onSubmit={(event) => handleSubmitFormUsername(event)}>
          <input
            className="NewName"
            type="text"
            value={newName}
            onChange={(event) => handleChangeUsername(event)}
          />
          <button className="ValidNewName" type="submit">
            <span className="material-icons">done</span>
          </button>
        </form>
      </div>
    </div>
  );
}

export default Username;
