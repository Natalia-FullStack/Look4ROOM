import './App.css';
import { Route, Routes } from 'react-router-dom';
import Home from './views/Home';
import { ChakraProvider } from '@chakra-ui/react';
import { NextUIProvider } from '@nextui-org/react';

import Error404 from './views/Error404';
import Habitacion from './views/Habitacion.js';
import { Resultados } from './views/Resultados';
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
        <Route path='habitacion/:idHabitacion' element={<Habitacion/>} />
        <Route path='results/:searchTerm' element={<Resultados/>} />
        </Routes>

      </NextUIProvider>
      </ChakraProvider>

    </div>
  );
}

export default App;
