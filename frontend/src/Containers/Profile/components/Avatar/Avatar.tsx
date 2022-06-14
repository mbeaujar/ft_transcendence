import React, { useEffect, useState } from 'react';
import api from '../../../../apis/api';
import { IUser } from '../../../../interface/user.interface';

interface Props {
  user: IUser;
}

const Avatar: React.FC<Props> = (props: Props): JSX.Element => {
  const [avatar, setAvatar] = useState<Blob | MediaSource>(); // Blob | string

  useEffect(() => {
    if (!props.user) return;

    const controller = new AbortController();

    api
      .get(`/users/avatar/${props.user.avatarId}`, {
        responseType: 'blob',
        signal: controller.signal,
      })
      .then((response) => setAvatar(response.data))
      .catch((reject) => console.log(reject));

    return () => {
      controller.abort();
    };
  }, [props.user, props.user.avatarId]);

  return <div>{avatar ? <img alt="" src={URL.createObjectURL(avatar)} /> : null}</div>;
};

export default Avatar;
