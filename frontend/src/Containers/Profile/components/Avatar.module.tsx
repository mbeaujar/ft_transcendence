import React, { useEffect, useState } from 'react';
import api from '../../apis/api';
import { IUser } from '../interface/user.interface';

interface Props {
  user: IUser;
}

const Avatar: React.FC<Props> = (props: Props): JSX.Element => {
  const [avatar, setAvatar] = useState<any>(); // Blob | string

  useEffect(() => {
    if (props.user.avatarId) {
      api
        .get(`/local-files/${props.user.avatarId}`, { responseType: 'blob' })
        .then(response => setAvatar(response.data))
        .catch(reject => console.error(reject));
    } else {
      api
        .get(`/local-files/default/${props.user.id}`)
        .then(response => setAvatar(response.data))
        .catch(reject => console.error(reject));
    }
  }, []);

  return (
    <div>
      {props.user.avatarId ? (
        <img src={URL.createObjectURL(avatar)} alt="profile" />
      ) : (
        <img src={avatar} alt="default profile" />
      )}
    </div>
  );
};

export default Avatar;
