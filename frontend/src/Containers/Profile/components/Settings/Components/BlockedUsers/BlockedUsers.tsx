import { useEffect, useState } from 'react';
import api from '../../../../../../apis/api';
import { IUser } from '../../../../../../interface/user.interface';
import Avatar from '../../../Avatar/Avatar';
import { toast } from 'react-toastify';
import './BlockedUsers.scss';

function BlockedUsers() {
  const [blockedUsers, setBlockedUsers] = useState<IUser[]>([]);

  useEffect(() => {
    api
      .get('/users/getBlockedUser')
      .then(({ data }) => setBlockedUsers(data.blockedUsers))
      .catch((rej) => console.error(rej));
  }, []);

  return (
    <div className="BlockedUsers">
      <h3>blocked users</h3>
      <div className="BlockedUsers">
        {blockedUsers.map((userBlocked: IUser, index: number) => (
          <div className="BlockedUser" key={userBlocked.id}>
            <Avatar user={userBlocked} />
            <p>{userBlocked.username}</p>
            const before = blockedUsers;
            <button
              onClick={() => {
                api
                  .post('/users/unblock', { id: userBlocked.id })
                  .then(() => {
                    setBlockedUsers([...blockedUsers.splice(index, 1)]);
                    toast.success(userBlocked.username + ' was unblocked');
                  })
                  .catch((reject) => {
                    toast.error(
                      `${userBlocked.username} wasn't unblocked because ${reject.response.data}`,
                    );
                  });
              }}
            >
              Unblock
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}

export default BlockedUsers;

// function BlockedUsers() {
//   const [user, setUser] = useState<IUser | null>(null);
//   const [refresh, setRefresh] = useState(0);

//   useEffect(() => {
//     api
//       .get('/users/getBlockedUser')
//       .then((response) => {
//         setUser(response.data);
//       })
//       .catch((reject) => console.error(reject));
//   }, [refresh]);

//   function ftUnblockUser(userBlocked: IUser) {
//     api
//       .post('/users/unblock', { id: userBlocked.id })
//       .then((response) => {
//         toast.success(userBlocked.username + ' was ublocked');
//         setRefresh(refresh + 1);
//       })
//       .catch((reject) =>
//         toast.error(userBlocked.username + " wasn't ublocked"),
//       );
//   }

//   return (
//     <div className="BlockedUsers">
//       <h3>Blocked users</h3>
//       <div className="BlockedUsers">
//         {user &&
//           user.blockedUsers.map((userBlocked: IUser) => (
//             <div className="BlockedUser" key={userBlocked.id}>
//               <Avatar user={userBlocked} />
//               <p>{userBlocked.username}</p>
//               <button onClick={() => ftUnblockUser(userBlocked)}>
//                 Unblock
//               </button>
//             </div>
//           ))}
//       </div>
//     </div>
//   );
// }

// export default BlockedUsers;
