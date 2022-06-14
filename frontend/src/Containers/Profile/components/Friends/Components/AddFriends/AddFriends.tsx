import React, { useState, useEffect } from 'react';
import api from '../../../../../../apis/api';
import { toast } from 'react-toastify';
import './AddFriends.scss';
import Input from '../../../Input/Input';

function AddFriends() {
  const [refresh, setRefresh] = useState<number>(0);

  useEffect(() => {}, []);

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
            .then(() => {
              setRefresh(refresh + 1);
              toast.success('Your friend request was sent to ' + text);
            })
            .catch((reject) => {
              console.log(reject);
              toast.error("Your friend request wasn't send");
            });
        }}
      />
    </div>
  );
}

export default AddFriends;
