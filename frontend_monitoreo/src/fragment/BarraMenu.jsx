import React, { useState } from 'react';
import { Navbar, Nav, Offcanvas, Modal, Button } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import { borrarSesion, getToken, getRol } from '../utilidades/Sessionutil';
import { useNavigate } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';
import logo from '../logo.png';
import Registro from './Registro'; // Importa tu componente de registro

const BarraMenu = () => {
    const [showOffcanvas, setShowOffcanvas] = useState(false);
    const [showModal, setShowModal] = useState(false);

    const handleCloseModal = () => setShowModal(false);
    const handleShowModal = () => setShowModal(true);

    return (
        <>
            <Navbar expand="lg" variant="fondo" className="navbar navbar-expand-lg">
                <div className='container-fluid'>
                    <img src={logo} alt="logo" style={{ height: '3rem' }} />
                    <Navbar.Brand className="navbar-brand" href="/">MONITOREO</Navbar.Brand>
                    <Navbar className="navbar-toggler fas fa-bars" aria-controls="offcanvasNavbar" onClick={() => setShowOffcanvas(!showOffcanvas)} />
                    <div className="collapse navbar-collapse">
                        <NavLink classNameNav="navbar-nav ms-auto mb-2 mb-lg-0" handleShowModal={handleShowModal} />
                    </div>
                    <Offcanvas show={showOffcanvas} onHide={() => setShowOffcanvas(false)} placement="end" target="#offcanvasNavbar">
                        <Offcanvas.Header closeButton>
                            <Offcanvas.Title>OPCIONES</Offcanvas.Title>
                        </Offcanvas.Header>
                        <Offcanvas.Body className="offcanvas-body">
                            <NavLink classNameNav="navbar-nav justify-content-end flex-grow-1 pe-3" handleShowModal={handleShowModal} />
                        </Offcanvas.Body>
                    </Offcanvas>
                </div>
            </Navbar>

            <Modal show={showModal} onHide={handleCloseModal} size="lg" dialogClassName="modal-90w">
                <Modal.Header closeButton>
                    <Modal.Title>Registro de usuarios</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Registro />
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={handleCloseModal}>
                        Cerrar
                    </Button>
                </Modal.Footer>
            </Modal>
        </>
    );
};

const NavLink = ({ classNameNav, handleShowModal }) => {
    const rolA = getRol();
    const navigate = useNavigate();
    const [showDropdown, setShowDropdown] = useState(false);
    const token = getToken();

    const handleCerrarSesion = () => {
        borrarSesion();
        navigate('/');
    };

    const toggleDropdown = () => {
        setShowDropdown(!showDropdown);
    };

    return (
        <Nav className={classNameNav}>
            <Nav.Link href="/" style={navLinkStyle}><i className="fas fa-home"></i> Inicio</Nav.Link>

            {token && (<Nav.Link href="/perfil" style={navLinkStyle}><i className="fas fa-user"></i> Perfil</Nav.Link>)}
            {token && (<Nav.Link href="/graficas" style={navLinkStyle}><i class="fas fa-chart-column"></i> Gráficas</Nav.Link>)}
            {token && (<Nav.Link href="/historial" style={navLinkStyle}><i class="fas fa-folder-open"></i> Historial</Nav.Link>)}
            {rolA === 'ADMINISTRADOR' && <Nav.Link href="/usuarios" style={navLinkStyle}><i className="fas fa-users"></i> Usuarios</Nav.Link>}
            {rolA === 'ADMINISTRADOR' && <Nav.Link href="/sensores" style={navLinkStyle}><i className="fas fa-microchip"></i> Sensores</Nav.Link>}
            {token && (<Nav.Link href="/conocenos" style={navLinkStyle}><i class="fas fa-info-circle"></i> Conócenos</Nav.Link>)}
            {!token && (
                <li className="nav-item dropdown" onClick={toggleDropdown}>
                    <span className="nav-link" style={navLinkStyle}><i className="fas fa-user-circle"></i> Mi cuenta</span>
                    <ul className={`dropdown-menu ${showDropdown ? 'show' : ''}`}>
                        <Nav.Link as="span" className="dropdown-item" style={navLinkStyle} onClick={handleShowModal}><i className="fas fa-user-plus"></i> Registrarse</Nav.Link>
                        <Link to="/iniciar-sesion" className="dropdown-item" style={navLinkStyle}><i className="fas fa-sign-in-alt"></i> Iniciar sesión</Link>
                    </ul>
                </li>
            )}
            {token && <Nav.Link href="/" onClick={handleCerrarSesion} style={navLinkStyle}><i className="fas fa-sign-out-alt"></i> Cerrar sesión</Nav.Link>}
        </Nav>
    );
};

const navLinkStyle = {
    marginRight: '10px',
};

export default BarraMenu;