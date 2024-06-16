import { useEffect, useState } from "react"
import { backendURL } from "../Globals"


let FriendsComponent = () =>{
    let [friends, setFriends] = useState([])
    let [message, setMessage] = useState("")

    useEffect(() =>{
        getFriends();
    }, [])

    let getFriends = async() => {
        let response = await fetch(backendURL+"/friends?apiKey="+localStorage.getItem("apiKey"))

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
        if(response.ok){
            let updatedFriends=friends.filter(friend => friend.emailFriend !== emailFriend)
            setFriends(updatedFriends)

            let jsonData = await response.json();
            setMessage(jsonData.modifiyed)

        } else{
            let jsonData = await response.json();
            setMessage(jsonData.error)
        }

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
                        </div>
                    )
                )}

            </div>
        </div>
    )
}





export default FriendsComponent