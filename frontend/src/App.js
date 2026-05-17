import {Routes, Route} from 'react-router-dom';

import Login from './pages/login'
import Header from './compnonents/header';
import Error from './pages/Error.js';
import Main from './pages/main.js';

import { useContext } from 'react';
import { Auth } from './context/Auth.js';
  function App() {
    const { session } = useContext(Auth);
    return (
    <div className='App'>
        <Header />
        <Routes>
        <Route path="/" element={session ? <Main /> : <Login />} />
          <Route path={'*'} element={<Error />}/>
        </Routes>
      </div>  
    )
  }

export default App;