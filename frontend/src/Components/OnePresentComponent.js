import { useEffect, useState } from "react"
import { backendURL } from "../Globals"
import { useParams } from "react-router-dom"


let OnePresentComponent = () =>{

    let [present, setPresent] = useState({})
    let [message, setMessage] = useState("")
    let {presentId} = useParams();


    useEffect(() =>{
        getPresents();
    }, [])

    let getPresents = async() => {
        let response = await fetch(backendURL+"/presents/"+presentId+"?apiKey="+localStorage.getItem("apiKey"))

        if(response.ok){
            let jsonData = await response.json()
            setPresent(jsonData)
        } else{
            setMessage("Error")
        }
    }


    return(
        <div>
            <h2>Present</h2>
            {message !== "" && <h3 className="errorMessage">{message}</h3>}

            <div class="item-class">
                <div className ="presents">
                    <h3>{present.name}</h3>
                    <p>{present.description}</p>
                    <p>{present.URL}</p>
                    <p>{present.price}</p>
                    <p>{present.ChosenBy}</p>
                </div>

            </div>
        </div>
    )
}





export default OnePresentComponent