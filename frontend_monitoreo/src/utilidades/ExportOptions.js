import React, { useState, useEffect } from 'react';
import * as XLSX from 'xlsx';
import { toPng } from 'html-to-image';
import jsPDF from 'jspdf';
import 'jspdf-autotable';
import { PeticionGet } from '../hooks/Conexion';
import { getToken } from './Sessionutil';

export default function ExportOptions({ chartRef, nombreFoto }) {
    const [data, setData] = useState(null); // Estado para almacenar los datos obtenidos
    const token = getToken();

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await PeticionGet(token, `/datos`);

                // Organizar los datos por tipo de sensor
                const temperaturaData = response.info.filter(item => item.id_sensor === 2);
                const humedadData = response.info.filter(item => item.id_sensor === 1);
                const co2Data = response.info.filter(item => item.id_sensor === 3);

                setData({ temperatura: temperaturaData, humedad: humedadData, co2: co2Data });

            } catch (error) {
                console.error('Error al obtener los datos:', error);
            }
        };

        fetchData(); // Obtener datos por defecto al montar el componente
    }, [token]); // Incluye 'token' en las dependencias

    const exportChart = () => {
        const node = chartRef.current;
        toPng(node)
            .then(function (dataUrl) {
                const link = document.createElement('a');
                link.download = `${nombreFoto}_chart_${Date.now()}.png`;
                link.href = dataUrl;
                link.click();
            });
    };

    const exportDataToExcel = async () => {
        try {
            if (!data || !data.temperatura || !data.humedad || !data.co2) {
                console.error('No hay datos completos para exportar a Excel.');
                return;
            }

            const excelData = data.temperatura.map((item, index) => ({
                Fecha: item.fecha,
                Hora: item.hora,
                Temperatura: item.dato,
                Humedad: data.humedad[index].dato,
                CO2: data.co2[index].dato,
            }));

            const wb = XLSX.utils.book_new();
            const ws = XLSX.utils.json_to_sheet(excelData);
            XLSX.utils.book_append_sheet(wb, ws, 'Datos Semanales');
            XLSX.writeFile(wb, `${nombreFoto}_week_data_${Date.now()}.xlsx`);

        } catch (error) {
            console.error('Error al exportar a Excel:', error);
        }
    };

    const exportDataToTxt = async () => {
        try {
            if (!data || !data.temperatura || !data.humedad || !data.co2) {
                console.error('No hay datos completos para exportar a TXT.');
                return;
            }

            const txtData = data.temperatura.map((item, index) => {
                return `${item.fecha} ${item.hora} ${item.dato} ${data.humedad[index].dato} ${data.co2[index].dato}\n`;
            }).join('');

            const blob = new Blob([txtData], { type: 'text/plain' });
            const url = URL.createObjectURL(blob);
            const link = document.createElement('a');
            link.href = url;
            link.setAttribute('download', `${nombreFoto}_week_data_${Date.now()}.txt`);
            link.click();

        } catch (error) {
            console.error('Error al exportar a TXT:', error);
        }
    };

    const exportDataToPdf = async () => {
        try {
            if (!data || !data.temperatura || !data.humedad || !data.co2) {
                console.error('No hay datos completos para exportar a PDF.');
                return;
            }

            const doc = new jsPDF();
            const titulo = `DATOS EXPORTADOS - ${nombreFoto} (Semana)`;
            const tituloX = doc.internal.pageSize.getWidth() / 2;
            const margenSuperiorTitulo = 15;
            doc.text(titulo, tituloX, margenSuperiorTitulo, { align: 'center' });

            const tableData = data.temperatura.map((item, index) => {
                return [
                    item.fecha,
                    item.hora,
                    item.dato,
                    data.humedad[index].dato,
                    data.co2[index].dato,
                ];
            });

            doc.autoTable({
                head: [['Fecha', 'Hora', 'Temperatura', 'Humedad', 'CO2']],
                body: tableData,
                startY: margenSuperiorTitulo + 10,
                styles: { overflow: 'linebreak' },
            });

            doc.save(`${nombreFoto}_week_data_${Date.now()}.pdf`);

        } catch (error) {
            console.error('Error al exportar a PDF:', error);
        }
    };

    const exportDataToCsv = async () => {
        try {
            if (!data || !data.temperatura || !data.humedad || !data.co2) {
                console.error('No hay datos completos para exportar a CSV.');
                return;
            }

            const csvData = data.temperatura.map((item, index) => ({
                Fecha: item.fecha,
                Hora: item.hora,
                Temperatura: item.dato,
                Humedad: data.humedad[index].dato,
                CO2: data.co2[index].dato,
            }));

            const csvContent = [
                ['Fecha', 'Hora', 'Temperatura', 'Humedad', 'CO2'],
                ...csvData.map(item => [
                    item.Fecha,
                    item.Hora,
                    item.Temperatura,
                    item.Humedad,
                    item.CO2
                ])
            ]
                .map(e => e.join(","))
                .join("\n");

            const blob = new Blob([csvContent], { type: 'text/csv' });
            const url = URL.createObjectURL(blob);
            const link = document.createElement('a');
            link.href = url;
            link.setAttribute('download', `${nombreFoto}_week_data_${Date.now()}.csv`);
            link.click();

        } catch (error) {
            console.error('Error al exportar a CSV:', error);
        }
    };

    const exportDataToJson = async () => {
        try {
            if (!data || !data.temperatura || !data.humedad || !data.co2) {
                console.error('No hay datos completos para exportar a JSON.');
                return;
            }

            const jsonData = data.temperatura.map((item, index) => ({
                Fecha: item.fecha,
                Hora: item.hora,
                Temperatura: item.dato,
                Humedad: data.humedad[index].dato,
                CO2: data.co2[index].dato,
            }));

            const blob = new Blob([JSON.stringify(jsonData, null, 2)], { type: 'application/json' });
            const url = URL.createObjectURL(blob);
            const link = document.createElement('a');
            link.href = url;
            link.setAttribute('download', `${nombreFoto}_week_data_${Date.now()}.json`);
            link.click();

        } catch (error) {
            console.error('Error al exportar a JSON:', error);
        }
    };

    return (
        <div style={{ display: 'flex', flexWrap: 'wrap' }}>
            <button style={{ flex: 1, margin: '5px', display: 'flex', alignItems: 'center' }} className="boton btn" onClick={exportChart}>
                <i className="fas fa-image" style={{ marginRight: '10px' }}></i>
                PNG
            </button>
            <button style={{ flex: 1, margin: '5px', display: 'flex', alignItems: 'center' }} className="boton btn" onClick={exportDataToExcel}>
                <i className="fas fa-file-excel" style={{ marginRight: '10px' }}></i>
                XLSX
            </button>
            <button style={{ flex: 1, margin: '5px', display: 'flex', alignItems: 'center' }} className="boton btn" onClick={exportDataToTxt}>
                <i className="fas fa-file-alt" style={{ marginRight: '10px' }}></i>
                TXT
            </button>
            <button style={{ flex: 1, margin: '5px', display: 'flex', alignItems: 'center' }} className="boton btn" onClick={exportDataToPdf}>
                <i className="fas fa-file-pdf" style={{ marginRight: '10px' }}></i>
                PDF
            </button>
            <button style={{ flex: 1, margin: '5px', display: 'flex', alignItems: 'center' }} className="boton btn" onClick={exportDataToCsv}>
                <i className="fas fa-file-csv" style={{ marginRight: '10px' }}></i>
                CSV
            </button>
            <button style={{ flex: 1, margin: '5px', display: 'flex', alignItems: 'center' }} className="boton btn" onClick={exportDataToJson}>
                <i className="fas fa-file-code" style={{ marginRight: '10px' }}></i>
                JSON
            </button>
        </div>
    );
}
