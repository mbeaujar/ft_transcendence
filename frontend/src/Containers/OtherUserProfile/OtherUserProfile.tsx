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

  function getUser(controller:AbortController) {
    let path = window.location.pathname;
    let cutPath = path.split('/');
    if (cutPath.length !== 4) {
      setUser(null);
      return;
    }
    api
      .get(`/users/username/${cutPath[3]}`, {
        signal: controller.signal,
      })
      .then((response) => {
        setUser(response.data);
      })
      .catch(() => {
        setUser(null);
      });
  }

  useEffect(() => {
    const controller = new AbortController();
    getUser(controller);
    return () => {
      controller.abort();
    };
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
        <h1>404 not found</h1>
      )}
    </Fragment>
  );
}

export default OtherUserProfile;
