import { useEffect, useState } from "react";
import { backendURL } from "../Globals";
import { useNavigate } from "react-router-dom";



let CreateFriendComponent = (props) => {
    let {createNotification}=props;
    let [email, setEmail] = useState(null)
    let [message, setMessage] = useState("")
    let [error, setError] = useState({})
    let navigate = useNavigate();

    let code_email = /^[-\w.%+]{1,64}@(?:[A-Z0-9-]{1,63}\.){1,125}[A-Z]{2,63}$/i

    useEffect(() =>{
        checkLogin();
    }, [])
    
    useEffect(() =>{
        checkErrors();
    }, [email])

    let checkLogin = async() => {
        let response = await fetch(backendURL+"/presents?apiKey="+localStorage.getItem("apiKey"))

        if(response.status==401){
            navigate("/login")
            return
        }
    } 


    let checkErrors = () =>{
        let updatedErrors = {}

        if(email === "" || code_email.test(email) === false){
            updatedErrors.email = "No email or incorrect email format"
        }

        setError(updatedErrors)

    }


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
            createNotification("Friend registered successfully")
            navigate("/friends")


        } else{
            let jsonData = await response.json();
            setMessage(jsonData.error)
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
                {error.email && <p className="errorform">{error.email}</p>}

                <button onClick={clickCreate}>Add friend</button>
            </div>
        </div>
    )
}


export default CreateFriendComponent;