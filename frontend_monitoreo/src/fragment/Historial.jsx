import React, { useState, useEffect, useCallback } from 'react';
import BarraMenu from './BarraMenu';
import 'bootstrap/dist/css/bootstrap.min.css';
import { PeticionGet } from '../hooks/Conexion';
import { getToken } from '../utilidades/Sessionutil';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import * as metricas from '../utilidades/constantes/metricas.js'; // Ajusta la ruta según tu estructura

const Historial = () => {
  const [datos, setDatos] = useState([]);
  const [paginaActual, setPaginaActual] = useState(1);
  const [totalPaginas, setTotalPaginas] = useState(0);
  const itemsPorPagina = 20;
  const [fechaSeleccionada, setFechaSeleccionada] = useState(null);
  const token = getToken();

  const agruparDatos = useCallback((datos) => {
    const historialAgrupado = {};
    datos.forEach((dato) => {
      const key = `${dato.fecha} ${dato.hora}`;
      if (historialAgrupado[key]) {
        historialAgrupado[key][dato.id_sensor - 1] = dato.dato;
      } else {
        historialAgrupado[key] = Array(3).fill('-');
        historialAgrupado[key][dato.id_sensor - 1] = dato.dato;
      }
    });

    return Object.keys(historialAgrupado).map((key) => {
      const [humedad, temperatura, co2] = historialAgrupado[key];
      return {
        fechaHora: key,
        temperatura: temperatura,
        humedad: humedad,
        co2: co2,
        estadoAula: determinarNivelGeneral(parseFloat(temperatura), parseFloat(humedad), parseFloat(co2)),
      };
    });
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

  const fetchData = useCallback(async () => {
    try {
      const fechaFormatted = fechaSeleccionada ? fechaSeleccionada.toISOString().slice(0, 10) : '';
      const response = await PeticionGet(token, `/datosBusqueda?pagina=${paginaActual}&items=${itemsPorPagina}&fecha=${fechaFormatted}`);
      const historialAgrupado = agruparDatos(response.info);
      setDatos(historialAgrupado);
      setTotalPaginas(Math.ceil(response.total / (itemsPorPagina * 3)));
    } catch (error) {
      console.error(error);
    }
  }, [paginaActual, fechaSeleccionada, token, agruparDatos]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const handlePaginaAnterior = () => {
    if (paginaActual > 1) {
      setPaginaActual(paginaActual - 1);
    }
  };

  const handlePaginaSiguiente = () => {
    if (paginaActual < totalPaginas) {
      setPaginaActual(paginaActual + 1);
    }
  };

  const handleFechaSeleccionada = (date) => {
    setFechaSeleccionada(date);
    setPaginaActual(1);
  };

  return (
    <div>
      <header>
        <BarraMenu />
      </header>
      <div className="container-fluid">
        <h1 className="texto-primario-h3 mb-3">HISTORIAL</h1>
        <div className="row mb-3 align-items-center">
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            <div className="content-select">
              <label className="texto-primario-h4 me-2 mb-0">Buscar por fecha:</label>&nbsp;
              <DatePicker
                selected={fechaSeleccionada}
                onChange={handleFechaSeleccionada}
                dateFormat="dd/MM/yyyy"
                isClearable
                placeholderText="Seleccione una fecha"
                className="form-control"
              />
            </div>
          </div>
        </div>
        <section>
          <div className="crud shadow-lg p-3 mb-5 bg-body rounded">
            <div className="table-responsive">
              <table className="table table-striped">
                <thead>
                  <tr>
                    <th>Fecha y Hora</th>
                    <th>Temperatura (°C)</th>
                    <th>Humedad (%)</th>
                    <th>CO2 (ppm)</th>
                    <th>Estado del aula</th>
                  </tr>
                </thead>
                <tbody>
                  {datos.map((dato, index) => (
                    <tr key={index}>
                      <td className='text-center'>{dato.fechaHora}</td>
                      <td className='text-center'>{dato.temperatura + " °C"}</td>
                      <td className='text-center'>{dato.humedad + " %"}</td>
                      <td className='text-center'>{dato.co2 + " ppm"}</td>
                      <td className='text-center'>{dato.estadoAula}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <div className="d-flex justify-content-between">
              <button
                className="btn btn-verde"
                onClick={handlePaginaAnterior}
                disabled={paginaActual === 1}
              >
                Página Anterior
              </button>
              <span>Página {paginaActual} de {totalPaginas}</span>
              <button
                className="btn btn-verde"
                onClick={handlePaginaSiguiente}
                disabled={paginaActual === totalPaginas}
              >
                Página Siguiente
              </button>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
};

export default Historial;