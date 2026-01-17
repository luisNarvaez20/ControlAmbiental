import 'bootstrap/dist/css/bootstrap.min.css';
import { useForm } from 'react-hook-form';
import { LoginPost} from '../hooks/Conexion';
import { save, saveToken} from '../utilidades/Sessionutil';
import { useNavigate } from 'react-router';
import mensajes from '../utilidades/Mensajes';
import logo from '../logo.png';
import BarraMenu from './BarraMenu';
import '../components/css/style.css';

const Login = () => {
    const navegation = useNavigate();
    const { register, handleSubmit, formState: { errors }, watch } = useForm();

    const onSubmit = (data) => {
        var datos = {
            "correo": data.correo,
            "clave": data.clave
        };
        LoginPost(datos, 'cuenta/sesion').then((info) => {
            if (info.code !== 200) {
                if (info.msg === 'Usuario no registrado en el sistema') {
                    mensajes('Usuario no registrado en el sistema', "warning", "warning");
                    navegation("/iniciar-sesion");
                }
                mensajes(info.msg, "error", "error");
            } else {
                saveToken(info.token);
                console.log("Usuario: " + info.user + " Rol: " + info.rol + " Correo: " + info.correo + "tokenapi: " + info.token);
                save('user', info.user);
                save('rol', info.rol);
                save('correo', info.correo);
                save('external', info.external_id);
                if (info.rol === "USUARIO") {
                    navegation("/graficas");
                } else {
                    navegation("/graficas");
                }
                mensajes(info.msg);
                console.log(info);
            };
        });

    };
    const correoValue = watch('correo');
    const claveValue = watch('clave');
    return (
        <div className="background-radial-gradient overflow-hidden">
            <header>
                <BarraMenu />
            </header>
            <section>
                <div className="container px-4 py-5 px-md-5 text-center text-lg-start my-5">
                <img src={logo} alt="logo" style={{height:'15rem'}} />
                <span className='titulo_0'>   ESTACIÓN DE MONITOREO AMBIENTAL</span>
                    <div className="row gx-lg-5 align-items-center mb-5">
                        <div className="col-lg-6 mb-5 mb-lg-0" style={{ zIndex: 10 }}>
                            <h1 className="my-5 display-5 fw-bold">                           
                                <span className='titulo_1'>Funciones exclusivas al iniciar sesión</span>
                            </h1>
                            <p className="mb-4 opacity-70 text-justify" >
                                <span className='titulo_2'> Al registrarte, obtendrás:</span><br />
                                Historial de datos: Accede al historial completo de temperatura, humedad y CO₂ del aula magna.
                                Gráficas individuales: Visualiza gráficos detallados para cada parámetro ambiental.<br />
                                <span className='titulo_2'> ¿Por qué es importante?</span><br />
                                Monitorizar las condiciones del aula magna garantiza un ambiente cómodo y seguro para conferencias, graduaciones y distintos eventos educativos. Tu participación ayuda a identificar y resolver problemas ambientales rápidamente.
                                ¡Crea tu cuenta ahora y participa con la mejora de calidad del entorno para todos los eventos! </p>
                        </div>
                        <div className="col-lg-6 mb-lg-0 position-relative">
                            <div id="radius-shape-1" className="position-absolute rounded-circle shadow-5-strong"></div>
                            <div id="radius-shape-2" className="position-absolute shadow-5-strong"></div>

                            <div className="p-4">
                                <div class="card-header">
                                    <span className="h1 fw-bold mb-4">Inicio de sesión</span>
                                </div>

                                <div className="card-body px-4 py-3">
                                    <div className="row g-0">
                                        <div className="d-flex align-items-center">
                                            <div className="card-body">
                                                <form onSubmit={handleSubmit(onSubmit)}>
                                                    <div className=' mb-4'>
                                                        <div className={`input-field form-outline ${correoValue ? 'active' : ''}`} >
                                                            <em className="far fa-user"></em>
                                                            <input type="email" id="form2Example17" placeholder="Ingrese correo" {...register('correo', { required: true, pattern: /^\S+@\S+$/i })} />
                                                        </div>
                                                        {errors.correo && errors.correo.type === 'required' && <div className='alert alert-danger'>Ingrese el correo</div>}
                                                        {errors.correo && errors.correo.type === 'pattern' && <div className='alert alert-danger'>Ingrese un correo valido</div>}
                                                    </div>
                                                    <div className='mb-4'>
                                                        <div className={`input-field form-outline ${claveValue ? 'active' : ''}`}>
                                                            <em class="fas fa-lock "></em>
                                                            <input type="password" id="typeText" placeholder="Ingrese clave" {...register('clave', { required: true })} />
                                                        </div>
                                                        {errors.clave && errors.clave.type === 'required' && <div className='alert alert-danger'>Ingrese una clave</div>}
                                                    </div>
                                                    <div className="mb-4">
                                                        <button className="boton btn btn-lg btn-block" type="submit">INICIAR</button>
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

export default Login;