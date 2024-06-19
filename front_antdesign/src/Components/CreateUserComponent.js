import { useEffect, useState } from "react";
import { backendURL } from "../Globals";
import { useNavigate } from "react-router-dom";
import { Button, Card, Col, Input, Row, Typography, Alert} from "antd";
let {Text} = Typography;


let CreateUserComponent = (props) => {
    let {createNotification}=props;

    let [name, setName] = useState(null)
    let [email, setEmail] = useState(null)
    let [password, setPassword] = useState(null)
    let [message, setMessage] = useState("")
    let [error, setError] = useState({})
    let navigate = useNavigate();

    let code_email = /^[-\w.%+]{1,64}@(?:[A-Z0-9-]{1,63}\.){1,125}[A-Z]{2,63}$/i

    useEffect(() =>{
        checkErrors();
    }, [name, email, password])


    let checkErrors = () =>{
        let updatedErrors = {}

        if(name === "" ){
            updatedErrors.name = "No name introduced"
        }

        if(email === "" || (email !== null && code_email.test(email) === false)){
            updatedErrors.email = "Incorrect email format"
        }

        if(password === "" || password?.length <5){
            updatedErrors.password = "Password must be 5 characters long"
        }

        setError(updatedErrors)

    }


    let changeName = (e) => {
        setName(e.currentTarget.value)
        console.log(name)
    }

    let changeEmail = (e) => {
        setEmail(e.currentTarget.value)
    }

    let changePassword = (e) => {
        setPassword(e.currentTarget.value)
    }

    let clickCreate= async() => {
        let response = await fetch(backendURL+"/users",{
            method:"POST",
            headers: {"Content-Type": "application/json"},
            body: JSON.stringify({
                name: name,
                email: email,
                password: password
            })
        })

        if(response.ok){
            let jsonData = await response.json();
            createNotification("success","User created successfully")
            navigate("/login")
        } else{
            let jsonData = await response.json();
            setMessage(jsonData.error)
        }
    }

    return(
        <Row align="middle" justify="center" style={{minHeight: "70vh"}}>
            <Col>
            {message !="" && <Alert type="error" message={message}/>}
                <Card title="Register" style={{minWidth: "300px", maxWidth:"500px", textAlign:"center"}}>
                    <Input size="large" style={{marginBottom: "10px"}} type="text" placeholder="Your name" onChange={changeName}/>
                    {error.name && <Text type="danger">{error.name}</Text>}
                    <Input size="large" style={{marginBottom: "10px"}} type="text" placeholder="Your email" onChange={changeEmail}/>
                    {error.email && <Text type="danger">{error.email}</Text>}
                    <Input size="large" style={{marginBottom: "10px"}} type="password" placeholder="Your password" onChange={changePassword}/>
                    {error.password && <Text type="danger">{error.password}</Text>}

                    <Button type="primary"  onClick={clickCreate} >Register</Button>
                
                </Card>
            </Col>
        </Row>
    )
}


export default CreateUserComponent;