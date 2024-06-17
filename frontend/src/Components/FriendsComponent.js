import { useEffect, useState } from "react"
import { backendURL } from "../Globals"
import {Link, useNavigate} from 'react-router-dom'


let FriendsComponent = (props) =>{
    let {createNotification}=props;

    let [friends, setFriends] = useState([])
    let [message, setMessage] = useState("")
    let navigate = useNavigate()

    useEffect(() =>{
        getFriends();
    }, [])

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

            let jsonData = await response.json();
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


    return(
        <div>
            <h2>Friends</h2>
            {message !== "" && <h3 className="errorMessage">{message}</h3>}

            <div class="item-class">
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