import './App.css';
import { Route, Routes } from 'react-router-dom';
import Login from './fragment/Login';
import Graficas from './fragment/Graficas';
import Principal from './fragment/Principal';
import Usuarios from './fragment/Usuarios';
import Perfil from './fragment/Perfil';
import Historial from './fragment/Historial';
import { Conocenos } from './fragment/Conocenos';
import Sensores from './fragment/Sensores';
import Layout from './layout';

function App() {
  return (
    <Layout>
      <Routes>
        <Route path='/' element={<Principal />} />
        <Route path='/iniciar-sesion' element={<Login />} />
        <Route path='/graficas' element={<Graficas />} />
        <Route path='/usuarios' element={<Usuarios />} />
        <Route path='/perfil' element={<Perfil />} />
        <Route path='/historial' element={<Historial />} />
        <Route path='/conocenos' element={<Conocenos />} />
        <Route path='/sensores' element={<Sensores />} />
      </Routes>
    </Layout>
  );
}

export default App;