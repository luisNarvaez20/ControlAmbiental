import React, { useEffect } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import { useForm } from 'react-hook-form';
import { LoginPost } from '../hooks/Conexion';
import { useNavigate } from 'react-router';
import mensajes from '../utilidades/Mensajes';
import logo from '../logo.png';
import { getExternal } from '../utilidades/Sessionutil';
import '../components/css/style.css';
import { Modal, Button } from 'react-bootstrap';

const ModificarPerfil = ({ userProfileData, onClose }) => {
    const navigate = useNavigate();
    const { register, handleSubmit, formState: { errors }, setValue, getValues } = useForm();
    const external = getExternal();
    const [showModal, setShowModal] = React.useState(false);

    useEffect(() => {
        if (userProfileData) {
            setValue('nombres', userProfileData.nombres);
            setValue('apellidos', userProfileData.apellidos);
            setValue('fecha_nacimiento', userProfileData.fecha_nacimiento.split('T')[0]); // Asegurarse de formatear la fecha correctamente
            setValue('telefono', userProfileData.telefono);
            setValue('ocupacion', userProfileData.ocupacion);
            setValue('institucion', userProfileData.institucion);
        }
    }, [userProfileData, setValue]);

    const onSubmit = (data) => {
        setShowModal(true); // Mostrar el modal de confirmación
    };

    const handleConfirm = () => {
        const formData = {
            nombres: getValues('nombres'),
            apellidos: getValues('apellidos'),
            fecha_nacimiento: getValues('fecha_nacimiento'),
            telefono: getValues('telefono'),
            ocupacion: getValues('ocupacion'),
            institucion: getValues('institucion'),
            external: external
        };

        console.log('Form Data:', formData);

        LoginPost(formData, 'persona/modificar').then((response) => {
            console.log("ghhhhhhhhhh" + formData);
            if (response.code !== 200) {
                mensajes(response.msg, "error", "Error");
            } else {
                mensajes(response.msg, 'success', 'Exitoso');
                navigate("/");
            }
        }).catch(error => {
            console.error('Error al modificar el perfil:', error);
            mensajes('Error al modificar el perfil', 'error', 'Error');
        });

        setShowModal(false); // Cerrar el modal después de la acción
    };

    const handleCloseModal = () => {
        setShowModal(false);
    };

    return (
        <div className="background-radial-gradient overflow-hidden">
            <section>
                <div className="container align-items-center text-center text-lg-start my-5">
                    <div className="mb-lg-0">
                        <div id="radius-shape-1" className="position-absolute rounded-circle shadow-5-strong"></div>
                        <div id="radius-shape-2" className="position-absolute shadow-5-strong"></div>
                        <div className="card bg-glass">
                            <div className="card-body px-4 py-3">
                                <div className="row g-0">
                                    <div className="col-md-4 d-none d-md-block">
                                        <img src={logo} alt="logo" className="w-100 " />
                                    </div>
                                    <div className="col-md-8 d-flex align-items-center">
                                        <div className="card-body">
                                            <div className="container">
                                                <form className="row g-3" onSubmit={handleSubmit(onSubmit)}>
                                                    <div className="col-md-6">
                                                        <div className="form-outline">
                                                            <label htmlFor="nombres"><em className="far fa-user"></em> Nombres</label>
                                                            <input type="text" id="nombres" className="form-control" placeholder="Nombres" {...register('nombres', {
                                                                required: true,
                                                                pattern: /^[a-zA-Z\s]*$/ // Solo letras y espacios
                                                            })} />
                                                        </div>
                                                        {errors.nombres && errors.nombres.type === 'required' && <div className='alert alert-danger'>Ingrese sus nombres</div>}
                                                        {errors.nombres && errors.nombres.type === 'pattern' && <div className='alert alert-danger'>Ingrese solo letras</div>}
                                                    </div>
                                                    <div className="col-md-6">
                                                        <div className="form-outline">
                                                            <label htmlFor="apellidos"><em className="far fa-user"></em> Apellidos</label>
                                                            <input type="text" id="apellidos" className="form-control" placeholder="Apellidos" {...register('apellidos', {
                                                                required: true,
                                                                pattern: /^[a-zA-Z\s]*$/ // Solo letras y espacios
                                                            })} />
                                                        </div>
                                                        {errors.apellidos && errors.apellidos.type === 'required' && <div className='alert alert-danger'>Ingrese sus apellidos</div>}
                                                        {errors.apellidos && errors.apellidos.type === 'pattern' && <div className='alert alert-danger'>Ingrese solo letras</div>}
                                                    </div>
                                                    <div className="col-md-6">
                                                        <div className="form-outline">
                                                            <label htmlFor="fecha_nacimiento"><em className="far fa-calendar"></em> Fecha Nacimiento</label>
                                                            <input
                                                                type="date"
                                                                id="fecha_nacimiento"
                                                                className="form-control"
                                                                placeholder="Fecha Nacimiento"
                                                                {...register('fecha_nacimiento', {
                                                                    required: true,
                                                                    validate: (value) => {
                                                                        const today = new Date();
                                                                        const birthDate = new Date(value);

                                                                        const birthYear = birthDate.getFullYear();
                                                                        const currentYear = today.getFullYear();

                                                                        if (birthDate > today) {
                                                                            return "La fecha seleccionada no puede ser en el futuro";
                                                                        }

                                                                        const age = currentYear - birthYear;

                                                                        if (age > 150) {
                                                                            return "La edad no puede ser mayor a 150 años";
                                                                        }

                                                                        if (age < 18) {
                                                                            return "Debe ser mayor de edad"; // Verificar si la edad es mayor o igual a 18 años
                                                                        }

                                                                        return true;
                                                                    }
                                                                })}
                                                            />
                                                        </div>
                                                        {errors.fecha_nacimiento && errors.fecha_nacimiento.type === 'required' && <div className='alert alert-danger'>Ingrese su fecha de nacimiento</div>}
                                                        {errors.fecha_nacimiento && <div className='alert alert-danger'>{errors.fecha_nacimiento.message}</div>}
                                                    </div>
                                                    <div className="col-md-6">
                                                        <div className="form-outline">
                                                            <label htmlFor="telefono"><em className="fa fa-phone"></em> Teléfono</label>
                                                            <input
                                                                type="text"
                                                                id="telefono"
                                                                className="form-control"
                                                                placeholder="Teléfono"
                                                                {...register('telefono', {
                                                                    required: true,
                                                                    pattern: /^[0-9]{10}$/
                                                                })}
                                                            />
                                                        </div>
                                                        {errors.telefono && errors.telefono.type === 'required' && <div className='alert alert-danger'>Ingrese su teléfono</div>}
                                                        {errors.telefono && errors.telefono.type === 'pattern' && <div className='alert alert-danger'>Ingrese un teléfono válido (solo números y 10 dígitos)</div>}
                                                    </div>
                                                    <div className="col-md-6">
                                                        <div className="form-outline">
                                                            <label htmlFor="ocupacion"><em className="far fa-building"></em> Ocupación</label>
                                                            <input type="text" id="ocupacion" className="form-control" placeholder="Ocupación" {...register('ocupacion', { required: true })} />
                                                        </div>
                                                        {errors.ocupacion && errors.ocupacion.type === 'required' && <div className='alert alert-danger'>Ingrese su ocupación</div>}
                                                    </div>
                                                    <div className="col-md-6">
                                                        <div className="form-outline">
                                                            <label htmlFor="institucion"><em className="fa fa-university"></em> Institución</label>
                                                            <input type="text" id="institucion" className="form-control" placeholder="Institución" {...register('institucion', { required: true })} />
                                                        </div>
                                                        {errors.institucion && errors.institucion.type === 'required' && <div className='alert alert-danger'>Ingrese la institución</div>}
                                                    </div>
                                                    <div className="col-md-6">
                                                        <div className="col-12 d-flex justify-content-end">
                                                            <button type="submit" className="boton btn btn-lg btn-block">MODIFICAR</button>
                                                        </div>
                                                    </div>
                                                </form>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>



            {/* Modal de Confirmación */}
            <Modal show={showModal} onHide={handleCloseModal} centered>
                <Modal.Header closeButton>
                    <Modal.Title>Confirmar Modificación</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <p>¿Estás seguro de que quieres modificar tu perfil?</p>
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" style={{ backgroundColor: 'red' }} onClick={handleCloseModal}>
                        No
                    </Button>
                    <Button variant="primary" style={{ backgroundColor: '#36ab2b' }} onClick={handleConfirm}>
                        Sí
                    </Button>
                </Modal.Footer>
            </Modal>
        </div>
    );
};

export default ModificarPerfil;
