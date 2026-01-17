import 'bootstrap/dist/css/bootstrap.min.css';
import React from 'react';
import { useForm } from 'react-hook-form';
import { useNavigate } from 'react-router';
import '../components/css/style.css';
import { LoginPost } from '../hooks/Conexion';
import logo from '../logo.png';
import mensajes from '../utilidades/Mensajes';

const Registro = () => {
    const navigate = useNavigate();
    const { register, handleSubmit, formState: { errors }, watch } = useForm();

    const onSubmit = (data) => {
        if (data.clave !== data.confirmarClave) {
            mensajes('Las claves no coinciden', 'error', 'Error');
            return;
        }

        mensajes('Guardando información...', 'info', 'Información'); // Mostrar mensaje de guardado

        const datos = {
            "nombres": data.nombres,
            "apellidos": data.apellidos,
            "fecha_nacimiento": data.fecha_nacimiento,
            "telefono": data.telefono,
            "ocupacion": data.ocupacion,
            "institucion": data.institucion,
            "correo": data.correo,
            "clave": data.clave,
        };

        LoginPost(datos, 'persona/usuario').then((info) => {
            if (info.code !== 200) {
                mensajes(info.msg, "error", "Error");
            } else {
                mensajes(info.msg, 'success', 'Exitoso');
                navigate("/iniciar-sesion");
            }
        });
    };

    const claveValue = watch('clave');

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
                                                        <div className={`input-field form-outline`}>
                                                            <em className="far fa-user"></em>
                                                            <input type="text" className="form-control" placeholder="Nombres" {...register('nombres', {
                                                                required: true,
                                                                pattern: /^[a-zA-Z\s]*$/ // Solo letras y espacios
                                                            })} />
                                                        </div>
                                                        {errors.nombres && errors.nombres.type === 'required' && <div className='alert alert-danger'>Ingrese sus nombres</div>}
                                                        {errors.nombres && errors.nombres.type === 'pattern' && <div className='alert alert-danger'>Ingrese solo letras</div>}
                                                    </div>
                                                    <div className="col-md-6">
                                                        <div className={`input-field form-outline`}>
                                                            <em className="far fa-user"></em>
                                                            <input type="text" className="form-control" placeholder="Apellidos" {...register('apellidos', {
                                                                required: true,
                                                                pattern: /^[a-zA-Z\s]*$/ // Solo letras y espacios
                                                            })} />
                                                        </div>
                                                        {errors.apellidos && errors.apellidos.type === 'required' && <div className='alert alert-danger'>Ingrese sus apellidos</div>}
                                                        {errors.apellidos && errors.apellidos.type === 'pattern' && <div className='alert alert-danger'>Ingrese solo letras</div>}
                                                    </div>
                                                    <div className="col-md-6">
                                                        <div className={`input-field form-outline`}>
                                                            <em className="far fa-calendar"></em>
                                                            <input
                                                                type="date"
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
                                                        <div className={`input-field form-outline`}>
                                                            <em className="fa fa-phone"></em>
                                                            <input
                                                                type="text"
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
                                                        <div className={`input-field form-outline`}>
                                                            <em className="far fa-building"></em>
                                                            <input type="text" className="form-control" placeholder="Institución" {...register('institucion', { required: true })} />
                                                        </div>
                                                        {errors.institucion && errors.institucion.type === 'required' && <div className='alert alert-danger'>Ingrese la institución</div>}
                                                    </div>
                                                    <div className="col-md-6">
                                                        <div className={`input-field form-outline`}>
                                                            <em className="fa fa-briefcase"></em>
                                                            <input type="text" className="form-control" placeholder="Ocupación" {...register('ocupacion', { required: true })} />
                                                        </div>
                                                        {errors.ocupacion && errors.ocupacion.type === 'required' && <div className='alert alert-danger'>Ingrese su ocupación</div>}
                                                    </div>
                                                    <div className="col-md-6">
                                                        <div className={`input-field form-outline`}>
                                                            <em className="far fa-user"></em>
                                                            <input type="email" className="form-control" placeholder="Correo" {...register('correo', {
                                                                required: true,
                                                                pattern: /^\S+@\S+$/i // Patrón para validar el formato de correo electrónico
                                                            })} />
                                                        </div>
                                                        {errors.correo && errors.correo.type === 'required' && <div className='alert alert-danger'>Ingrese el correo</div>}
                                                        {errors.correo && errors.correo.type === 'pattern' && <div className='alert alert-danger'>Ingrese un correo válido</div>}
                                                    </div>
                                                    <div className="col-md-6">
                                                        <div className={`input-field form-outline`}>
                                                            <em className="fas fa-lock "></em>
                                                            <input type="password" className="form-control" placeholder="Clave" {...register('clave', {
                                                                required: true,
                                                                minLength: 7,
                                                                pattern: /^(?=.*[A-Z])(?=.*\d).*$/ // Para la contraseña Al menos una letra mayúscula y un número
                                                            })} />
                                                        </div>
                                                        {errors.clave && errors.clave.type === 'required' && <div className='alert alert-danger'>Ingrese una clave</div>}
                                                        {errors.clave && errors.clave.type === 'minLength' && <div className='alert alert-danger'>La clave debe tener al menos 7 caracteres</div>}
                                                        {errors.clave && errors.clave.type === 'pattern' && <div className='alert alert-danger'>La clave debe contener al menos una letra mayúscula y un número</div>}
                                                    </div>
                                                    <div className="col-md-6">
                                                        <div className={`input-field form-outline`}>
                                                            <em className="fas fa-lock "></em>
                                                            <input type="password" className="form-control" placeholder="Confirmar Clave" {...register('confirmarClave', {
                                                                required: true,
                                                                validate: (value) => value === claveValue || 'Las claves no coinciden'
                                                            })} />
                                                        </div>
                                                        {errors.confirmarClave && errors.confirmarClave.type === 'required' && <div className='alert alert-danger'>Confirme su clave</div>}
                                                        {errors.confirmarClave && <div className='alert alert-danger'>{errors.confirmarClave.message}</div>}
                                                    </div>
                                                    <div className="col-12 d-flex justify-content-end">
                                                        <button type="submit" className="boton btn btn-lg btn-block">REGISTRAR</button>
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
        </div>
    );
}

export default Registro;
