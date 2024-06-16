import { useState } from "react";
import { backendURL } from "../Globals";
import { useParams } from "react-router-dom";



let ModifyPresentComponent = () => {
    let [name, setName] = useState("")
    let [description, setDescription] = useState("")
    let [url, setURL] = useState("")
    let [price, setPrice] = useState("")
    let [message, setMessage] = useState("")

    let {id} = useParams();


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
            setMessage(jsonData.modifiyed)
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

                <div className="form-group">
                    <input type="text" placeholder="Description" onChange={changeDescription}/>
                </div>

                <div>
                    <input type="web" placeholder="URL" onChange={changeURL}/>
                </div>

                <div>
                    <input type="number" placeholder="Price" onChange={changePrice}/>
                </div>
                <button onClick={clickModify}>Save changes</button>
            </div>
        </div>
    )
}


export default ModifyPresentComponent;