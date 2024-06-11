import { useState } from "react";


let CreateUserComponent = () => {
    let [email, setEmail] = useState("")
    let [password, setPassword] = useState("")

    let changeEmail = (e) => {
        setEmail(e.currentTarget.value)
    }

    let changePassword = (e) => {
        setPassword(e.currentTarget.value)
    }

    let clickCreate= () => {
        
    }

    return(
        <div>
            <h2>Register user</h2>
            <div className="center-box">
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