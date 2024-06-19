import { useEffect, useState } from "react";
import { backendURL } from "../Globals";
import { useNavigate } from "react-router-dom";
import { Alert, Button, Card, Col, Input, Row, Typography} from "antd";


let {Text} = Typography;


let CreateFriendComponent = (props) => {
    let {createNotification}=props;
    let [email, setEmail] = useState(null)
    let [message, setMessage] = useState("")
    let [error, setError] = useState({})
    let navigate = useNavigate();

    let code_email = /^[-\w.%+]{1,64}@(?:[A-Z0-9-]{1,63}\.){1,125}[A-Z]{2,63}$/i

    useEffect(() =>{
        checkLogin();
    }, [])
    
    useEffect(() =>{
        checkErrors();
    }, [email])

    let checkLogin = async() => {
        let response = await fetch(backendURL+"/presents?apiKey="+localStorage.getItem("apiKey"))

        if(response.status==401){
            navigate("/login")
            return
        }
    } 


    let checkErrors = () =>{
        let updatedErrors = {}

        if(email === "" || code_email.test(email) === false){
            updatedErrors.email = "No email or incorrect email format"
        }

        setError(updatedErrors)

    }


    let changeEmail = (e) => {
        setEmail(e.currentTarget.value)

    }


    let clickCreate= async() => {
        let response = await fetch(backendURL+"/friends?apiKey="+localStorage.getItem("apiKey"),{
            method:"POST",
            headers: {"Content-Type": "application/json"},
            body: JSON.stringify({
                email: email
            })
        })

        if(response.ok){
            let jsonData = await response.json();
            createNotification("success","Friend registered successfully")
            navigate("/friends")


        } else{
            let jsonData = await response.json();
            setMessage(jsonData.error)
        }
    }

    return(
        <Row align="middle" justify="center" style={{minHeight: "70vh"}}>
            <Col>
                {message !="" && <Alert type="error" message={message}/>}
                <Card title="Add friend" style={{minWidth: "300px", maxWidth:"500px", textAlign:"center"}}>
                    <Input size="large" style={{marginBottom: "10px"}} type="text" placeholder="Friend email" onChange={changeEmail}/>
                    {error.email && <Text type="danger">{error.email}</Text>}
                    <Button type="primary"  onClick={clickCreate} >Add friend</Button>
                
                </Card>
            </Col>
        </Row>
    )
}


export default CreateFriendComponent;