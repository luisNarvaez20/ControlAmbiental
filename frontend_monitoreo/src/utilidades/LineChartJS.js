import { Line } from 'react-chartjs-2';
import React, { useRef } from 'react';
import ExportOptions from './ExportOptions';
import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    Title,
    Tooltip,
    Legend,
    Filler,
} from 'chart.js';

ChartJS.register(
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    Title,
    Tooltip,
    Legend,
    Filler
);

const getPointBackgroundColor = (value, dispositivo) => {
    if (dispositivo === 'Temperatura') {
        if (value < 16) return '#ebdb52';
        if (value <= 28) return '#ee823b';
        return '#ff2600';
    } else if (dispositivo === 'Humedad') {
        if (value < 30) return '#afc7df';
        if (value <= 70) return '#0d4f81';
        return '#0b0427';
    } else if (dispositivo === 'CO2') {
        if (value < 600) return '#a4e480';
        if (value <= 1000) return '#36ab2b';
        return '#347210';
    }
    return 'rgba(12, 35, 65)';
};

export default function LineChartJS({ data, nombreFoto }) {
    const chartRef = useRef(null);

    const generarDatosYOptions = (dataDispositivo) => {
        const { listacolumna1, listacolumna2, nombre } = dataDispositivo;

        const midata = {
            labels: listacolumna1.datos,
            datasets: [
                {
                    label: listacolumna2.nombreColumna,
                    data: listacolumna2.datos,
                    tension: 0.5,
                    fill: true,
                    backgroundColor: 'rgba(211, 211, 211, 0.5)', 
                    pointRadius: 4,
                    pointBackgroundColor: listacolumna2.datos.map(value => getPointBackgroundColor(value, nombre)),
                },
            ],
        };

        const misoptions = {
            scales: {
                y: {
                    min: 0,
                },
                x: {
                    ticks: { color: 'rgb(12, 35, 65)' },
                },
            },
        };

        return { midata, misoptions };
    };

    return (
        <div className="flex-fill w-100">
            <div className="shadow-lg flex-fill w-100 mb-2" ref={chartRef}>
                <h5 className="texto-primario-h3 mb-0">GRAFICAS DE DATOS DIARIAS Y SEMANALES</h5>
                {data.dataPorDispositivos && Object.values(data.dataPorDispositivos).map((dataDispositivo, index) => {
                    const { midata, misoptions } = generarDatosYOptions(dataDispositivo);
                    return (
                        <div className="w-100 mb-2" key={index}>
                            <h5 className="texto-primario-h3 mb-0">{dataDispositivo.nombre.toUpperCase()}</h5>
                            <div className="card-body d-flex w-100 p-4">
                                <Line data={midata} options={misoptions} />
                            </div>
                        </div>
                    );
                })}
            </div>
            <h5 className="texto-primario-h3 mb-0">EXPORTAR DATOS SEMANALES</h5>
            <div className='p-4'>
                <div className="shadow-lg w-100 p-2 mb-2">
                    <ExportOptions chartRef={chartRef} nombreFoto={nombreFoto} />
                </div>
            </div>
        </div>
    );
}