import {useEffect, useState} from 'react'
import './Error Msg.css';

// this component displays the room list view
function DisplayRoomList(props) {
    const {setRoomName} = props
    const [rooms, setRooms] = useState([]);
    // these use states are here to hold user inputs (when new room is created)
    const [inputName, setInputName] = useState("");
    const [inputDes, setInputDes] = useState("");
    const [error, setError] = useState("");

    // some local vars to display static texts
    const titleName = 'room name: ';
    const titleDesc = 'room description: ';

    // helper fn to get all rooms in the DB
    async function getAllRooms() {
        const url = "api/rooms";
        const response = await fetch(url);
        if (response.ok) {
            setRooms(await response.json());
        } else {
            await getAllRooms();
        }
    }

    // helper fn to create a new room
    async function createOneRoom() {
        const url = 'api/rooms';
        const data = {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                name: inputName,
                description: inputDes
            })
        }
        const response = await fetch(url, data);
        if (response.ok) {
            setError("");
            // need to call the get all rooms again to update the rooms (array) so that
            // react will rerender this portion
            await getAllRooms();
        } else {
            setError("ERROR: professor screwed up! please try again.");
        }
    }

    // useEffect to exe once when this component is called
    // to fetch all rooms in the database
    useEffect(() => {
        getAllRooms()
        // call the api to fetch all chat rooms every X seconds
        setInterval(getAllRooms, 3000);
    }, []);

    return (
        <>
            <section className="room-list">
                <ul>
                    {
                        rooms.map(room => (
                            <li key={room.name}>
                                <a onClick={() => {
                                    // this will update the roomName state in app(), so that
                                    // app() will render a single chat room
                                    setRoomName(room.name)
                                }}>{room.name} - {room.description}</a>
                            </li>
                        ))
                    }
                </ul>
            </section>
            <section className="room-create">
                <label>
                    {titleName}
                    <input id="room-name-input" type="text" placeholder='enter room name here...'
                           onChange={event => setInputName(event.target.value)} />
                </label>
                <label>
                    {titleDesc}
                    <input id="room-decription-input" type="text" placeholder='enter description here...'
                           onChange={event => setInputDes(event.target.value)} />
                    <button id="submit-create-room-bt" onClick={createOneRoom}>create</button>
                </label>
            </section>
            <section className="error-message">{error}</section>
        </>
    )
}

export default DisplayRoomList;