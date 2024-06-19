import { useEffect, useState } from "react"
import { backendURL } from "../Globals"
import {Link, useNavigate} from 'react-router-dom'
import { Button, Card, Col, Input, Row, List, Typography, Alert } from "antd";
let {Text} = Typography;


let FriendsComponent = (props) =>{
    let {createNotification}=props;

    let [friends, setFriends] = useState([])
    let [email, setEmail] = useState(null)
    let [message, setMessage] = useState("")
    let [error, setError] = useState({})
    let navigate = useNavigate()
    let code_email = /^[-\w.%+]{1,64}@(?:[A-Z0-9-]{1,63}\.){1,125}[A-Z]{2,63}$/i

    useEffect(() =>{
        getFriends();
    }, [])

    useEffect(() =>{
        checkErrors();
    }, [email])


    let checkErrors = () =>{
        let updatedErrors = {}

        if(email === "" || (email !== null && code_email.test(email) === false)){
            updatedErrors.email = "No email or incorrect email format"
        }

        setError(updatedErrors)

    }

    let getFriends = async() => {
        let response = await fetch(backendURL+"/friends?apiKey="+localStorage.getItem("apiKey"))

        if(response.status==401){
            navigate("/login")
            return
        }

        if(response.ok){
            let jsonData = await response.json()
            setFriends(jsonData)
            
        } else{
            let jsonData = await response.json()
            setMessage(jsonData.error)
        }
    }

    let deleteFriend = async(emailFriend) => {
        let response = await fetch(backendURL+"/friends/"+emailFriend+"?apiKey="+localStorage.getItem("apiKey"),{
            method:"DELETE"
        })

        if(response.status==401){
            navigate("/login")
            return
        }

        if(response.ok){
            let updatedFriends=friends.filter(friend => friend.emailFriend !== emailFriend)
            setFriends(updatedFriends)


            createNotification("success","Friend deleted")

        } else{
            let jsonData = await response.json();
            setMessage(jsonData.error)
        }

    }

    let addFriend= () =>{
        navigate("/addfriend/")
    }

    let seePresents= (emailFriend) =>{
        navigate("/friendpresents/"+emailFriend)
    }

    let changeEmail =(e) =>{
        setEmail(e.currentTarget.value)
    }


    return(
        <>
            <h2>Friends</h2>
            {message !="" && <Alert type="error" message={message}/>}
            <Input size="large" style={{marginBottom: "10px"}} type="text" placeholder="Friend email" onChange={changeEmail}/>
            {error.email && <Text type="danger">{error.email}</Text>}
            <Button type="primary"   onClick={()=> {seePresents(email)}}>See friend wishlist</Button> 
            
            <List grid={{
                gutter:16,
                xs:1,
                sm:2,
                md: 4,
                lg:4,
                xl:6,
                xxl:6
            }}
            
             dataSource={friends} renderItem={(friend)=>(
                <List.Item>
                    <Card hoverable title={friend.emailFriend}>
                        <Button type="primary"  onClick={()=> {deleteFriend(friend.emailFriend)}} >Delete</Button> 
                        <Button type="primary" onClick={()=> {seePresents(friend.emailFriend)}}>See wishlist</Button>  
                    </Card>
                </List.Item>

            )}>


            </List>
                

            <Button type="primary" onClick={()=> {addFriend()}}>Add friend</Button>  

            
        </>
      
    )
}





export default FriendsComponent