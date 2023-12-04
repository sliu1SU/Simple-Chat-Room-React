/*
HOMEWORK 4 CHAT APP
SIZHE LIU
NOTE:
- this is client side implementation
- this chat app is implemented in the exact same way as Prof.Spinney video demo on canvas
(please refer to the homework 4 link on canvas page). This means once you enter a chat room,
you CANNOT get out of this chat room.
- API calls can fail randomly due to Prof's server implementation. Therefore,
the chat message and room list auto-refresh will sometime render the contents to be empty or
missing. This is not an issue. Auto-refresh will quickly refresh the page for every X seconds.
- run server first before running client side react app.
- sometimes the server will crash for unknown reason, this is most likely caused by cookie.
If it happens, the page will become empty. Simply close your browser, restart server and client
should solve the problem.
 */

import { useState, useEffect } from 'react'
import './App.css'
import DisplayRoomList from "./DisplayRoomList.jsx";
import DisplayChatMsgs from "./DisplayChatMsgs.jsx";
import UserInfo from "./UserInfo.jsx";

// this is the starting point of our chat app
// the highest level component
function App() {
  const [roomName, setRoomName] = useState("");
  const [username, setUsername] = useState("default");

  // helper fn to extract the current userId from browser cookie
  function getCookieValue(key) {
    const cookies = document.cookie.split(';');
    for (let i = 0; i < cookies.length; i++) {
      const cookie = cookies[i].trim();
      if (cookie.startsWith(key + '=')) {
        return cookie.substring(key.length + 1, cookie.length);
      }
    }
    return '';
  }

  // helper fn to look up username
  function lookupUsername(array) {
    const id = getCookieValue('publicUserId');
    for (let i = 0; i < array.length; i++) {
      if (array[i].publicUserId === id) {
        // found the user, return the current name
        return array[i].name;
      }
    }
    return '';
  }

  // call use effect to create a new user whenever app is called
  useEffect(() => {
    async function initializeUsername() {
      // do a get all users request in case shit happens
      const url = 'api/users';
      const response = await fetch(url);
      if (response.ok) {
        const result = await response.json();
        setUsername(lookupUsername(result));
      } else {
        // if bad request, call the fn again
        await initializeUsername();
      }
    }
    initializeUsername(); // call the fn i define
  }, []);

  // return statement
  if (roomName === "") {
    // this will return the room list
    return (
        <>
          <UserInfo username={username} setUsername={setUsername} />
          <DisplayRoomList setRoomName={setRoomName} />
        </>
    )
  } else {
    // this will return a specific chat room and all the chat msgs within it
    return (
        <>
          <UserInfo username={username} setUsername={setUsername} />
          <DisplayChatMsgs roomName={roomName} />
        </>
    )
  }
}

export default App