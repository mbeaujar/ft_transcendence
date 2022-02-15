import React, { useEffect, useState } from 'react';
import axios from 'axios';
import clsx from  'clsx';

import classes from './Friends.module.scss';

const apiAxios = axios.create({
    baseURL: 'http://localhost:3000/api',
    withCredentials: true,
  });

function Friends()
{
    const [stateAddFriends, setStateAddFriends] = useState('');
    const [stateFriendsRequests, setStateFriendsRequests] = useState<[any]>();

    const [stateFriendRequestName, setStateFriendRequestName] = useState<any>(null);
    const [stateFriendRequestAvatar, setStateFriendRequestAvatar] = useState<any>(null);

    useEffect(() => {
        let url = "/friends/request";
        apiAxios.get(`${url}`).then(response => setStateFriendsRequests(response.data)).catch(reject => setStateFriendsRequests(reject));
      }, []);


    const getFriendsRequests = (friendsRequests:any, type: string) => 
    {
        apiAxios.get(`/users/${friendsRequests.user}`).then(response => setStateFriendRequestName(response.data?.username)).catch(reject => setStateFriendRequestName(reject));
        apiAxios.get(`/users/${friendsRequests.user}`).then(response => setStateFriendRequestAvatar(response.data?.avatar)).catch(reject => setStateFriendRequestAvatar(reject));
        
        if (type === "username")
            return (stateFriendRequestName);
        else if (type === "avatar")
            return (stateFriendRequestAvatar);
    }


    const addFriends = () => 
    {
        let url = "/auth/status";
        //apiAxios.get(`${url}`).then(response => console.log(response.data)).catch(reject => console.log(reject));
        //url = "/friends/add";
        //apiAxios.post(`${url}`, {id:parseInt(stateAddFriends)}).then(response => console.log(response.data)).catch(reject => console.log(reject));
        url = "/friends/request";
        //apiAxios.get(`${url}`).then(response => setStateFriendsRequests(response.data)).catch(reject => setStateFriendsRequests(reject));
        apiAxios.get(`${url}`).then(response => setStateFriendsRequests(response.data)).catch(reject => setStateFriendsRequests(reject));
        
        url = "/users";
        if (stateFriendsRequests)
            console.log("id = " + stateFriendsRequests[0].user);
        /*stateFriendsRequests.map((object:any) =>{
            console.log(object);
        });*/
        if (stateFriendsRequests)
            apiAxios.get(`${url}/${stateFriendsRequests[0].user}`).then(response => console.log(response.data.username)).catch(reject => console.log(reject));
        //url = "/friends/all";
        //apiAxios.get(`${url}`).then(response => console.log(response.data)).catch(reject => console.log(reject));
        //url = "/friends";
        //apiAxios.delete(`${url}/${stateAddFriends}`).then(response => console.log(response.data)).catch(reject => console.log(reject));
        //url = "/friends/all";
        //apiAxios.get(`${url}`).then(response => console.log(response.data)).catch(reject => console.log(reject));
        setStateAddFriends('');
    }


    return (
        <div className={classes.Friends}>

            <div className={classes.FriendsLeft}>
                <h2>My Friends</h2>
            </div>

            
            <div className={classes.FriendsRight}>
                <div className={classes.AddFriends}>
                    <h2>Add new friends</h2>
                    <form onSubmit={e => {e.preventDefault()}}>
                        <label>Search user : </label>
                        <input type="text" required value={stateAddFriends} onChange={(e) => setStateAddFriends(e.target.value)}/>
                        <button onClick={addFriends} >Add friends</button>
                    </form>
                </div>

                <div className={classes.FriendsRequest}>
                    <h2>Friends Request</h2>
                    {stateFriendsRequests && (
                        <div className={classes.request}>
                            {stateFriendsRequests.map((friendsRequests:any) => (
                                <div key={friendsRequests.id} className={classes.friendsRequestsElement}>
                                    <p>{getFriendsRequests(friendsRequests, "username")}</p>
                                    <img src={getFriendsRequests(friendsRequests, "avatar")}/>
                                </div>
                            ))}
                        </div>
                    )}
                </div>

            </div>

        
        </div>
    );

}

export default Friends;
