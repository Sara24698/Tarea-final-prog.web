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

import './App.css';
import IndexComponent from './Components/IndexComponent.js';



let App = () => {
    let [notification, setNotification] = useState("");
    let [login, setLogin] = useState(false)


    useEffect(() =>{
        checkLogin();
    }, [])

    let createNotification = (msg) =>{
        setNotification(msg);
        setTimeout(()=>{
            setNotification("");
        }, 3000)
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
        <div>
            <nav>
                <ul className='navbar'>
                    <li><Link to="/">Index</Link></li>
                    { !login && <li><Link to="/register">Register</Link></li>}
                    { !login &&<li><Link to="/login">Login</Link></li>}
                    {login && <li><Link to="/presents">My Presents</Link></li>}
                    {login &&<li><Link to="/friends">Friends</Link></li>}
                    {login &&<li><Link to="/" onClick={disconnect}>Disconnect</Link></li>}
                    <li className='Title'>Gift Manager</li>
                </ul>
            </nav>

        {notification !== "" && (
            <div className='notification'>
                {notification}
                <span className='close-btn' onClick={()=>{setNotification("")}}>X</span>
            </div>
        ) }


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
        </div>
    );
}


export default App;