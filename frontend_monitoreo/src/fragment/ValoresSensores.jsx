import React, { useState, useEffect } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import GaugeChart from 'react-gauge-chart';
import { PeticionGetSinToken } from '../hooks/Conexion';
import { TIMEREFETCHING } from '../utilidades/constantes/refetching';

const ValoresSensores = () => {
    const [isLoading, setIsLoading] = useState(true);
    const [data, setData] = useState({ temperatura: null, humedad: null, co2: null });

    useEffect(() => {
        const fetchData = () => {
            PeticionGetSinToken('/datos/ultimosDatos').then(response => {
                const { temperatura, humedad, co2 } = response.info;
                setData({
                    temperatura: parseFloat(temperatura.dato),
                    humedad: parseFloat(humedad.dato),
                    co2: parseFloat(co2.dato)
                });
                setIsLoading(false);
            });
        };
        fetchData();
        const interval = setInterval(fetchData, TIMEREFETCHING);
        return () => clearInterval(interval);
    }, []);

    const ranges = {
        temperatura: [
            { min: 16, max: 24, level: 'Óptima' },
            { min: 14, max: 16, level: 'Aceptable' },
            { min: 24, max: 26, level: 'Aceptable' },
            { min: -Infinity, max: 14, level: 'Deficiente' },
            { min: 26, max: 28, level: 'Deficiente' },
            { min: 28, max: Infinity, level: 'Crítica' }
        ],
        humedad: [
            { min: 40, max: 50, level: 'Óptima' },
            { min: 50, max: 60, level: 'Aceptable' },
            { min: 60, max: 70, level: 'Deficiente' },
            { min: 70, max: Infinity, level: 'Crítica' },
            { min: -Infinity, max: 40, level: 'Crítica' }
        ],
        co2: [
            { min: 0, max: 400, level: 'Óptima' },
            { min: 400, max: 600, level: 'Aceptable' },
            { min: 600, max: 800, level: 'Deficiente' },
            { min: 800, max: Infinity, level: 'Crítica' }
        ]
    };

    const evaluateRange = (value, ranges) => {
        for (let i = 0; i < ranges.length; i++) {
            if (value >= ranges[i].min && value <= ranges[i].max) {
                return ranges[i].level;
            }
        }
        return 'Desconocido';
    };

    const getLevelIndex = (level) => {
        const levels = ['Óptima', 'Aceptable', 'Deficiente', 'Crítica'];
        return levels.indexOf(level);
    };

    const gaugeColors = {
        temperatura: ['#5BE12C', '#F5CD19', '#E36B2C', '#EA4228'],
        humedad: ['#2A93D5', '#2268A9','#1A3C6D', '#E36B2'],
        co2: ['#FF7F50', '#FF6347', '#CD5C5C', '#C00000']
    };

    const formatValue = (value, unit) => {
        switch(unit) {
            case '°C': return `${value.toFixed(2)}°C`;
            case '%': return `${value.toFixed(2)}%`;
            case 'ppm': return `${value.toFixed(2)} ppm`;
            default: return value.toFixed(2);
        }
    };

    const renderGauge = (key, label, unit) => {
        if (data[key] === null) return null;
        const level = evaluateRange(data[key], ranges[key]);
        const levelIndex = getLevelIndex(level);
        const percent = (levelIndex + 1) / 4;  // 4 es el número total de niveles

        return (
            <div className="text-center m-2">
                <p>{label}</p>
                <GaugeChart
                    id={`gauge-${key}`}
                    nrOfLevels={4}
                    colors={gaugeColors[key]}
                    percent={percent}
                    arcPadding={0.02}
                    cornerRadius={4}
                    textColor="#000000"
                    needleColor="#345243"
                    needleBaseColor="#345243"
                    animate={false}
                    needleTransition="none"
                    formatTextValue={() => formatValue(data[key], unit)}
                />
            </div>
        );
    };

    return (
        <div className="d-flex flex-row justify-content-center align-items-center mb-4">
            {isLoading ? (
                <div className="text-center w-100">
                    <div className="spinner-border" role="status">
                        <span className="visually-hidden">Loading...</span>
                    </div>
                </div>
            ) : (
                <div className="d-flex flex-wrap justify-content-center">
                    {renderGauge('temperatura', 'TEMPERATURA', '°C')}
                    {renderGauge('humedad', 'HUMEDAD', '%')}
                    {renderGauge('co2', 'CO2', 'ppm')}
                </div>
            )}
        </div>
    );
}

export default ValoresSensores;
