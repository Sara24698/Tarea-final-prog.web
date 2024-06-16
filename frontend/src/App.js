import {Routes, Route, Link} from 'react-router-dom'
import CreateUserComponent from './Components/CreateUserComponent.js';
import LoginUserComponent from './Components/LoginUserComponent.js';
import PresentsComponent from './Components/PresentsComponent.js';
import CreatePresentsComponent from './Components/CreatePresentComponent.js';
import CreateFriendComponent from './Components/CreateFriendComponent.js';
import FriendsComponent from './Components/FriendsComponent.js';
import OnePresentComponent from './Components/OnePresentComponent.js';



let App = () => {
    return(
        <div className="App">
            <nav>
                <ul className='navbar'>
                    <li><Link to="/">Index</Link></li>
                    <li><Link to="/register">Register</Link></li>
                    <li><Link to="/login">Login</Link></li>
                    <li><Link to="/presents">My Presents</Link></li>
                    <li><Link to="/addpresent">Add present</Link></li>
                    <li><Link to="/addfriend">Add friend</Link></li>
                    <li><Link to="/friends">Friends</Link></li>

                </ul>

            </nav>
            <Routes>
                <Route path='/register' element={
                    <CreateUserComponent/>
                }></Route>

                <Route path='/login' element={
                    <LoginUserComponent/>
                }></Route>

                <Route path='/' element={
                    <p>Inicio</p>
                }></Route>

                <Route path='/presents' element={
                    <PresentsComponent/>
                }></Route>

                <Route path='/addpresent' element={ 
                    <CreatePresentsComponent/>
                }></Route>

                <Route path='/addfriend' element={ 
                    <CreateFriendComponent/>
                }></Route>

                <Route path='/friends' element={ 
                    <FriendsComponent/>
                }></Route>

                <Route path='/present/:presentId' element={ 
                    <OnePresentComponent/>
                }></Route>



            </Routes>
        </div>
    );
}


export default App;