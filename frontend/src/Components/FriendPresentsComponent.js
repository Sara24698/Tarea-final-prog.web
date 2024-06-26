import { useEffect, useState } from "react"
import { backendURL } from "../Globals"
import { useNavigate, useParams } from "react-router-dom"


let FriendPresentsComponent = (props) =>{
    let {createNotification}=props;

    let [presents, setPresents] = useState([])
    let [message, setMessage] = useState("")
    let {email} = useParams();
    let navigate=useNavigate()


    useEffect(() =>{
        getPresents();
    }, [])

    let getPresents = async() => {
        let response = await fetch(backendURL+"/presents?email="+email+"&apiKey="+localStorage.getItem("apiKey"))

        if(response.status===401){
            navigate("/login")
            return
        }

        if(response.ok){
            let jsonData = await response.json()
            setPresents(jsonData)
        } else{
            let jsonData = await response.json()
            setMessage(jsonData.error)
        }
    }

    let buyPresent = async(id) => {
        let response = await fetch(backendURL+"/presents/"+id+"?apiKey="+localStorage.getItem("apiKey"),{
            method: "PUT"
        })

        if(response.status===401){
            navigate("/login")
            return
        }

        if(response.ok){
            createNotification("Present reserved")
            navigate("/friends/")


        } else{
            let jsonData = await response.json()
            setMessage(jsonData.error)
        }
    }





    return(
        <div className="main-container">
            <h2>Friend presents</h2>
            {message !== "" && <h3 className="errorMessage">{message}</h3>}

            <div class="item-class">
                {presents.map(presents =>
                    (   
                        <div>
                            <h3>{presents.name}</h3>
                                <p className="detalles">Description: {presents.description}</p>
                                <p className="detalles">URL: {presents.URL}</p>
                                <p className="detalles">Price: {presents.price}</p>
                                <p className="detalles">Chosen by: {presents.ChosenBy}</p>
                                <button className="butpresents" onClick={()=> {buyPresent(presents.id)}}>Buy</button>
                        </div>
                        
                        
                        
                    )
                )}


            </div>
        </div>
    )
}





export default FriendPresentsComponent