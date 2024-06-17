import { useEffect, useState } from "react";
import { backendURL } from "../Globals";
import { useNavigate, useParams } from "react-router-dom";



let ModifyPresentComponent = (props) => {
    let {createNotification}=props;

    let [name, setName] = useState(null)
    let [description, setDescription] = useState(null)
    let [url, setURL] = useState(null)
    let [price, setPrice] = useState(null)
    let [message, setMessage] = useState(null)
    let [error, setError] = useState({})
    let navigate = useNavigate();

    let {id} = useParams();

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

        if(price=== "" || price<= 0){
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

    let clickModify= async() => {

        let response = await fetch(backendURL+"/presents/"+id+"?apiKey="+localStorage.getItem("apiKey"),{
            method:"PUT",
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
            createNotification("Present modifyed")
            navigate("/presents")
            
        } else{
            let jsonData = await response.json();
            setMessage(jsonData.error)
        }
    }

    return(
        <div>
            <h2>Modify present</h2>
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
                <button onClick={clickModify}>Save changes</button>
            </div>
        </div>
    )
}


export default ModifyPresentComponent;