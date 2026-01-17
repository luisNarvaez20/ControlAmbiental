import React, { useState, useEffect } from 'react';
import { Line } from 'react-chartjs-2';
import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    Tooltip,
    Legend,
    Filler,
} from 'chart.js';
import { PeticionGet } from '../hooks/Conexion';
import { getToken } from '../utilidades/Sessionutil';

// Registro de componentes necesarios para el gráfico
ChartJS.register(
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    Tooltip,
    Legend,
    Filler
);

const getPointBackgroundColor = (value, dispositivo) => {
    if (dispositivo === 'temperatura') {
        if (value < 16) return '#ebdb52';
        if (value <= 28) return '#ee823b';
        return '#ff2600';
    } else if (dispositivo === 'humedad') {
        if (value < 30) return '#afc7df';
        if (value <= 70) return '#0d4f81';
        return '#0b0427';
    } else if (dispositivo === 'co2') {
        if (value < 600) return '#a4e480';
        if (value <= 1000) return '#36ab2b';
        return '#347210';
    }
    return 'rgba(12, 35, 65)';
};

const DailyCharts = ({ selectedChart }) => {
    const [chartData, setChartData] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchData = async () => {
            setLoading(true);
            try {
                let response;
                if (selectedChart === 'temperatura') {
                    response = await PeticionGet(getToken(), 'datos/temperaturaDia');
                } else if (selectedChart === 'humedad') {
                    response = await PeticionGet(getToken(), 'datos/humedadDia');
                } else if (selectedChart === 'co2') {
                    response = await PeticionGet(getToken(), 'datos/co2Dia');
                }

                console.log('Datos recibidos:', response); // Verifica la estructura de los datos

                if (response && response.info) {
                    setChartData({
                        labels: response.info.map(d => d.hora || d.fecha), // Ajustar según los datos
                        datasets: [
                            {
                                label: selectedChart.charAt(0).toUpperCase() + selectedChart.slice(1),
                                data: response.info.map(d => d.dato),
                                backgroundColor: 'rgba(211, 211, 211, 0.5)', 
                                tension: 0.5,
                                fill: true,
                                pointRadius: 5,
                                pointBackgroundColor: response.info.map(d => getPointBackgroundColor(d.dato, selectedChart)),
                            }
                        ],
                    });
                } else {
                    console.error('No se recibieron datos válidos:', response);
                    setChartData(null);
                }
            } catch (error) {
                console.error('Error al obtener los datos:', error);
                setChartData(null);
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, [selectedChart]); // Solo incluir 'selectedChart' en las dependencias

    const options = {
        scales: {
            y: {
                min: 0,
            },
            x: {
                ticks: { color: 'rgb(12, 35, 65)' },
            },
        },
    };

    return (
        <div>
            {loading ? (
                <p>Cargando datos ...</p>
            ) : chartData ? (
                <div className="w-100 mb-2">
                    <Line data={chartData} options={options} />
                </div>
            ) : (
                <p>Datos no disponibles</p>
            )}
        </div>
    );
};

export default DailyCharts;