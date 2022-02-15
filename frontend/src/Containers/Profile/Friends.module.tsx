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
    const [stateFriendsRequests, setStateFriendsRequests] = useState<any>(null);
    const [stateFriendsList, setStateFriendsList] = useState<any>(null);

    const [stateFriendRequestName, setStateFriendRequestName] = useState<any>(null);
    const [stateFriendRequestAvatar, setStateFriendRequestAvatar] = useState<any>(null);

    const [stateFriendListName, setStateFriendListName] = useState<any>(null);
    const [stateFriendListAvatar, setStateFriendListAvatar] = useState<any>(null);

    useEffect(() => {
        apiAxios.get(`/friends/all`).then(response => setStateFriendsList(response.data.friends)).catch(reject => setStateFriendsList(null));
        apiAxios.get(`/friends/request`).then(response => setStateFriendsRequests(response.data)).catch(reject => setStateFriendsRequests(null));

    }, [/*stateFriendsList, stateFriendsRequests*/]);


    const getFriendsList = (friendsList:any, type: string) => 
    {
        if (type === "username")
        {
            apiAxios.get(`/users/${friendsList.id}`).then(response => setStateFriendListName(response.data?.username)).catch(reject => console.log(reject));
            return (stateFriendListName);
        }
        else if (type === "avatar")
        {
            apiAxios.get(`/users/${friendsList.id}`).then(response => setStateFriendListAvatar(response.data?.avatar)).catch(reject => console.log(reject));
            return (stateFriendListAvatar);
        }
    }

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
        apiAxios.post(`/friends/add`, {id:parseInt(stateAddFriends)}).then(response => console.log(response.data)).catch(reject => console.log(reject));
        url = "/friends/request";
        //apiAxios.get(`${url}`).then(response => setStateFriendsRequests(response.data)).catch(reject => setStateFriendsRequests(reject));
        //apiAxios.get(`${url}`).then(response => setStateFriendsRequests(response.data)).catch(reject => setStateFriendsRequests(reject));
        
        //url = "/users";
        //if (stateFriendsRequests)
        //    console.log("id = " + stateFriendsRequests[0].user);
        /*stateFriendsRequests.map((object:any) =>{
            console.log(object);
        });*/
        //if (stateFriendsRequests)
        //    apiAxios.get(`${url}/${stateFriendsRequests[0].user}`).then(response => console.log(response.data.username)).catch(reject => console.log(reject));
        url = "/friends/all";
        apiAxios.get(`/friends/all`).then(response => console.log(response.data)).catch(reject => console.log(reject));
        //url = "/friends";
        //apiAxios.delete(`${url}/${stateAddFriends}`).then(response => console.log(response.data)).catch(reject => console.log(reject));
        //url = "/friends/all";
        //apiAxios.get(`${url}`).then(response => console.log(response.data)).catch(reject => console.log(reject));
        setStateAddFriends('');
    }

    const acceptRequest = (friendsRequests:any) => 
    {
        let url = "/friends/all";
        apiAxios.get(`${url}`).then(response => console.log(response.data)).catch(reject => console.log(reject));
        apiAxios.post(`/friends/add`, {id:parseInt(friendsRequests.user)}).then(response => console.log(response.data)).catch(reject => console.log(reject));
        url = "/friends/all";
        apiAxios.get(`${url}`).then(response => console.log(response.data)).catch(reject => console.log(reject));
        apiAxios.get(`/friends/request`).then(response => setStateFriendsRequests(response.data)).catch(reject => setStateFriendsRequests(null));
        console.log("list = " + stateFriendsList);
    }

    const refuseRequest = (friendsRequests:any) => 
    {
        let url = "/friends/all";
        apiAxios.get(`${url}`).then(response => console.log(response.data)).catch(reject => console.log(reject));
        apiAxios.post(`/friends/request/refuse`, {id:parseInt(friendsRequests.user)}).then(response => console.log(response.data)).catch(reject => console.log(reject));
        url = "/friends/all";
        apiAxios.get(`${url}`).then(response => console.log(response.data)).catch(reject => console.log(reject));
        apiAxios.get(`/friends/request`).then(response => setStateFriendsRequests(response.data)).catch(reject => setStateFriendsRequests(null));
    }


    return (
        <div className={classes.Friends}>

            <div className={classes.FriendsLeft}>
                <h2>My Friends</h2>
                {stateFriendsList && (
                    <div className={classes.list}>
                        {stateFriendsList.map((friendsList:any) => (
                            <div className={classes.friendsListElement} key={friendsList.id}>
                                <img src={getFriendsList(friendsList, "avatar")}/>
                                <p>{getFriendsList(friendsList, "username")}</p>
                                
                            </div>
                        ))}
                </div>
                )}
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
                                <div className={classes.friendsRequestsElement} key={friendsRequests.user}>
                                    <img src={getFriendsRequests(friendsRequests, "avatar")}/>
                                    <p>{getFriendsRequests(friendsRequests, "username")}</p>
                                    <button className={classes.accept} onClick={() => acceptRequest(friendsRequests)}>Accept</button>
                                    <button className={classes.refuse} onClick={() => refuseRequest(friendsRequests)}>Refuse</button>
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
