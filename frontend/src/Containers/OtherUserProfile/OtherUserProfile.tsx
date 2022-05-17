import { useEffect, useState, Fragment } from 'react';
import api from '../../apis/api';
import classes from './OtherUserProfile.module.scss';
import { IUser } from '../../interface/user.interface';
// import { IFriends } from "../../interface/friends.interface";
import Avatar from '../Profile/components/Avatar/Avatar';
import Stats from '../Profile/components/Stats/Stats';

function OtherUserProfile() {
  // const [friendsList, setFriendsList] = useState<IFriends>();
  const [user, setUser] = useState<IUser | null>(null);

  function getUser() {
    let path = window.location.pathname;
    let cutPath = path.split('/');
    if (cutPath.length !== 3) {
      setUser(null);
      return;
    }
    api
      .get(`/users/username/${cutPath[2]}`)
      .then((response) => {
        setUser(response.data);
      })
      .catch(() => {
        setUser(null);
      });
  }

  useEffect(() => {
    getUser();
    // api
    //   .get("/friends/list")
    //   .then((response) => setFriendsList(response.data))
    //   .catch((reject) => console.error(reject));
  }, [window.location.pathname]);

  return (
    <Fragment>
      {user ? (
        <div className={classes.OtherUserProfile}>
          <div className={classes.OtherUserProfileLeft}>
            <div className={classes.User}>
              <Avatar user={user} />
              <h1>{user.username}</h1>
            </div>
          </div>
          <div className={classes.OtherUserProfileRight}>
            <Stats user={user} />
          </div>
        </div>
      ) : (
        <p className={classes.NotFound}>User not found</p>
      )}
    </Fragment>
  );
}

export default OtherUserProfile;
