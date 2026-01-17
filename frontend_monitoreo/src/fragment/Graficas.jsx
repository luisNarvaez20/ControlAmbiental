import React, { useEffect, useState } from 'react';
import '../components/css/style.css';
import BarraMenu from './BarraMenu';
import LineChartJS from '../utilidades/LineChartJS';
import { PeticionGet } from '../hooks/Conexion';
import { getToken } from '../utilidades/Sessionutil';

const MapComponent = () => {
    const [filtro, setFiltro] = useState('dia'); // Estado para controlar la selección del filtro
    const [dataGraficaDiaActual, setDataGraficaDiaActual] = useState({
        dataPorDispositivos: {
            dispositivo1: {
                nombre: 'Temperatura',
                listacolumna1: {
                    datos: []
                },
                listacolumna2: {
                    nombreColumna: 'Temperatura (°C)',
                    datos: []
                }
            },
            dispositivo2: {
                nombre: 'Humedad',
                listacolumna1: {
                    datos: []
                },
                listacolumna2: {
                    nombreColumna: 'Humedad (%)',
                    datos: []
                }
            },
            dispositivo3: {
                nombre: 'CO2',
                listacolumna1: {
                    datos: []
                },
                listacolumna2: {
                    nombreColumna: 'CO2 (ppm)',
                    datos: []
                }
            }
        }
    });

    const handleFiltroChange = async (event) => {
        setFiltro(event.target.value); // Actualizar el estado según la opción seleccionada
    };

    useEffect(() => {
        const fetchData = async () => {
            try {
                let responseTemperatura, responseHumedad, responseCO2;

                if (filtro === 'dia') {
                    responseTemperatura = await PeticionGet(getToken(), '/datos/temperaturaDia');
                    responseHumedad = await PeticionGet(getToken(), '/datos/humedadDia');
                    responseCO2 = await PeticionGet(getToken(), '/datos/co2Dia');
                } else if (filtro === 'semana') {
                    responseTemperatura = await PeticionGet(getToken(), '/datos/temperaturaSemana');
                    responseHumedad = await PeticionGet(getToken(), '/datos/humedadSemana');
                    responseCO2 = await PeticionGet(getToken(), '/datos/co2Semana');
                }

                // Procesar datos de Temperatura
                const temperaturaData = responseTemperatura.info.map(dato => ({
                    fecha: dato.fecha,
                    hora: dato.hora,
                    dato: dato.dato
                }));
                setDataGraficaDiaActual(prevState => ({
                    ...prevState,
                    dataPorDispositivos: {
                        ...prevState.dataPorDispositivos,
                        dispositivo1: {
                            ...prevState.dataPorDispositivos.dispositivo1,
                            listacolumna1: {
                                datos: temperaturaData.map(d => filtro === 'dia' ? d.hora : d.fecha)
                            },
                            listacolumna2: {
                                ...prevState.dataPorDispositivos.dispositivo1.listacolumna2,
                                datos: temperaturaData.map(d => d.dato)
                            }
                        }
                    }
                }));

                // Procesar datos de Humedad
                const humedadData = responseHumedad.info.map(dato => ({
                    fecha: dato.fecha,
                    hora: dato.hora,
                    dato: dato.dato
                }));
                setDataGraficaDiaActual(prevState => ({
                    ...prevState,
                    dataPorDispositivos: {
                        ...prevState.dataPorDispositivos,
                        dispositivo2: {
                            ...prevState.dataPorDispositivos.dispositivo2,
                            listacolumna1: {
                                datos: humedadData.map(d => filtro === 'dia' ? d.hora : d.fecha)
                            },
                            listacolumna2: {
                                ...prevState.dataPorDispositivos.dispositivo2.listacolumna2,
                                datos: humedadData.map(d => d.dato)
                            }
                        }
                    }
                }));

                // Procesar datos de CO2
                const co2Data = responseCO2.info.map(dato => ({
                    fecha: dato.fecha,
                    hora: dato.hora,
                    dato: dato.dato
                }));
                setDataGraficaDiaActual(prevState => ({
                    ...prevState,
                    dataPorDispositivos: {
                        ...prevState.dataPorDispositivos,
                        dispositivo3: {
                            ...prevState.dataPorDispositivos.dispositivo3,
                            listacolumna1: {
                                datos: co2Data.map(d => filtro === 'dia' ? d.hora : d.fecha)
                            },
                            listacolumna2: {
                                ...prevState.dataPorDispositivos.dispositivo3.listacolumna2,
                                datos: co2Data.map(d => d.dato)
                            }
                        }
                    }
                }));

            } catch (error) {
                console.error('Error al obtener datos:', error);
            }
        };

        fetchData();
    }, [filtro]); // Dependencia de useEffect: filtro

    const renderClasificacion = (dispositivoKey) => {
        switch (dispositivoKey) {
            case 'dispositivo1':
                return (
                    <>
                        <tr>
                            <td>Altas Temperaturas</td>
                            <td className='text-center'> Mayor a 28 °C </td>
                            <td className='text-center'>
                                <div style={{ display: 'inline-block', width: '20px', height: '20px', backgroundColor: '#ff2600' }}></div>
                            </td>
                        </tr>
                        <tr>
                            <td>Temperatura Normal</td>
                            <td className='text-center'> Entre 16 - 28 °C </td>
                            <td className='text-center'>
                                <div style={{ display: 'inline-block', width: '20px', height: '20px', backgroundColor: '#ee823b' }}></div>
                            </td>
                        </tr>
                        <tr>
                            <td>Bajas Temperaturas</td>
                            <td className='text-center'> Menor a 16 °C </td>
                            <td className='text-center'>
                                <div style={{ display: 'inline-block', width: '20px', height: '20px', backgroundColor: '#ebdb52' }}></div>
                            </td>
                        </tr>

                    </>
                );
            case 'dispositivo2':
                return (
                    <>
                        <tr>
                            <td>Humedad Alta</td>
                            <td className='text-center'> Mayor a 70% </td>
                            <td className='text-center'>
                                <div style={{ display: 'inline-block', width: '20px', height: '20px', backgroundColor: '#0b0427' }}></div>
                            </td>
                        </tr>
                        <tr>
                            <td>Humedad Normal</td>
                            <td className='text-center'> Entre 30% - 70% </td>
                            <td className='text-center'>
                                <div style={{ display: 'inline-block', width: '20px', height: '20px', backgroundColor: '#0d4f81' }}></div>
                            </td>
                        </tr>
                        <tr>
                            <td>Ambiente Seco</td>
                            <td className='text-center'> Menor a 30% </td>
                            <td className='text-center'>
                                <div style={{ display: 'inline-block', width: '20px', height: '20px', backgroundColor: '#afc7df' }}></div>
                            </td>
                        </tr>

                    </>
                );
            case 'dispositivo3':
                return (
                    <>
                        <tr>
                            <td>Alta Cantidad de Gases</td>
                            <td className='text-center'> Mayor a 1000 ppm </td>
                            <td className='text-center'>
                                <div style={{ display: 'inline-block', width: '20px', height: '20px', backgroundColor: '#347210' }}></div>
                            </td>
                        </tr>
                        <tr>
                            <td>Moderada Cantidad de Gases</td>
                            <td className='text-center'> Entre 600 - 1000 ppm </td>
                            <td className='text-center'>
                                <div style={{ display: 'inline-block', width: '20px', height: '20px', backgroundColor: '#36ab2b' }}></div>
                            </td>
                        </tr>
                        <tr>
                            <td>Aire Puro</td>
                            <td className='text-center'> Menor a 600 ppm </td>
                            <td className='text-center'>
                                <div style={{ display: 'inline-block', width: '20px', height: '20px', backgroundColor: '#a4e480' }}></div>
                            </td>
                        </tr>
                    </>
                );
            default:
                return null;
        }
    };

    return (
        <div>
            <header>
                <BarraMenu />
            </header>
            <main>
                <div className='container-fluid'>
                    <div className='row justify-content-center mt-4 mb-4'>
                        <div className="col-12 col-lg-8 col-xxl-7 d-flex">
                            <LineChartJS data={dataGraficaDiaActual} nombreFoto="AulaMagna" />
                        </div>
                        <div className='col-12 col-lg-4 col-xxl-4 d-flex'>
                            <div className="shadow-lg p-4 flex-fill w-100">
                                <div className="mx-auto w-100">
                                    <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                                        <div className="content-select">
                                            <label className="texto-primario-h4">Filtrar por periodo:</label>&nbsp;
                                            <select id="filtro" value={filtro} onChange={handleFiltroChange}>
                                                <option value="dia">Día</option>
                                                <option value="semana">Semana</option>
                                            </select>
                                        </div>
                                    </div>
                                    {Object.keys(dataGraficaDiaActual.dataPorDispositivos).map((dispositivoKey, index) => (
                                        <div key={index} style={{ marginBottom: "250px", marginTop: "75px" }}>
                                            <h3 className="texto-primario-h3">{dataGraficaDiaActual.dataPorDispositivos[dispositivoKey].nombre}</h3>
                                            <div className="crud shadow-lg p-3 mb-5 bg-body rounded" style={{ display: 'flex', flexDirection: 'column' }}>
                                                <div className="col">
                                                    <div className="table-responsive">
                                                        <table className="table table-striped">
                                                            <thead>
                                                                <tr>
                                                                    <th>CLASIFICACIÓN</th>
                                                                    <th>RANGO</th>
                                                                    <th>COLOR</th>
                                                                </tr>
                                                            </thead>
                                                            <tbody>
                                                                {renderClasificacion(dispositivoKey)}
                                                            </tbody>
                                                        </table>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </main>
        </div>
    );
};

export default MapComponent;