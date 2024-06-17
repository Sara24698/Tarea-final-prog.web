import { useEffect, useState } from "react";
import { backendURL } from "../Globals";
import { useNavigate } from "react-router-dom";


let LoginUserComponent = (props) => {
    let {setLogin}=props;

    let [email, setEmail] = useState(null)
    let [password, setPassword] = useState(null)
    let [message, setMessage] = useState("")
    let [error, setError] = useState({})
    let navigate = useNavigate();
    let code_email = /^[-\w.%+]{1,64}@(?:[A-Z0-9-]{1,63}\.){1,125}[A-Z]{2,63}$/i


    useEffect(() =>{
        checkErrors();
    }, [email, password])


    let checkErrors = () =>{
        let updatedErrors = {}

        if(email === "" || code_email.test(email) === false){
            updatedErrors.email = "No email or incorrect email format"
        }

        if(password === "" || password?.length <5){
            updatedErrors.password = "Password must be 5 characters long"
        }

        setError(updatedErrors)

    }


    let changeEmail = (e) => {
        setEmail(e.currentTarget.value)
    }

    let changePassword = (e) => {
        setPassword(e.currentTarget.value)
    }

    let clickLogin= async() => {
        let response = await fetch(backendURL+"/users/login",{
            method:"POST",
            headers: {"Content-Type": "application/json"},
            body: JSON.stringify({
                email: email,
                password: password
            })
        })

        if(response.ok){
            let jsonData = await response.json();
            if(jsonData.apiKey!=null){
                localStorage.setItem("apiKey", jsonData.apiKey)
                localStorage.setItem("id", jsonData.id)
                localStorage.setItem("email", jsonData.email)
            }
            setLogin(true)
            navigate("/")
        } else{
            let jsonData = await response.json();
            setMessage(jsonData.error)
        }
    }

    return(
        <div>
            <h2>Login user</h2>
            {message !== "" && <h3 className="errorMessage">{message}</h3>}
            <div className="center-box">
                <div className="form-group">
                    <input type="text" placeholder="Your email" onChange={changeEmail}/>
                </div>
                {error.email && <p className="errorform">{error.email}</p>}

                <div>
                    <input type="password" placeholder="Your password" onChange={changePassword}/>
                </div>
                {error.password && <p className="errorform">{error.password}</p>}
                <button onClick={clickLogin}>Login</button>
            </div>
        </div>
    )
}


export default LoginUserComponent;