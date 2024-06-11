import {Routes, Route, Link} from 'react-router-dom'
import CreateUserComponent from './Components/CreateUserComponent';
import { useRef } from 'react';


let App = () => {
    return(
        <div className="App">
            <nav>
                <ul className='navbar'>
                    <li>Index</li>
                    <li>Register</li>
                    <li>Login</li>
                </ul>

            </nav>
            <Routes>
                <Route path='/register' element={
                    <CreateUserComponent/>
                }></Route>

                <Route path='/login' element={
                    <p>Login</p>
                }></Route>

                <Route path='/' element={
                    <p>Inicio</p>
                }></Route>
            </Routes>
        </div>
    );
}


export default App;