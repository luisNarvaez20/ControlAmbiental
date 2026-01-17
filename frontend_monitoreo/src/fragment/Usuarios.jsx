import React, { useState, useEffect } from 'react';
import BarraMenu from './BarraMenu';
import { PeticionGet } from '../hooks/Conexion';
import CambiarEstado from './CambiarEstado';
import 'bootstrap/dist/css/bootstrap.min.css';
import { Modal } from 'react-bootstrap';
import { getToken } from '../utilidades/Sessionutil';

const Usuarios = () => {
  const [usuarios, setUsuarios] = useState([]);
  const [filtro, setFiltro] = useState('aceptado');
  const [selectedUsuario, setSelectedUsuario] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const token = getToken();

  useEffect(() => {
    const fetchUsuarios = async () => {
      try {
        let url;
        switch (filtro) {
          case 'aceptado':
            url = 'persona/aceptado';
            break;
          case 'espera':
            url = 'persona/espera';
            break;
          case 'rechazado':
            url = 'persona/rechazado';
            break;
          default:
            const aceptados = await PeticionGet(token, 'persona/aceptado');
            const enEspera = await PeticionGet(token, 'persona/espera');
            const rechazados = usuarios.filter(
              (usuario) =>
                !aceptados.info.some(
                  (aceptado) => aceptado.external_id === usuario.external_id
                ) &&
                !enEspera.info.some(
                  (enEspera) => enEspera.external_id === usuario.external_id
                )
            );
            setUsuarios(rechazados);
            return;
        }
        const data = await PeticionGet(token, url);
        setUsuarios(data.info);
      } catch (error) {
        console.error(error);
      }
    };
    fetchUsuarios();
  }, [filtro, token, usuarios]); // Añadido 'token' y 'usuarios'

  const handleFiltroChange = (event) => {
    setFiltro(event.target.value);
  };

  const handleShowModal = (usuario) => {
    setSelectedUsuario(usuario);
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
  };

  const handleEstadoChange = (event) => {
    setSelectedUsuario({
      ...selectedUsuario,
      cuenta: {
        ...selectedUsuario.cuenta,
        estado: event.target.value,
      },
    });
  };

  return (
    <div>
      <header>
        <BarraMenu />
      </header>
      <section>
        <h3 className="texto-primario-h3">USUARIOS</h3>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          <div className="content-select">
            <label className="texto-primario-h3">Filtrar por estado:</label>&nbsp;
            <select id="filtro" value={filtro} onChange={handleFiltroChange}>
              <option value="aceptado">Aceptado</option>
              <option value="espera">En espera</option>
              <option value="rechazado">Rechazado</option>
            </select>
          </div>
          <div
            className="crud shadow-lg p-3 mb-5 bg-body rounded"
            style={{ display: 'flex', flexDirection: 'column' }}
          >
            <div className="col">
              <div className="table-responsive">
                <table className="table table-striped">
                  <thead>
                    <tr>
                      <th>Nombres</th>
                      <th>Apellidos</th>
                      <th>Ocupación</th>
                      <th>Institución</th>
                      <th>Teléfono</th>
                      <th>Editar estado</th>
                    </tr>
                  </thead>
                  <tbody>
                    {usuarios.map((usuario) => (
                      <tr key={usuario.external_id}>
                        <td className='text-center'>{usuario.nombres}</td>
                        <td className='text-center'>{usuario.apellidos}</td>
                        <td className='text-center'>{usuario.ocupacion}</td>
                        <td className='text-center'>{usuario.institucion}</td>
                        <td className='text-center'>{usuario.telefono}</td>
                        <td className='text-center'>
                          <button onClick={() => handleShowModal(usuario)} className="btn btn-link p-0">
                            {usuario.cuenta.estado === 'ACEPTADO' && <i className="fas fa-check" style={{ color: 'green' }}></i>}
                            {usuario.cuenta.estado === 'ESPERA' && <i className="fas fa-clock" style={{ color: 'orange' }}></i>}
                            {usuario.cuenta.estado === 'RECHAZADO' && <i className="fas fa-times" style={{ color: 'red' }}></i>}
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      </section>

      <Modal show={showModal} onHide={handleCloseModal}>
        {selectedUsuario && (
          <CambiarEstado usuario={selectedUsuario} handleChange={handleEstadoChange} />
        )}
      </Modal>
    </div>
  );
};

export default Usuarios;
