import './App.css';
import { AuthProvider } from './auth/authContext';
import { Route, Routes } from 'react-router-dom';
import Home from './views/Home';
import Profile from './views/Profile';
import Publish from './views/Publish';
import { ChakraProvider } from '@chakra-ui/react';
import { NextUIProvider } from '@nextui-org/react';

import Error404 from './views/Error404';
import Habitacion from './views/Habitacion.js';
import { Resultados } from './views/Resultados';
import Edit from './views/Edit';
import Register from './views/Register';
function App() {
  return (
    <div>
             

      <ChakraProvider>
    <NextUIProvider>
        
        <Routes>
        <Route path="/" element={<Home/>}/>
        <Route path='register' element={<Register/>}/>
        <Route path="*" element={<Error404/>}/>
        <Route path="profile" element={<Profile/>}/>
        <Route path="publicar" element={<Publish/>} />
        <Route path='habitacion/:idHabitacion' element={<Habitacion/>} />
        <Route path='results/:searchTerm' element={<Resultados/>} />
        <Route path='edit/:idHabitacion' element={<Edit/>} />
        </Routes>

      </NextUIProvider>
      </ChakraProvider>

    </div>
  );
}

export default App;