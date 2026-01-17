import React from 'react';
import '../index.css';

export const Indicadores = () => {
    return (
           <div className="mt-4">
                <h2 className='text-center'>Descripción de Indicadores</h2>
                <div className="table-responsive">
                    <table className="table table-striped">
                        <thead>
                            <tr>
                                <th>Indicador</th>
                                <th>Descripción</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr>
                                <td><strong>Óptimo</strong></td>
                                <td>Los valores están dentro del rango ideal para un ambiente saludable y eficiente.</td>
                            </tr>
                            <tr>
                                <td><strong>Aceptable</strong></td>
                                <td>Los valores están dentro de un rango tolerable, pero podrían mejorarse para alcanzar condiciones óptimas.</td>
                            </tr>
                            <tr>
                                <td><strong>Deficiente</strong></td>
                                <td>Los valores están fuera del rango aceptable y pueden causar incomodidad o afectar el rendimiento.</td>
                            </tr>
                            <tr>
                                <td><strong>Crítico</strong></td>
                                <td>Los valores están en niveles peligrosos y requieren atención inmediata para evitar riesgos significativos.</td>
                            </tr>
                        </tbody>
                    </table>
                </div>
            </div>
    );
};