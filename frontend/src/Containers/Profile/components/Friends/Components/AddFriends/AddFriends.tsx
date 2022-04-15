import React, { useState, useEffect } from 'react';
import api from '../../../../../../apis/api';
import './AddFriends.scss';
import { IFriendsRequest } from '../../../../../../interface/friends-request.interface';
import Input from '../../../Input/Input';

function AddFriends(props: any) {
  const [refresh, setRefresh] = useState<number>(0);

  useEffect(() => {

  }, []);


  return (
    <div className="AddFriends">
          <h2>Add new friends</h2>
          <Input
            label="Search user : "
            onSubmit={(text: string) => {
              if (text === undefined || text === null) {
                return;
              }
              api
                .post('/friends/add', { username: text })
                .then((response) => setRefresh(refresh + 1))
                .catch((reject) => console.log(reject));
            }}
          />
        </div>
  );
}

export default AddFriends;
