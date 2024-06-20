import { useEffect, useState } from "react"
import { backendURL } from "../Globals"
import { useNavigate, useParams } from "react-router-dom"
import { Button, Card, Col, Input, Row, List, Typography, Alert } from "antd";
let {Text} = Typography;


let FriendPresentsComponent = (props) =>{
    let {createNotification}=props;

    let [presents, setPresents] = useState([])
    let [message, setMessage] = useState("")
    let {email} = useParams();
    let navigate=useNavigate()


    useEffect(() =>{
        getPresents();
    }, [])

    let getPresents = async() => {
        let response = await fetch(backendURL+"/presents?email="+email+"&apiKey="+localStorage.getItem("apiKey"))

        if(response.status===401){
            navigate("/login")
            return
        }

        if(response.ok){
            let jsonData = await response.json()
            setPresents(jsonData)
        } else{
            let jsonData = await response.json()
            setMessage(jsonData.error)
        }
    }

    let buyPresent = async(id) => {
        let response = await fetch(backendURL+"/presents/"+id+"?apiKey="+localStorage.getItem("apiKey"),{
            method: "PUT"
        })

        if(response.status===401){
            navigate("/login")
            return
        }

        if(response.ok){
            createNotification("success","Present reserved")
            navigate("/friends/")


        } else{
            let jsonData = await response.json()
            setMessage(jsonData.error)
        }
    }





    return(
        <>
            <h2>Friend Wishlist</h2>
            {message !="" && <Alert type="error" message={message}/>}
            
            <List grid={{
                gutter:16,
                xs:1,
                sm:2,
                md: 4,
                lg:4,
                xl:6,
                xxl:6
            }}
            
             dataSource={presents} renderItem={(present)=>(
                <List.Item>
                    <Card title={present.name} style={{textAlign:"center"}}>
                        <p>Description: {present.description}</p>
                        <p>URL: {present.URL}</p>
                        <p>Price: {present.price}</p>
                        <p>Chosen by: {present.ChosenBy}</p>  
                        <Button type="primary"  onClick={()=> {buyPresent(present.id)}}>Buy</Button> 
                    </Card>
                </List.Item>

            )}>


            </List>
                

            
        </>
    )
}





export default FriendPresentsComponent