import React, { useEffect, useState } from 'react';
import api from '../../../../apis/api';
import { IUser } from '../../../../interface/user.interface';

interface Props {
  user: IUser;
}

const Avatar: React.FC<Props> = (props: Props): JSX.Element => {
  const [avatar, setAvatar] = useState<any>(); // Blob | string

  {
    useEffect(() => {
      if (!props.user) return;
      api
        .get(`/local-files/${props.user.avatarId}`, {
          responseType: 'blob',
        })
        .then((response) => setAvatar(response.data))
        .catch((reject) => console.log(reject));
    }, []);

    return (
      <div>{avatar ? <img src={URL.createObjectURL(avatar)} /> : null}</div>
    );
  }
};

export default Avatar;
