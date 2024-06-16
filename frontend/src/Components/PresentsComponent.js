import { useEffect, useState } from "react"
import { backendURL } from "../Globals"
import { Link } from "react-router-dom"


let PresentsComponent = () =>{

    let [presents, setPresents] = useState([])
    let [message, setMessage] = useState("")

    useEffect(() =>{
        getPresents();
    }, [])

    let getPresents = async() => {
        let response = await fetch(backendURL+"/presents?apiKey="+localStorage.getItem("apiKey"))

        if(response.ok){
            let jsonData = await response.json()
            setPresents(jsonData)
        } else{
            setMessage("Error")
        }
    }


    let deletePresent = async(id) => {
        let response = await fetch(backendURL+"/presents/"+id+"?apiKey="+localStorage.getItem("apiKey"),{
            method:"DELETE"
        })
        if(response.ok){
            let updatedPresents=presents.filter(present => present.id !== id)
            setPresents(updatedPresents)

            let jsonData = await response.json();
            setMessage(jsonData.modifiyed)

        } else{
            let jsonData = await response.json();
            setMessage(jsonData.error)
        }

    }

    return(
        <div>
            <h2>Presents</h2>
            {message !== "" && <h3 className="errorMessage">{message}</h3>}

            <div class="item-class">
                {presents.map(presents =>
                    (   
                        
                    <div className ="presents">
                        <Link to={"/present/"+presents.id}>
                        <h3>{presents.name}</h3>
                        </Link>
                            <p>{presents.description}</p>
                            <p>{presents.URL}</p>
                            <p>{presents.price}</p>
                            <p>{presents.ChosenBy}</p>
                            <button onClick={()=> {deletePresent(presents.id)}}>Delete</button>
                    </div>
                        
                        
                        
                    )
                )}

            </div>
        </div>
    )
}





export default PresentsComponent