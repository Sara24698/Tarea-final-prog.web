import { useState } from "react";
import { backendURL } from "../Globals";


let CreateUserComponent = () => {
    let [name, setName] = useState("")
    let [email, setEmail] = useState("")
    let [password, setPassword] = useState("")
    let [message, setMessage] = useState("")


    let changeName = (e) => {
        setName(e.currentTarget.value)
        console.log(name)
    }

    let changeEmail = (e) => {
        setEmail(e.currentTarget.value)
    }

    let changePassword = (e) => {
        setPassword(e.currentTarget.value)
    }

    let clickCreate= async() => {
        let response = await fetch(backendURL+"/users",{
            method:"POST",
            headers: {"Content-Type": "application/json"},
            body: JSON.stringify({
                name: name,
                email: email,
                password: password
            })
        })

        if(response.ok){
            let jsonData = await response.json();
            setMessage(jsonData.inserted)
        } else{
            let jsonData = await response.json();
            setMessage(jsonData.error)
        }
    }

    return(
        <div>
            <h2>Register user</h2>
            <h3>{message}</h3>
            <div className="center-box">
                <div className="form-group">
                    <input type="text" placeholder="Your name" onChange={changeName}/>
                </div>

                <div className="form-group">
                    <input type="text" placeholder="Your email" onChange={changeEmail}/>
                </div>

                <div>
                    <input type="password" placeholder="Your password" onChange={changePassword}/>
                </div>
                <button onClick={clickCreate}>Create Account</button>
            </div>
        </div>
    )
}


export default CreateUserComponent;