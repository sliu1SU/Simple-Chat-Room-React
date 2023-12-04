import {useEffect, useState} from 'react';
import './Error Msg.css';

// this component displays all chat msgs in a chat room
// NOTE: by design, once you enter this component, you cannot
// go back to the display room list component. This is implemented
// based on Prof. S demo
function DisplayChatMsgs(props) {
    const {roomName} = props;
    const [msgList, setMsgList] = useState([]);
    const [userInput, setUserInput] = useState("");
    const [error, setError] = useState("");

    // helper fn to add poster name and post date to the message array
    async function postprocessMsgList(msgList) {
        // get all users first
        const url = "api/users";
        const response = await fetch(url);
        if (response.ok) {
            const userList = await response.json();
            // get all users via api call, then lookup the username
            // and convert the timestamp to actual date
            for (let i = 0; i < msgList.length; i++) {
                const id = msgList[i].posterId;
                msgList[i]["posterName"] = userList.find(({publicUserId}) => publicUserId === id).name;
                msgList[i]["date"] = new Date(Number(msgList[i].timestamp)).toLocaleString('en-US');
            }
        } else {
            await postprocessMsgList(msgList);
        }
    }

    // helper fn to get all the chat msgs in this room
    async function getAllTxt() {
        const url = "api/rooms/" + roomName + "/chats";
        const response = await fetch(url);
        if (response.ok) {
            const result  = await response.json(); // this will return an array of msgs
            // attach username and date for output purpose
            await postprocessMsgList(result);
            // call setter once postprocessing is done
            setMsgList(result);
        } else {
            await getAllTxt();
        }
    }

    // helper fn to handle sending one msg to the current chat room
    async function sendOneMsg() {
        const url = "api/rooms/" + roomName + "/chats";
        const data = {
            method: 'POST',
            body: userInput
        };
        const response = await fetch(url, data);
        if (response.ok) {
            setError("");
            // call this fn again to let react know to rerender the chat list
            await getAllTxt();
        } else {
            setError("ERROR: professor screwed up! please try again.");
        }
    }

    // call api once to fetch all existing msgs in this chat room at the beginning
    useEffect(() => {
        getAllTxt();
        // call the api to fetch all chat msgs every X seconds
        setInterval(getAllTxt, 3000);
    }, []);

    // react to render a list of msgs in this chat room
    return (
        <>
            <section className="show-msgs">
                <h1>Chat Room: {roomName}</h1>
                <ul>
                    {
                        msgList.map(msg => (
                            <li key={msg.timestamp}>
                                {msg.posterName} @ {msg.date}: {msg.messageText}
                            </li>
                        ))
                    }
                </ul>
            </section>
            <section className="new-chat-msg-input">
                <input id="new-msg-input" type="text"
                       onChange={event => setUserInput(event.target.value)} />
                <button id="send-new-msg-bt" onClick={sendOneMsg}>send</button>
            </section>
            <section className="error-message">{error}</section>
        </>
    )
}

export default DisplayChatMsgs;