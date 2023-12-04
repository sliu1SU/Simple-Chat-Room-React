import {useState} from "react";
import './Error Msg.css';

// this component is independent on room and chat msg
// this component is here to display username and the view associated with
// changing/updating username
function UserInfo(props) {
    const {username, setUsername} = props;
    const [inEdit, setInEdit] = useState(false);
    const [error, setError] = useState("");
    // some local vars here to display static texts
    const title = "Your Name: ";
    const title2 = 'new username name: ';

    // helper fn to change username
    async function changeUserName() {
        const url = 'api/account/name';
        const data = {
            method: 'PUT',
            body: username
        };
        // use fetch to call account api to update username
        const response = await fetch(url, data);
        if (response.ok) {
            setError("");
            // update the setInEdit var to tell react to re-render
            setInEdit(false);
        } else {
            setError("ERROR: professor screwed up! please try again.");
        }
    }

    if (!inEdit) {
        // display the username and edit button view
        return (
            <>
                <section className="username-display-edit">
                    {title}{username}
                    <button id="edit-username-bt" onClick={() => {setInEdit(true)}}>edit username</button>
                </section>
            </>
        )
    } else {
        // display the edit username view
        return (
            <>
                <section className="edit-username-view">
                    {title2}
                    <input id="username-input" type="text" name="username" placeholder='Enter your new username'
                           onChange={e => setUsername(e.target.value)} />
                    <button id="submit-username-change-bt" onClick={changeUserName}>save</button>
                </section>
                <section className="error-message">{error}</section>
            </>
        )
    }
}

export default UserInfo;