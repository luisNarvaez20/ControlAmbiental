import React, { useState, useEffect } from 'react';
import BarraMenu from './BarraMenu';
import 'bootstrap/dist/css/bootstrap.min.css';
import ValoresSensores from '../fragment/ValoresSensores';
import DailyCharts from '../utilidades/DailyCharts';
import { Tooltip, IconButton, FormControl, InputLabel, Select, MenuItem, Card, CardContent, Typography } from '@mui/material';
import InfoOutlinedIcon from '@mui/icons-material/InfoOutlined';
import DrawerIndicador from '../fragment/DrawerIndicator';
import { Indicadores } from '../fragment/TablaIndicadores';
import { Indicador } from '../fragment/Indicador';
import { PeticionGet } from '../hooks/Conexion';
import '../components/css/style.css';

const Principal = () => {
    const [isDrawerOpen, setIsDrawerOpen] = useState(false);
    const [selectedChart, setSelectedChart] = useState('temperatura');
    const [promedio, setPromedio] = useState({
        temperatura: 0,
        humedad: 0,
        co2: 0,
    });

    const toggleDrawer = (open) => (event) => {
        if (event && event.type === 'keydown' && (event.key === 'Tab' || event.key === 'Shift')) {
            return;
        }
        setIsDrawerOpen(open);
    };

    const handleChartChange = (event) => {
        setSelectedChart(event.target.value);
    };

    useEffect(() => {
        const fetchPromedio = async () => {
            try {
                const response = await PeticionGet('', 'datos/promedio'); // Llama a la función con la ruta y el token vacío
                if (response.code === 200) {
                    // Redondea los valores a 3 decimales
                    setPromedio({
                        temperatura: parseFloat(response.info.temperatura).toFixed(3),
                        humedad: parseFloat(response.info.humedad).toFixed(3),
                        co2: parseFloat(response.info.co2).toFixed(3),
                    });
                }
            } catch (error) {
                console.error('Error fetching average data:', error);
            }
        };

        fetchPromedio();
    }, []);

    return (
        <div>
            <header>
                <BarraMenu />
            </header>
            <section className="container-fluid d-flex flex-column align-items-center">
                <div className="row mt-4 w-100">
                    <div className="col-md-12 d-flex justify-content-center">
                        <div className="position-relative d-inline-flex align-items-center">
                            <h1 className="text-center mb-0 mx-2">Monitoreo del aire en el Aula Magna</h1>
                        </div>
                    </div>
                </div>

                <div className="row mt-4 w-100 justify-content-center">
                    <div className="row">
                        <div className="col-md-4 d-flex flex-column justify-content-center">
                        <p className="text-center">Rangos de calidad del aire: </p>
                            <div className="table-responsive">
                                <table className="table table-striped text-center">
                                    <thead>
                                        <tr>
                                            <th>Indicador</th>
                                            <th colSpan="3">Rango</th>
                                        </tr>
                                        <tr>
                                            <th></th>
                                            <th>Temperatura</th>
                                            <th>Humedad</th>
                                            <th>CO2</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        <tr>
                                            <td>Óptima</td>
                                            <td>16 °C a 24°C</td>
                                            <td>40% a 50%</td>
                                            <td>0 ppm a 400 ppm</td>
                                        </tr>
                                        <tr>
                                            <td>Aceptable</td>
                                            <td>14°C a 16 °C y de 24°C a 26°C</td>
                                            <td>50% a 60%</td>
                                            <td>400 ppm a 600 ppm</td>
                                        </tr>
                                        <tr>
                                            <td>Deficiente</td>
                                            <td>menor a 14°C y de 26°C a 28°C</td>
                                            <td>60% a 70%</td>
                                            <td>600 ppm a 800 pm</td>
                                        </tr>
                                        <tr>
                                            <td>Crítica</td>
                                            <td>Mayor a 28°C</td>
                                            <td>Por encima del 70% y por debajo del 40%</td>
                                            <td>Por encima de las 800 ppm</td>
                                        </tr>
                                    </tbody>
                                </table>
                            </div>
                            <div className="position-relative d-inline-flex">
                                <p className="text-center">Ver info: </p>
                                <Tooltip
                                    title="Ver métricas"
                                >
                                    <IconButton
                                        onClick={toggleDrawer(true)}
                                        style={{
                                            position: 'absolute',
                                            top: '-10px',
                                            left: '80px',
                                            backgroundColor: '#f0f0f0',
                                            boxShadow: '0 2px 5px rgba(0,0,0,0.2)',
                                        }}
                                    >
                                        <InfoOutlinedIcon />
                                    </IconButton>
                                </Tooltip>

                            </div>
                        </div>
                        <div className="col-md-8 mx-auto">
                            <div className="d-flex flex-column align-items-center">
                                <strong className="mb-3">Indicador actual de la calidad del aire:</strong>
                                <Indicador />
                            </div>
                            <div className="d-flex flex-column align-items-center">
                                <strong className="mb-3">Datos actuales</strong>
                                <ValoresSensores />
                            </div>
                        </div>
                    </div>
                </div>
                <div className="row mt-4 w-100">
                    <h3 className="text-center mb-4">Gráfica de datos del día</h3>
                    <div className="col-md-8 mb-4" style={{ padding: '25px', marginLeft: '300px' }}>
                        <FormControl fullWidth className="mb-8">
                            <InputLabel id="chart-select-label">Tipo de Gráfica</InputLabel>
                            <Select
                                labelId="chart-select-label"
                                id="chart-select"
                                value={selectedChart}
                                label="Tipo de Gráfica"
                                onChange={handleChartChange}
                            >
                                <MenuItem value="temperatura">Temperatura</MenuItem>
                                <MenuItem value="humedad">Humedad</MenuItem>
                                <MenuItem value="co2">CO2</MenuItem>
                            </Select>
                        </FormControl>
                    </div>
                    <div className="d-flex justify-content-center">
                        <div style={{ width: '325px', marginTop: '100px', marginRight: '50px' }}>
                            <Card
                                variant="outlined"
                                style={{
                                    border: '1px solid #ddd',
                                    boxShadow: '0 4px 6px rgba(0,0,0,0.1)',
                                    margin: '1rem',
                                }}
                            >
                                <CardContent>
                                    <Typography
                                        variant="h4"
                                        component="div"
                                        gutterBottom
                                        style={{ marginBottom: '2.5rem' }}
                                    >
                                        Promedio Diario
                                    </Typography>
                                    <Typography
                                        variant="h5"
                                        style={{ marginBottom: '1rem' }}
                                    >
                                        <strong>Temperatura:</strong> {promedio.temperatura} °C
                                    </Typography>
                                    <Typography
                                        variant="h5"
                                        style={{ marginBottom: '1rem' }}
                                    >
                                        <strong>Humedad:</strong> {promedio.humedad} %
                                    </Typography>
                                    <Typography
                                        variant="h5"
                                        style={{ marginBottom: '1rem' }}
                                    >
                                        <strong>CO2:</strong> {promedio.co2} ppm
                                    </Typography>
                                </CardContent>
                            </Card>
                        </div>
                        <div style={{ width: '65%', height: '400px', marginRight: '20px' }}>
                            <DailyCharts selectedChart={selectedChart} />
                        </div>
                    </div>
                </div>
                <DrawerIndicador
                    anchor="right"
                    open={isDrawerOpen}
                    toggleDrawer={toggleDrawer}
                    content={<Indicadores />}
                />
            </section>
        </div>
    );
};

export default Principal;