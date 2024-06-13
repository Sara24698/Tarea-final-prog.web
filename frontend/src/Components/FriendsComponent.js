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
            setMessage("Error")
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
                        </div>
                    )
                )}

            </div>
        </div>
    )
}





export default FriendsComponent