import { useEffect, useState } from "react"
import { backendURL } from "../Globals"
import { useNavigate, useParams } from "react-router-dom"
import { Card, List, Button, Col, Row, Descriptions, Typography, Alert } from "antd"

let {Text} = Typography;
let OnePresentComponent = () =>{

    let [present, setPresent] = useState({})
    let [message, setMessage] = useState("")
    let navigate = useNavigate();
    let {presentId} = useParams();


    useEffect(() =>{
        getPresents();
    }, [])

    let getPresents = async() => {
        let response = await fetch(backendURL+"/presents/"+presentId+"?apiKey="+localStorage.getItem("apiKey"))

        if(response.status==401){
            navigate("/login")
            return
        }

        if(response.ok){
            let jsonData = await response.json()
            setPresent(jsonData)
        } else{
            setMessage("Error")
        }
    }


    return(
        
        <Descriptions title={present.name}>
            {message !="" && <Alert type="error" message={message}/>}
            <Descriptions.Item label="Description">{present.description}</Descriptions.Item>
            <Descriptions.Item label="URL">{present.URL}</Descriptions.Item>
            <Descriptions.Item label="Price">{present.price}</Descriptions.Item>
        </Descriptions>
        
    )
}





export default OnePresentComponent