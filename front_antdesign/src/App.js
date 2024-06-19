import {Routes, Route, Link} from 'react-router-dom'
import CreateUserComponent from './Components/CreateUserComponent.js';
import LoginUserComponent from './Components/LoginUserComponent.js';
import PresentsComponent from './Components/PresentsComponent.js';
import CreatePresentsComponent from './Components/CreatePresentComponent.js';
import CreateFriendComponent from './Components/CreateFriendComponent.js';
import FriendsComponent from './Components/FriendsComponent.js';
import OnePresentComponent from './Components/OnePresentComponent.js';
import { useEffect, useState } from 'react';
import { backendURL } from './Globals.js';
import ModifyPresentComponent from './Components/ModifyPresentComponent.js';
import FriendPresentsComponent from './Components/FriendPresentsComponent.js';
import 'antd/dist/reset.css'

import IndexComponent from './Components/IndexComponent.js';
import {Layout, Menu, notification} from 'antd'
import { Content, Footer, Header } from 'antd/es/layout/layout.js';


let App = () => {
    const [api, contextHolder] = notification.useNotification()

    let [login, setLogin] = useState(false)


    useEffect(() =>{
        checkLogin();
    }, [])

    let createNotification = (type="info", msg, placement="top") =>{
       api[type]({
        message: msg,
        description: msg,
        placement
       })
    }

    let checkLogin = async() => {
        let response = await fetch(backendURL+"/presents?apiKey="+localStorage.getItem("apiKey"))

        if(response.ok){
            setLogin(true)
        } else{
            setLogin(false)
        }
    }

    let disconnect = async() => {
        await fetch (backendURL+"/users/disconnect)apiKey="+localStorage.getItem("apiKey"),{
            method: "POST"
        })

        localStorage.removeItem("apiKey")
        setLogin(false)


    }

    return(
        <>
        {contextHolder}
        <Layout className='layout' style={{minHeight: '100vh' }}>
            <Header>
            { !login && (
                <Menu theme='dark' mode='horizontal' items={[
                    {key: "menuRegister", label: <Link to="/register">Register</Link>},
                    {key: "menuLogin", label: <Link to="/login">Login</Link>},

                ]}>
            
                </Menu> 

            )}

            { login && (
                <Menu theme='dark' mode='horizontal' items={[
                    {key: "menuPresents", label:<Link to="/presents">My Presents</Link>},
                    {key: "menuFriends", label:<Link to="/friends">My Friends</Link>},
                    {key: "menuDisconnect", label:<Link to="/" onClick={disconnect}>Disconnect</Link>},

                ]}>
            
                </Menu> 

            )}

                     
        </Header>


        <Content style={{padding: '20px 50px'}}>
            <Routes>
                <Route path='/register' element={
                    <CreateUserComponent createNotification={createNotification}/>
                }></Route>

                <Route path='/login' element={
                    <LoginUserComponent  setLogin = {setLogin} />
                }></Route>

                <Route path='/' element={
                    <IndexComponent/>
                }></Route>

                <Route path='/presents' element={
                    <PresentsComponent createNotification={createNotification}/>
                }></Route>

                <Route path='/addpresent' element={ 
                    <CreatePresentsComponent createNotification={createNotification}/>
                }></Route>

                <Route path='/addfriend' element={ 
                    <CreateFriendComponent createNotification={createNotification}/>
                }></Route>

                <Route path='/friends' element={ 
                    <FriendsComponent createNotification={createNotification}/>
                }></Route>

                <Route path='/present/:presentId' element={ 
                    <OnePresentComponent/>
                }></Route>

                <Route path='/modifypresent/:id' element={ 
                    <ModifyPresentComponent createNotification={createNotification}/>
                }></Route>

                <Route path='/friendpresents/:email' element={ 
                    <FriendPresentsComponent createNotification={createNotification}/>
                }></Route>





            </Routes>
            </Content>
            <Footer style={{textAlign: "center"}}>Gift manager 2024</Footer>
        </Layout>
        </>
    );
}


export default App;