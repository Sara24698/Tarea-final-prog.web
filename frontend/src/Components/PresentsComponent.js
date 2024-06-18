import { useEffect, useState } from "react"
import { backendURL } from "../Globals"
import { Link, useNavigate } from "react-router-dom"


let PresentsComponent = (props) =>{
    let {createNotification}=props;

    let [presents, setPresents] = useState([])
    let [message, setMessage] = useState("")
    let navigate=useNavigate()

    useEffect(() =>{
        getPresents();
    }, [])

    let getPresents = async() => {
        let response = await fetch(backendURL+"/presents?apiKey="+localStorage.getItem("apiKey"))

        if(response.status==401){
            navigate("/login")
            return
        }

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

        if(response.status==401){
            navigate("/login")
            return
        }


        if(response.ok){
            let updatedPresents=presents.filter(present => present.id !== id)
            setPresents(updatedPresents)

            let jsonData = await response.json();
            createNotification("Present deleted")

        } else{
            let jsonData = await response.json();
            setMessage(jsonData.error)
        }

    }

    let ModifyPresent= (id) =>{
        navigate("/modifypresent/"+id)
    }

    let addPresent= () =>{
        navigate("/addpresent/")
    }

    return(
        <div>
            <h2>Presents</h2>
            {message !== "" && <h3 className="errorMessage">{message}</h3>}
                {presents.map(presents =>
                    (   
                        
                    <div className="item-class">
                        <Link to={"/present/"+presents.id}>
                        <h3 className="presents">{presents.name}</h3>
                        </Link>
                            <p className="detalles">Description: {presents.description}</p>
                            <p className="detalles">URL: {presents.URL}</p>
                            <p className="detalles">Price: {presents.price}</p>
                            <p className="detalles">Chosen by: {presents.ChosenBy}</p>
                            <button className="butpresents" onClick={()=> {deletePresent(presents.id)}}>Delete</button>
                            <button className="butpresents" onClick={()=>{ModifyPresent(presents.id)}}>Modify present</button>
                    </div>
                        
                        
                        
                    )
                )}

            <div className="item-class">
                <button className="butpresents" onClick={()=> {addPresent()}}>Add present</button>  
            </div>

            
        </div>
    )
}





export default PresentsComponent