import React from 'react';
import '../components/css/style.css';
import logo from '../logo.png';
import logo_c from '../logo_c.png';
import BarraMenu from './BarraMenu';


export const Conocenos = () => {
  return (
    <div>
      <header>
        <BarraMenu />
      </header>
      <main>
        <div className="p-4 row">
          <div className="col-sm-10 mt-5 mb-4 ml-4 ">
            <h2 className='texto-subtitulo-1'>CONÓCENOS</h2>
          </div>
        </div>
        <div className='container-tabla p-2'>
          <div className='crud shadow-lg '>
            <div className="row">
              <div className="col-md-4 p-4 d-flex align-items-center justify-content-center order-md-first">
                <img src={logo} alt="MONITOREO" className="img-fluid" style={{ maxHeight: '100%' }} />
              </div>
              <div className="col-md-8 order-md-last">
                <div className="p-4">
                  <h4 className='texto-primario-h2'>MISIÓN DEL PROYECTO</h4>
                  <p style={{ textAlign: 'justify' }}>
                  Nuestra misión es desarrollar e implementar una estación integrada de monitoreo ambiental en tiempo real para el Aula Magna de la Universidad Nacional de Loja (UNL), a través de una aplicación web. Nos dedicamos a proporcionar una solución tecnológica innovadora y precisa para la recolección, análisis y visualización en tiempo real de datos críticos como temperatura, humedad y niveles de CO2.
                  Nuestro compromiso es facilitar la toma de decisiones fundamentadas para optimizar las condiciones ambientales del Aula Magna, garantizando así el confort y la seguridad de estudiantes y personal docente. A través de nuestra plataforma accesible, buscamos empoderar a docentes, estudiantes y autoridades universitarias con información ambiental crucial, promoviendo un entorno de aprendizaje saludable, eficiente y consciente del medio ambiente.
                  </p>
                </div>
              </div>
            </div>
            <div className="row">
              <div className="col-md-8 order-md-first">
                <div className="p-4">
                  <h4 className='texto-primario-h2'>VISIÓN DEL PROYECTO</h4>
                  <p style={{ textAlign: 'justify' }}>
                    Nuestra visión es ser líderes en el desarrollo y aplicación de tecnologías innovadoras para el monitoreo ambiental en espacios educativos. Aspiramos a ser reconocidos a nivel local, estableciendo colaboraciones estratégicas con instituciones educativas, organizaciones de salud y comunidades locales. Nuestro objetivo es implementar soluciones integrales que mejoren la calidad del aire interior y promuevan ambientes de aprendizaje saludables y seguros.
                  </p>
                </div>
              </div>
              <div className="col-md-4 p-4 d-flex align-items-center justify-content-center order-md-last">
                <img src={logo_c} alt="LogoCarr" className="img-fluid" style={{ maxHeight: '100%', height: '239px' }} />
              </div>
            </div>
          </div>
        </div>
        <div className="p-4 row">
          <div className="col-sm-10 mt-5 mb-4 ml-4 ">
            <h2 className='texto-subtitulo-1'>INTEGRANTES DEL GRUPO</h2>
          </div>
        </div>
        <div className='container-tabla p-2'>
          <div className='crud shadow-lg p-2 '>
            <div className="services" style={{ marginTop: 60 + 'px' }}>
              <div className="service">
                {/**<a href={miembro1} target="_blank"><img className='miembro' src={miembro1} alt="img"></img></a>*/}
                <h3><a href="https://github.com/Thaisncp" style={{ color: '#36ab2b' }} target="_blank"  rel="noopener noreferrer">THAIS CARTUCHE</a></h3>
                <h4>Líder del equipo</h4> <br />
                thais.cartuche@unl.edu.ec <br />
                +593 99 065 4321 <br />
              </div>
              <div className="service">
                {/**<a href={miembro2} target="_blank"><img className='miembro' src={miembro2} alt="img"></img></a>*/}
                <h3><a href="https://github.com/luisNarvaez20" style={{ color: '#36ab2b' }} target="_blank"  rel="noopener noreferrer">LUIS NARVAEZ</a></h3>
                <h4>Miembro del equipo</h4> <br />
                luis.a.narvaez@unl.edu.ec <br />
                +593 98 367 2082 <br />
              </div>
              <div className="service">
                {/**<a href={miembro3} target="_blank"><img className='miembro' src={miembro3} alt="img"></img></a>*/}
                <h3><a href="https://github.com/lettcriss2003" style={{ color: '#36ab2b' }} target="_blank"  rel="noopener noreferrer">LETTY ROJAS</a></h3>
                <h4>Miembro del equipo</h4> <br />
                letty.rojas@unl.edu.ec <br />
                +593 98 790 2694 <br />
              </div>
              <div className="service">
                {/**<a href={miembro4} target="_blank"><img className='miembro' src={miembro4} alt="img"></img></a>*/}
                <h3><a href="https://github.com/Maryuri931" style={{ color: '#36ab2b' }} target="_blank"  rel="noopener noreferrer">MARYURI CONDOY</a></h3>
                <h4>Miembro del equipo</h4> <br />
                mayuri.condoy@unl.edu.ec <br />
                +593 98 963 0322 <br />
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};


