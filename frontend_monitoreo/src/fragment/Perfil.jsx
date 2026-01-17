import React, { useState, useEffect } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import BarraMenu from './BarraMenu';
import { PeticionGet } from '../hooks/Conexion';
import { getToken, getRol, getExternal } from '../utilidades/Sessionutil';
import logo from '../logo.png';
import mensajes from '../utilidades/Mensajes';
import Modal from 'react-bootstrap/Modal'; // Importa el componente de modal de Bootstrap
import ModificarPerfil from './ModificarPerfil'; // Importar el componente de modificación de perfil

const Perfil = () => {
    const [userProfileData, setUserProfileData] = useState([]);
    const [showModal, setShowModal] = useState(false); // Estado para controlar la visibilidad del modal
    const external = getExternal();
    const token = getToken();

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await PeticionGet(token, `persona/obtener/${external}`);
                if (response.code === 200) {
                    setUserProfileData([response.info]);
                } else {
                    mensajes(response.msg, 'error', 'error');
                }
            } catch (error) {
                console.error('Error al obtener el perfil de usuario:', error);
                mensajes('Error al obtener el perfil de usuario', 'error', 'error');
            }
        };
        fetchData();
    }, [external, token]);

    const formatearFecha = (fecha) => {
        const fechaUTC = new Date(fecha);
        const dia = fechaUTC.getUTCDate();
        const mes = fechaUTC.getUTCMonth() + 1; 
        const año = fechaUTC.getUTCFullYear();
    
        // Formatear la fecha en el formato deseado (dd/mm/yyyy)
        const fechaFormateada = `${dia.toString().padStart(2, '0')}/${mes.toString().padStart(2, '0')}/${año}`;
    
        return fechaFormateada;
    };

    const handleCloseModal = () => setShowModal(false);
    const handleOpenModal = () => setShowModal(true);

    return (
        <div>
            <header>
                <BarraMenu />
            </header>
            <div className="p-4 row">
                <div className="col-sm-10 mt-5 mb-4 ml-4 ">
                    <h2 className="texto-subtitulo-1">Perfil de Usuario</h2>
                </div>
            </div>
            <main className="container crud shadow-lg mb-4">
                <div className="row ">
                    <div className="col-md-4">
                        <img src={logo} alt="ico" style={{ width: '100%' }} />
                        <div className="text-center">
                            <strong className="texto-primario b texto-grande">{getRol()}</strong>
                        </div>
                    </div>
                    <div className="col-md-6 mb-4 mx-auto">
                        {userProfileData.map((user, index) => (
                            <div className="card mt-4" key={index}>
                                <div className="card-body">
                                    <div className="mt-3">
                                        <div className="row">
                                            <div className="col-sm-5">
                                                <strong className="texto-primario b texto-grande">Nombre:</strong>
                                            </div>
                                            <div className="col-sm-7">
                                                <strong className="text-muted mb-0 texto-grande">{user.nombres} {user.apellidos}</strong>
                                            </div>
                                        </div>
                                        <hr />
                                        <div className="row">
                                            <div className="col-sm-5">
                                                <strong className="texto-primario b texto-grande">Fecha de Nacimiento:</strong>
                                            </div>
                                            <div className="col-sm-7">
                                                <strong className="text-muted mb-0 texto-grande">{formatearFecha(user.fecha_nacimiento)}</strong>
                                            </div>
                                        </div>
                                        <hr />
                                        <div className="row">
                                            <div className="col-sm-5">
                                                <strong className="texto-primario b texto-grande">Teléfono:</strong>
                                            </div>
                                            <div className="col-sm-7">
                                                <strong className="text-muted mb-0 texto-grande">{user.telefono}</strong>
                                            </div>
                                        </div>
                                        <hr />
                                        <div className="row">
                                            <div className="col-sm-5">
                                                <strong className="texto-primario b texto-grande">Cargo:</strong>
                                            </div>
                                            <div className="col-sm-7">
                                                <strong className="text-muted mb-0 texto-grande">{user.ocupacion}</strong>
                                            </div>
                                        </div>
                                        <hr />
                                        <div className="row">
                                            <div className="col-sm-5">
                                                <strong className="texto-primario b texto-grande">Institución:</strong>
                                            </div>
                                            <div className="col-sm-7">
                                                <strong className="text-muted mb-0 texto-grande">{user.institucion}</strong>
                                            </div>
                                        </div>
                                        <hr />
                                        <div className="row">
                                            <div className="col-sm-5">
                                                <strong className="texto-primario b texto-grande">Correo:</strong>
                                            </div>
                                            <div className="col-sm-7">
                                                <strong className="text-muted mb-0 texto-grande">{user.cuenta.correo}</strong>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ))}
                        <div className="text-center mt-4">
                            <button className="boton btn btn-lg btn-block" onClick={handleOpenModal}>Editar Perfil</button>
                        </div>
                    </div>
                </div>
            </main>

            {/* Modal para modificar perfil */}
            <Modal show={showModal} onHide={handleCloseModal} centered size="lg">
                <Modal.Header closeButton>
                    <Modal.Title>Editar Perfil</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <ModificarPerfil userProfileData={userProfileData[0]} onClose={handleCloseModal} />
                </Modal.Body>
            </Modal>
        </div>
    );
};

export default Perfil;