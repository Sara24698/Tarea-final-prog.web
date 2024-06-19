import { useEffect, useState } from "react"
import { backendURL } from "../Globals"
import { Link, useNavigate } from "react-router-dom"
import { Card, List, Button, Table, Typography, Alert } from "antd"

let {Text} = Typography;

let PresentsComponent = (props) =>{
    let {createNotification}=props;

    let [presents, setPresents] = useState([])
    let [message, setMessage] = useState("")
    let navigate=useNavigate()

    useEffect(() =>{
        getPresents();
    }, [])

    let getPresents = async() => {
        let response = await fetch(backendURL+"/presents?apiKey="+localStorage.getItem("apiKey"))

        if(response.status==401){
            navigate("/login")
            return
        }

        if(response.ok){
            let jsonData = await response.json()
            setPresents(jsonData)
        } else{
            setMessage("Error")
        }
    }


    let deletePresent = async(id) => {
        let response = await fetch(backendURL+"/presents/"+id+"?apiKey="+localStorage.getItem("apiKey"),{
            method:"DELETE"
        })

        if(response.status==401){
            navigate("/login")
            return
        }


        if(response.ok){
            let updatedPresents=presents.filter(present => present.id !== id)
            setPresents(updatedPresents)

            let jsonData = await response.json();
            createNotification("success","Present deleted")

        } else{
            let jsonData = await response.json();
            setMessage(jsonData.error)
        }

    }

    let ModifyPresent= (id) =>{
        navigate("/modifypresent/"+id)
    }

    let addPresent= () =>{
        navigate("/addpresent/")
    }

    let onePresent= (id) =>{
        navigate("/present/"+id)
    }


    let columns =[
        {
            title: "Name",
            dataIndex: "name"


        },

        {
            title: "Description",
            dataIndex: "description"

        },

        {
            title: "URL",
            dataIndex: "URL"

        },

        {
            title: "Price",
            dataIndex: "price"

        },

        {
            title: "",
            dataIndex: "id",
            render:(id) => <Button type="primary"   onClick={()=> {onePresent(id)}}>Ver detalles</Button> 

        },

        {
            title: "",
            dataIndex: "id",
            render:(id) => <Button type="primary"   onClick={()=> {deletePresent(id)}}>Delete</Button> 

        },

        {
            title: "",
            dataIndex: "id",
            render:(id) => <Button type="primary"   onClick={()=>{ModifyPresent(id)}}>Modify present</Button> 

        }
    ]


    return(
        <>
            <h2>Presents</h2>
            {message !="" && <Alert type="error" message={message}/>}
            <Table columns={columns} dataSource={presents}/>

            
        </>
    )
}





export default PresentsComponent