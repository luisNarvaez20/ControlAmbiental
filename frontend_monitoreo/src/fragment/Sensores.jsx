import React, { useState, useEffect } from 'react';
import BarraMenu from './BarraMenu';
import { PeticionGet } from '../hooks/Conexion';
import CambiarEstadoSensor from './CambiarEstadoSensor';
import RegistroSensor from './RegistroSesor';
import 'bootstrap/dist/css/bootstrap.min.css';
import { Modal, Button } from 'react-bootstrap';
import { getToken } from '../utilidades/Sessionutil';

const Sensores = () => {
  const [sensores, setSensores] = useState([]);
  const [filtro, setFiltro] = useState('activo');
  const [selectedSensor, setSelectedSensor] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [showRegistroModal, setShowRegistroModal] = useState(false);
  const token = getToken();

  useEffect(() => {
    const fetchSensores = async () => {
      try {
        let url;
        switch (filtro) {
          case 'activo':
            url = 'sensor/listarActivo';
            break;
          case 'inactivo':
            url = 'sensor/listarInactivo';
            break;
          default:
            url = 'sensor/listarActivo';
            break;
        }
        const data = await PeticionGet(token, url);
        setSensores(data.info);
      } catch (error) {
        console.error(error);
      }
    };
    fetchSensores();
  }, [filtro, token]);

  const handleFiltroChange = (event) => {
    setFiltro(event.target.value);
  };

  const handleShowModal = (sensor) => {
    setSelectedSensor(sensor);
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
  };

  const handleShowRegistroModal = () => {
    setShowRegistroModal(true);
  };

  const handleCloseRegistroModal = () => {
    setShowRegistroModal(false);
  };

  const handleEstadoChange = (event) => {
    setSelectedSensor({
      ...selectedSensor,
      estado: event.target.value === 'true'
    });
  };

  return (
    <div>
      <header>
        <BarraMenu />
      </header>
      <section>
        <h3 className="texto-primario-h3">SENSORES</h3>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          <div className="content-select">
            <label className="texto-primario-h3">Filtrar por estado:</label>&nbsp;
            <select id="filtro" value={filtro} onChange={handleFiltroChange}>
              <option value="activo">Activo</option>
              <option value="inactivo">Inactivo</option>
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
                      <th>Nombre</th>
                      <th>Ubicación</th>
                      <th>Tipo de sensor</th>
                      <th>Editar estado</th>
                    </tr>
                  </thead>
                  <tbody>
                    {sensores.map((sensor) => (
                      <tr key={sensor.external_id}>
                        <td className='text-center'>{sensor.nombre}</td>
                        <td className='text-center'>{sensor.ubicacion}</td>
                        <td className='text-center'>{sensor.tipo_sensor}</td>
                        <td className='text-center'>
                          {filtro === 'activo' && (
                            <button onClick={() => handleShowModal(sensor)} className="btn btn-link p-0">
                              <i className="fas fa-toggle-on" style={{ color: 'green' }}></i>
                            </button>
                          )}
                          {filtro === 'inactivo' && (
                            <button onClick={() => handleShowModal(sensor)} className="btn btn-link p-0">
                              <i className="fas fa-toggle-off" style={{ color: 'orange' }}></i>
                            </button>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
          <div style={{ display: 'flex', justifyContent: 'center' }}>
            <button className="btn btn-verde" onClick={handleShowRegistroModal}>
              <i className="fas fa-plus" style={{ marginRight: '10px' }}></i>
              Añadir sensor
            </button>
          </div>
        </div>
      </section>

      <Modal show={showModal} onHide={handleCloseModal}>
        <Modal.Header closeButton>
          <Modal.Title>Cambiar Estado del Sensor</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {selectedSensor && (
            <CambiarEstadoSensor sensor={selectedSensor} handleChange={handleEstadoChange} />
          )}
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleCloseModal}>
            Cerrar
          </Button>
        </Modal.Footer>
      </Modal>

      <Modal show={showRegistroModal} onHide={handleCloseRegistroModal} dialogClassName="modal-50w">
                <Modal.Header closeButton>
                    <Modal.Title>Registro de sensores</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <RegistroSensor />
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={handleCloseRegistroModal}>
                        Cerrar
                    </Button>
                </Modal.Footer>
            </Modal>
    </div>
  );
};

export default Sensores;
