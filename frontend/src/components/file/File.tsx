import React, { useState } from 'react';
import { IUser } from '../interface/user.interface';
import api from '../../apis/api';

interface Props {
  user: IUser;
}

const File: React.FC<Props> = (props: Props): JSX.Element => {
  const [file, setFile] = useState<any>();
  const [avatar, setAvatar] = useState<any>(null);

  return (
    <div>
      <br />
      <form
        onSubmit={e => {
          e.preventDefault();
          const formData = new FormData();
          formData.append('file', file, file.name);
          console.log('file', file);
          api
            .post('/users/avatar', formData)
            .then(response => console.log(response.data))
            .catch(reject => console.log(reject));
        }}
      >
        <input
          type="file"
          onChange={e => setFile(e.target.files ? e.target.files[0] : null)}
        />
        <input type="submit" value="submit" id="submit" />
      </form>
      <button
        onClick={() => {
          console.log('id', props.user.avatarId);
          api
            .get(`/users/avatar/${props.user.avatarId}`, {
              responseType: 'blob',
            })
            .then(response => setAvatar(response.data))
            .catch(reject => console.log(reject));
        }}
      >
        Get avatar
      </button>
      {avatar ? <img src={URL.createObjectURL(avatar)} /> : null}
    </div>
  );
};

export default File;
