import {Routes, Route, Link} from 'react-router-dom'
import CreateUserComponent from './Components/CreateUserComponent.js';
import LoginUserComponent from './Components/LoginUserComponent.js';
import PresentsComponent from './Components/PresentsComponent.js';
import CreatePresentsComponent from './Components/CreatePresentComponent.js';


let App = () => {
    return(
        <div className="App">
            <nav>
                <ul className='navbar'>
                    <li><Link to="/">Index</Link></li>
                    <li><Link to="/register">Register</Link></li>
                    <li><Link to="/login">Login</Link></li>
                    <li><Link to="/presents">My Presents</Link></li>
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
            </Routes>
        </div>
    );
}


export default App;