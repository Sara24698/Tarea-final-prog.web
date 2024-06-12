import {Routes, Route, Link} from 'react-router-dom'
import CreateUserComponent from './Components/CreateUserComponent.js';
import LoginUserComponent from './Components/LoginUserComponent.js';
import { useRef } from 'react';


let App = () => {
    return(
        <div className="App">
            <nav>
                <ul className='navbar'>
                    <li><Link to="/">Index</Link></li>
                    <li><Link to="/register">Register</Link></li>
                    <li><Link to="/login">Login</Link></li>
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
            </Routes>
        </div>
    );
}


export default App;