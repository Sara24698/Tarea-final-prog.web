import { useState } from "react";
import { backendURL } from "../Globals";



let CreateFriendComponent = () => {
    let [email, setEmail] = useState("")
    let [message, setMessage] = useState("")


    let changeEmail = (e) => {
        setEmail(e.currentTarget.value)

    }


    let clickCreate= async() => {
        let response = await fetch(backendURL+"/friends?apiKey="+localStorage.getItem("apiKey"),{
            method:"POST",
            headers: {"Content-Type": "application/json"},
            body: JSON.stringify({
                email: email
            })
        })

        if(response.ok){
            let jsonData = await response.json();
            setMessage("New friend added")
        } else{
            setMessage("Error")
        }
    }

    return(
        <div>
            <h2>Add friend</h2>
            <h3>{message}</h3>
            <div className="center-box">
                <div className="form-group">
                    <input type="email" placeholder="Email" onChange={changeEmail}/>
                </div>

                <button onClick={clickCreate}>Add friend</button>
            </div>
        </div>
    )
}


export default CreateFriendComponent;