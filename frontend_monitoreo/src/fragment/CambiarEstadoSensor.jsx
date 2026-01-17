import 'bootstrap/dist/css/bootstrap.min.css';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { PeticionPost } from '../hooks/Conexion';
import mensajes from '../utilidades/Mensajes';
import { getToken } from '../utilidades/Sessionutil';

const CambiarEstadoSensor = ({ sensor, handleChange }) => {
  const { register, handleSubmit, formState: { errors } } = useForm();
  const [estadoSeleccionado, setEstadoSeleccionado] = useState(sensor.estado ? 'activo' : 'inactivo');
  const [showConfirmationModal, setShowConfirmationModal] = useState(false);

  const editar = async () => {
    const datos = {
      estado: estadoSeleccionado === 'activo',
      external_id: sensor.external_id,
    };

    PeticionPost(getToken(), 'sensor/modificar', datos).then((info) => {
      if (info.code !== 200) {
        mensajes(info.msg, 'error', 'Error');
      } else {
        mensajes(info.msg);
        setTimeout(() => {
          window.location.reload();
        }, 2000);
      }
    });
  };

  const handleEstadoChange = (event) => {
    setEstadoSeleccionado(event.target.value);
    handleChange(event); // Para actualizar el estado en el componente Sensores
  };

  const handleConfirmation = () => {
    setShowConfirmationModal(true);
  };

  const handleConfirm = () => {
    setShowConfirmationModal(false);
    editar();
  };

  const handleCancel = () => {
    setShowConfirmationModal(false);
  };

  return (
    <div className="crud shadow-lg p-3 mb-2 mt-2 bg-body rounded modal-content">
      <div className="row">
        <div className="col-12">
          <div className="card">
            <div className="card-body">
              <h4 className="card-title">Editar estado del sensor</h4>
              <form className="form-sample" onSubmit={handleSubmit(handleConfirmation)}>
                <p className="card-description texto-primario">Datos del sensor</p>
                <p className="card-description">Sensor:
                  <span className="mx-2 badge rounded-pill bg-secondary">{sensor.nombre}</span></p>
                <div className="row">
                  <div className="form-group">
                    <label>Estado</label>
                    <select className="form-control" {...register('estado', { required: true })} value={estadoSeleccionado} onChange={handleEstadoChange}>
                      <option value="">Seleccione un estado</option>
                      <option value="activo">Activo</option>
                      <option value="inactivo">Inactivo</option>
                    </select>
                    {errors.estado && errors.estado.type === 'required' && (
                      <div className="alert alert-danger">Seleccione un estado</div>
                    )}
                  </div>
                  <div className="mb-4"></div> {/* Espacio adicional */}
                </div>
                <div className="d-flex justify-content-between">
                  <button
                    className="btn btn-dark btn-lg btn-block"
                    type="submit"
                    style={{ backgroundColor: '#36ab2b', width: '100%' }}
                  >
                    Guardar cambios
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
      {/* Modal de confirmación */}
      <div className="modal" tabIndex="-1" role="dialog" style={{ display: showConfirmationModal ? 'block' : 'none' }}>
        <div className="modal-dialog" role="document">
          <div className="modal-content">
            <div className="modal-header">
              <h5 className="modal-title">Confirmación</h5>
              <button type="button" className="close" onClick={handleCancel} aria-label="Close">
                <span aria-hidden="true">&times;</span>
              </button>
            </div>
            <div className="modal-body">
              <p>¿Estás seguro de cambiar el estado?</p>
            </div>
            <div className="modal-footer">
              <button type="button" className="btn btn-secondary" style={{ backgroundColor: 'red' }} onClick={handleCancel}>No</button>
              <button type="button" className="btn btn-primary" style={{ backgroundColor: '#36ab2b' }} onClick={handleConfirm}>Sí</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CambiarEstadoSensor;
