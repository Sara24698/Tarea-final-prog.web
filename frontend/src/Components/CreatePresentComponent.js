import { useEffect, useState } from "react";
import { backendURL } from "../Globals";
import { useNavigate } from "react-router-dom";



let CreatePresentsComponent = (props) => {
    let {createNotification}=props;

    let [name, setName] = useState(null)
    let [description, setDescription] = useState(null)
    let [url, setURL] = useState(null)
    let [price, setPrice] = useState(null)
    let [message, setMessage] = useState(null)
    let [error, setError] = useState({})
    let navigate = useNavigate();

    useEffect(() =>{
        checkLogin();
    }, [])

    useEffect(() =>{
        checkErrors();
    }, [name, description, url, price])

    let checkLogin = async() => {
        let response = await fetch(backendURL+"/presents?apiKey="+localStorage.getItem("apiKey"))

        if(response.status==401){
            navigate("/login")
            return
        }
    } 


    let checkErrors = () =>{
        let updatedErrors = {}

        if(name === "" ){
            updatedErrors.name = "No name introduced"
        }

        if(description=== "" ){
            updatedErrors.description = "No description introduced"
        }

        if(url === "" ){
            updatedErrors.url = "No URL introduced"
        }

        if(price=== "" || (price !== null && price<= 0)){
            updatedErrors.price = "No valid price introduced"
        }

        setError(updatedErrors)

    }


    let changeName = (e) => {
        setName(e.currentTarget.value)
        console.log(name)
    }

    let changeDescription = (e) => {
        setDescription(e.currentTarget.value)
    }

    let changeURL= (e) => {
        setURL(e.currentTarget.value)
    }

    let changePrice= (e) => {
        setPrice(e.currentTarget.value)
    }

    let clickCreate= async() => {
        let response = await fetch(backendURL+"/presents?apiKey="+localStorage.getItem("apiKey"),{
            method:"POST",
            headers: {"Content-Type": "application/json"},
            body: JSON.stringify({
                name: name,
                description: description,
                url: url,
                price: price
            })
        })

        if(response.ok){
            let jsonData = await response.json();
            createNotification("Present added successfully")
            navigate("/presents")
        } else{
            setMessage("Error")
        }
    }

    return(
        <div>
            <h2>Add present</h2>
            <h3>{message}</h3>
            <div className="center-box">
                <div className="form-group">
                    <input type="text" placeholder="Name" onChange={changeName}/>
                </div>
                {error.name && <p className="errorform">{error.name}</p>}

                <div className="form-group">
                    <input type="text" placeholder="Description" onChange={changeDescription}/>
                </div>
                {error.description && <p className="errorform">{error.description}</p>}
                <div>
                    <input type="web" placeholder="URL" onChange={changeURL}/>
                </div>
                {error.url && <p className="errorform">{error.url}</p>}
                <div>
                    <input type="number" placeholder="Price" onChange={changePrice}/>
                </div>
                {error.price && <p className="errorform">{error.price}</p>}
                <button onClick={clickCreate}>Add present</button>
            </div>
        </div>
    )
}


export default CreatePresentsComponent;