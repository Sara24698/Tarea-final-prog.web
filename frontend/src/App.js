import {Routes, Route, Link} from 'react-router-dom'


let App = () => {
    return(
        <div className="App">
            <Routes>
                <Route path='/register' element={
                    <p>Register</p>
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