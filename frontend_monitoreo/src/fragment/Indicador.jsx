import React, { useState, useEffect } from 'react';
import ToggleButton from '@mui/material/ToggleButton';
import ToggleButtonGroup from '@mui/material/ToggleButtonGroup';
import { PeticionGetSinToken } from '../hooks/Conexion';
import * as metricas from '../utilidades/constantes/metricas.js';
import { TIMEREFETCHING } from '../utilidades/constantes/refetching';
import '../components/css/indicador.css'; 

export const Indicador = () => {
    const [nivelGeneral, setNivelGeneral] = useState();

    useEffect(() => {
        const fetchData = () => {
            PeticionGetSinToken('datos/ultimosDatos').then(response => {
                const { temperatura, humedad, co2 } = response.info;
                const tempValue = parseFloat(temperatura.dato);
                const humedadValue = parseFloat(humedad.dato);
                const co2Value = parseFloat(co2.dato);

                const nivel = determinarNivelGeneral(tempValue, humedadValue, co2Value);
                setNivelGeneral(nivel);
            });
        };

        fetchData();

        const interval = setInterval(fetchData, TIMEREFETCHING);
        return () => clearInterval(interval);
    }, []);

    const determinarNivelGeneral = (temperatura, humedad, co2) => {
        if (temperatura > metricas.TEMPERATURA_CRITICA || 
            humedad > metricas.HUMEDAD_CRITICA_ALTA || 
            humedad < metricas.HUMEDAD_CRITICA_BAJA || 
            co2 > metricas.CO2_CRITICO) {
            return 'Crítico';
        } else if ((temperatura < metricas.TEMPERATURA_DEFICIENTE_BAJA || temperatura >= metricas.TEMPERATURA_DEFICIENTE_ALTA) || 
                   (humedad >= metricas.HUMEDAD_DEFICIENTE && humedad <= metricas.HUMEDAD_CRITICA_ALTA) || 
                   (co2 >= metricas.CO2_DEFICIENTE && co2 <= metricas.CO2_CRITICO)) {
            return 'Deficiente';
        } else if ((temperatura >= metricas.TEMPERATURA_ACEPTABLE_BAJA && temperatura < metricas.TEMPERATURA_OPTIMA_BAJA) || 
                   (temperatura > metricas.TEMPERATURA_OPTIMA_ALTA && temperatura <= metricas.TEMPERATURA_ACEPTABLE_ALTA) || 
                   (humedad >= metricas.HUMEDAD_ACEPTABLE && humedad < metricas.HUMEDAD_DEFICIENTE) || 
                   (co2 >= metricas.CO2_ACEPTABLE && co2 < metricas.CO2_DEFICIENTE)) {
            return 'Aceptable';
        } else if ((temperatura >= metricas.TEMPERATURA_OPTIMA_BAJA && temperatura <= metricas.TEMPERATURA_OPTIMA_ALTA) && 
                   (humedad >= metricas.HUMEDAD_OPTIMA_BAJA && humedad <= metricas.HUMEDAD_OPTIMA_ALTA) && 
                   (co2 >= metricas.CO2_OPTIMO && co2 < metricas.CO2_ACEPTABLE)) {
            return 'Óptimo';
        } else {
            return 'Desconocido';
        }
    };

    return (
        <div className="container-fluid d-flex flex-column align-items-center">
            <ToggleButtonGroup
                value={nivelGeneral}
                exclusive
                aria-label="Indicador General"
                className="toggle-button-group"
            >
                <ToggleButton
                    value="Óptimo"
                    disabled={nivelGeneral !== 'Óptimo'}
                    className={`btn ${nivelGeneral === 'Óptimo' ? 'bg-success text-white' : ''} toggle-button`}
                >
                    Óptimo
                </ToggleButton>
                <ToggleButton
                    value="Aceptable"
                    disabled={nivelGeneral !== 'Aceptable'}
                    className={`btn ${nivelGeneral === 'Aceptable' ? 'bg-info text-white' : ''} toggle-button`}
                >
                    Aceptable
                </ToggleButton>
                <ToggleButton
                    value="Deficiente"
                    disabled={nivelGeneral !== 'Deficiente'}
                    className={`btn ${nivelGeneral === 'Deficiente' ? 'bg-warning text-dark' : ''} toggle-button`}
                >
                    Deficiente
                </ToggleButton>
                <ToggleButton
                    value="Crítico"
                    disabled={nivelGeneral !== 'Crítico'}
                    className={`btn ${nivelGeneral === 'Crítico' ? 'bg-danger text-white' : ''} toggle-button`}
                >
                    Crítico
                </ToggleButton>
            </ToggleButtonGroup>
        </div>
    );
};