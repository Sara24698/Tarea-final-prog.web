import { useEffect, useState } from "react"
import { backendURL } from "../Globals"
import {Link, useNavigate} from 'react-router-dom'


let FriendsComponent = (props) =>{
    let {createNotification}=props;

    let [friends, setFriends] = useState([])
    let [email, setEmail] = useState(null)
    let [message, setMessage] = useState("")
    let [error, setError] = useState({})
    let navigate = useNavigate()
    let code_email = /^[-\w.%+]{1,64}@(?:[A-Z0-9-]{1,63}\.){1,125}[A-Z]{2,63}$/i

    useEffect(() =>{
        getFriends();
    }, [])

    useEffect(() =>{
        checkErrors();
    }, [email])


    let checkErrors = () =>{
        let updatedErrors = {}

        if(email === "" || (email !== null && code_email.test(email) === false)){
            updatedErrors.email = "No email or incorrect email format"
        }

        setError(updatedErrors)

    }

    let getFriends = async() => {
        let response = await fetch(backendURL+"/friends?apiKey="+localStorage.getItem("apiKey"))

        if(response.status==401){
            navigate("/login")
            return
        }

        if(response.ok){
            let jsonData = await response.json()
            setFriends(jsonData)
            
        } else{
            let jsonData = await response.json()
            setMessage(jsonData.error)
        }
    }

    let deleteFriend = async(emailFriend) => {
        let response = await fetch(backendURL+"/friends/"+emailFriend+"?apiKey="+localStorage.getItem("apiKey"),{
            method:"DELETE"
        })

        if(response.status==401){
            navigate("/login")
            return
        }

        if(response.ok){
            let updatedFriends=friends.filter(friend => friend.emailFriend !== emailFriend)
            setFriends(updatedFriends)


            createNotification("Friend deleted")

        } else{
            let jsonData = await response.json();
            setMessage(jsonData.error)
        }

    }

    let addFriend= () =>{
        navigate("/addfriend/")
    }

    let seePresents= (emailFriend) =>{
        navigate("/friendpresents/"+emailFriend)
    }

    let changeEmail =(e) =>{
        setEmail(e.currentTarget.value)
    }


    return(
        <div className="main-container">
            <h2>Friends</h2>
            {message !== "" && <h3 className="errorMessage">{message}</h3>}

            <div className="center-box">
                <div className="form-group">
                    <input type="email" placeholder="Friend email" onChange={changeEmail}/>
                </div>
                {error.email && <p className="errorform">{error.email}</p>}
                <button onClick={()=> {seePresents(email)}}>See friend wishlist</button>

                {friends.map(friends =>
                    (
                        <div className ="items">
                            <p>{friends.emailFriend}</p>
  
                            
                            <button onClick={()=> {deleteFriend(friends.emailFriend)}}>Delete</button>
                            <button onClick={()=> {seePresents(friends.emailFriend)}}>See wishlist</button>
                        </div>
                        
                    )
                )}

                <button onClick={()=> {addFriend()}}>Add friend</button>

            </div>
        </div>
    )
}





export default FriendsComponent