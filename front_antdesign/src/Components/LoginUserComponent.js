import { useEffect, useState } from "react";
import { backendURL } from "../Globals";
import { useNavigate } from "react-router-dom";
import { Button, Card, Col, Input, Row, Typography, Alert } from "antd";
let {Text} = Typography;


let LoginUserComponent = (props) => {
    let {setLogin}=props;

    let [email, setEmail] = useState(null)
    let [password, setPassword] = useState(null)
    let [message, setMessage] = useState("")
    let [error, setError] = useState({})
    let navigate = useNavigate();
    let code_email = /^[-\w.%+]{1,64}@(?:[A-Z0-9-]{1,63}\.){1,125}[A-Z]{2,63}$/i


    useEffect(() =>{
        checkErrors();
    }, [email, password])


    let checkErrors = () =>{
        let updatedErrors = {}

        if(email === "" || (email !== null && code_email.test(email) === false)){
            updatedErrors.email = "No email or incorrect email format"
        }

        if(password === "" || password?.length <5){
            updatedErrors.password = "Password must be 5 characters long"
        }

        setError(updatedErrors)

    }


    let changeEmail = (e) => {
        setEmail(e.currentTarget.value)
    }

    let changePassword = (e) => {
        setPassword(e.currentTarget.value)
    }

    let clickLogin= async() => {
        let response = await fetch(backendURL+"/users/login",{
            method:"POST",
            headers: {"Content-Type": "application/json"},
            body: JSON.stringify({
                email: email,
                password: password
            })
        })

        if(response.ok){
            let jsonData = await response.json();
            if(jsonData.apiKey!=null){
                localStorage.setItem("apiKey", jsonData.apiKey)
                localStorage.setItem("id", jsonData.id)
                localStorage.setItem("email", jsonData.email)
            }
            setLogin(true)
            navigate("/")
        } else{
            let jsonData = await response.json();
            setMessage(jsonData.error)
        }
    }

    return(
        <Row align="middle" justify="center" style={{minHeight: "70vh"}}>
            <Col >
            {message !="" && <Alert type="error" message={message}/>}
                <Card title="Login" style={{minWidth: "300px", maxWidth:"500px", textAlign:"center"}}>
                    <Input size="large" style={{marginBottom: "10px"}} type="text" placeholder="Your email" onChange={changeEmail}/>
                    {error.email && <Text type="danger">{error.email}</Text>}
                    <Input size="large" style={{marginBottom: "10px"}} type="password" placeholder="Your password" onChange={changePassword}/>
                    {error.password && <Text type="danger">{error.password}</Text>}

                    <Button type="primary"  onClick={clickLogin} >Login</Button>
                    
                </Card>
            </Col>
        </Row>
    )
}


export default LoginUserComponent;