import { useEffect, useState } from "react";
import { backendURL } from "../Globals";
import { useNavigate } from "react-router-dom";


let CreateUserComponent = (props) => {
    let {createNotification}=props;

    let [name, setName] = useState(null)
    let [email, setEmail] = useState(null)
    let [password, setPassword] = useState(null)
    let [message, setMessage] = useState("")
    let [error, setError] = useState({})
    let navigate = useNavigate();

    let code_email = /^[-\w.%+]{1,64}@(?:[A-Z0-9-]{1,63}\.){1,125}[A-Z]{2,63}$/i

    useEffect(() =>{
        checkErrors();
    }, [name, email, password])


    let checkErrors = () =>{
        let updatedErrors = {}

        if(name === "" ){
            updatedErrors.name = "No name introduced"
        }

        if(email === "" || code_email.test(email) === false){
            updatedErrors.email = "Incorrect email format"
        }

        if(password === "" || password?.length <5){
            updatedErrors.password = "Password must be 5 characters long"
        }

        setError(updatedErrors)

    }


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
            createNotification("User created successfully")
            navigate("/login")
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
                {error.name && <p className="errorform">{error.name}</p>}

                <div className="form-group">
                    <input type="text" placeholder="Your email" onChange={changeEmail}/>
                </div>
                {error.email && <p className="errorform">{error.email}</p>}
                <div>
                    <input type="password" placeholder="Your password" onChange={changePassword}/>
                </div>
                {error.password && <p className="errorform">{error.password}</p>}
                <button onClick={clickCreate}>Create Account</button>
            </div>
        </div>
    )
}


export default CreateUserComponent;