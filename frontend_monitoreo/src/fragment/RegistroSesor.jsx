import 'bootstrap/dist/css/bootstrap.min.css';
import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { PeticionPost } from '../hooks/Conexion';
import logo from '../logo.png';
import mensajes from '../utilidades/Mensajes';
import { getToken } from '../utilidades/Sessionutil';

const RegistroSensor = () => {
    const { register, handleSubmit, formState: { errors } } = useForm();
    const [showConfirmModal, setShowConfirmModal] = useState(false);
    const [formData, setFormData] = useState({});

    const onSubmit = (data) => {
        setFormData(data);
        setShowConfirmModal(true);
    };

    const handleConfirm = () => {
        setShowConfirmModal(false);
        mensajes('Guardando información...', 'info', 'Información');

        const datos = {
            "nombre": formData.nombre,
            "ubicacion": formData.ubicacion,
            "tipo_sensor": formData.tipo_sensor,
        };

        PeticionPost(getToken(), 'sensor/guardar', datos).then((info) => {
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

    return (
        <>
            <div className="background-radial-gradient overflow-hidden">
                <section>
                    <div className="container align-items-center text-center text-lg-start my-5">
                        <div className="mb-lg-0">
                            <div id="radius-shape-1" className="position-absolute rounded-circle shadow-5-strong"></div>
                            <div id="radius-shape-2" className="position-absolute shadow-5-strong"></div>
                            <div className="card bg-glass" style={{ maxWidth: '400px', margin: '0 auto' }}>
                                <div className="card-body">
                                    <div className="row g-0">
                                        <div className="col-12 text-center mb-4">
                                            <img src={logo} alt="logo" className="img-fluid" style={{ maxWidth: '350px' }} />
                                        </div>
                                        <div className="col-12">
                                            <form onSubmit={handleSubmit(onSubmit)}>
                                                <div className="mb-3">
                                                    <div className={`input-field form-outline`}>
                                                    <em className="fa fa-pencil"></em>
                                                        <input
                                                            type="text"
                                                            className="form-control"
                                                            placeholder="Nombre"
                                                            {...register('nombre', { required: true })}
                                                        />
                                                    </div>
                                                    {errors.nombre && <div className='alert alert-danger mt-1'>Ingrese el nombre del sensor</div>}
                                                </div>
                                                <div className="mb-3">
                                                    <div className={`input-field form-outline`}>
                                                        <em className="fa fa-map" aria-hidden="true"></em>
                                                        <input
                                                            type="text"
                                                            className="form-control"
                                                            placeholder="Ubicación"
                                                            {...register('ubicacion', { required: true })}
                                                        />
                                                    </div>
                                                    {errors.ubicacion && <div className='alert alert-danger mt-1'>Ingrese la ubicación</div>}
                                                </div>
                                                <div className="mb-3">
                                                    <div className={`input-field form-outline`}>
                                                        <em className="fa fa-microchip"></em>
                                                        <select
                                                            className="form-control"
                                                            {...register('tipo_sensor', { required: true })}
                                                        >
                                                            <option value="">Seleccione el tipo de sensor</option>
                                                            <option value="TEMPERATURA">TEMPERATURA</option>
                                                            <option value="HUMEDAD">HUMEDAD</option>
                                                            <option value="CO2">CO2</option>
                                                        </select>
                                                    </div>
                                                    {errors.tipo_sensor && <div className='alert alert-danger mt-1'>Seleccione el tipo de sensor</div>}
                                                </div>
                                                <div className="d-grid">
                                                    <button type="submit" className="boton btn btn-lg btn-block">REGISTRAR</button>
                                                </div>
                                            </form>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>

                {showConfirmModal && (
                    <div className="modal fade show" style={{ display: 'block' }} tabIndex="-1">
                        <div className="modal-dialog">
                            <div className="modal-content">
                                <div className="modal-header">
                                    <h5 className="modal-title">Confirmar Registro</h5>
                                    <button type="button" className="btn-close" onClick={() => setShowConfirmModal(false)}></button>
                                </div>
                                <div className="modal-body">
                                    <p>¿Está seguro de que desea registrar este sensor?</p>
                                </div>
                                <div className="modal-footer">
                                    <button type="button" className="btn btn-danger" onClick={() => setShowConfirmModal(false)}>No</button>
                                    <button type="button" className="btn btn-verde" onClick={handleConfirm}>Sí</button>
                                </div>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </>
    );
};

export default RegistroSensor;