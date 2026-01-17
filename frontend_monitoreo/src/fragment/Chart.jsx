import React, { useEffect, useRef, useState } from 'react';
import { createChart, ColorType } from 'lightweight-charts';
import { PeticionGetSinToken } from '../hooks/Conexion';

const ChartComponent = ({ title, color, uri }) => {
    const chartContainerRef = useRef();
    const [data, setData] = useState([]);

    useEffect(() => {
        PeticionGetSinToken(uri).then(response => {
            const rawData = response.info.map(item => ({
                time: new Date(`${item.fecha}T${item.hora}:00`).getTime() / 1000,
                value: parseFloat(item.dato),
            }));

            const aggregatedData = rawData.reduce((acc, curr) => {
                const existing = acc.find(item => item.time === curr.time);
                if (existing) {
                    existing.value = (existing.value + curr.value) / 2; // Averaging the values
                } else {
                    acc.push(curr);
                }
                return acc;
            }, []);

            const sortedData = aggregatedData.sort((a, b) => a.time - b.time);

            console.log('Formatted and sorted data:', sortedData);
            setData(sortedData);
        });
    }, [uri]);

    useEffect(() => {
        if (data.length === 0) return;

        const chart = createChart(chartContainerRef.current, {
            layout: {
                background: { type: ColorType.Solid, color: '#ffffff' },
                textColor: '#333',
            },
            width: chartContainerRef.current.clientWidth,
            height: 400,
            grid: {
                vertLines: { color: '#f0f0f0' },
                horzLines: { color: '#f0f0f0' },
            },
            rightPriceScale: {
                borderVisible: false,
            },
            timeScale: {
                borderVisible: false,
                timeVisible: true,
                secondsVisible: false,
            },
            crosshair: {
                mode: 0,
            },
        });

        chart.timeScale().fitContent();

        const newSeries = chart.addAreaSeries({
            lineColor: color,
            topColor: color,
            bottomColor: 'rgba(255, 255, 255, 0.0)',
            lineWidth: 2,
        });

        newSeries.setData(data);

        const handleResize = () => {
            chart.applyOptions({ width: chartContainerRef.current.clientWidth });
        };

        window.addEventListener('resize', handleResize);

        return () => {
            window.removeEventListener('resize', handleResize);
            chart.remove();
        };
    }, [data, color]);

    return (
        <div className="chart-container mb-4">
            <h4 className="text-center mb-3" style={{ color: color }}>{title}</h4>
            <div ref={chartContainerRef} style={{ height: '400px', boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)' }}></div>
        </div>
    );
}

export default ChartComponent;
