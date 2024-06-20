import { useEffect, useState } from "react";
import { backendURL } from "../Globals";
import { useNavigate } from "react-router-dom";
import { Button, Card, Col, Input, Row, Typography, Alert} from "antd";
let {Text} = Typography;



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
            createNotification("success","Present added successfully")
            navigate("/presents")
        } else{
            setMessage("Error")
        }
    }

    return(
        <Row align="middle" justify="center" style={{minHeight: "70vh"}}>
            <Col >
            {message !="" && <Alert type="error" message={message}/>}
                <Card title="Create present" style={{minWidth: "300px", maxWidth:"500px", textAlign:"center"}}>
                    <Input size="large" style={{marginBottom: "10px"}} type="text" placeholder="Name" onChange={changeName}/>
                    {error.name && <Text type="danger">{error.name}</Text>}
                    <Input size="large" style={{marginBottom: "10px"}} type="text" placeholder="Description" onChange={changeDescription}/>
                    {error.description && <Text type="danger">{error.description}</Text>}
                    <Input size="large" style={{marginBottom: "10px"}} type="text" placeholder="URL" onChange={changeURL}/>
                    {error.url && <Text type="danger">{error.url}</Text>}
                    <Input size="large" style={{marginBottom: "10px"}} type="number" placeholder="Price" onChange={changePrice}/>
                    {error.price && <Text type="danger">{error.price}</Text>}

                    <Button type="primary"  onClick={clickCreate} >Add Present</Button>
                    
                </Card>
            </Col>
        </Row>
    )
}


export default CreatePresentsComponent;