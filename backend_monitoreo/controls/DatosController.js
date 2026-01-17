var models = require('../models/');
var datoRecolectado = models.datoRecolectado;
const { Op } = require('sequelize');
class DatosController {   

    async listarDatos(req, res) {
        try {
            const fechaInicio = new Date();
            fechaInicio.setDate(fechaInicio.getDate() - 8); // Resta 8 días
    
            const { count, rows } = await datoRecolectado.findAndCountAll({
                attributes: ['dato', 'fecha', 'hora', 'external_id', 'id_sensor'],
                where: {
                    fecha: {
                        [Op.gte]: fechaInicio.toISOString().slice(0, 10) // Últimos 8 días
                    }
                },
                order: [['fecha', 'DESC'], ['hora', 'DESC']]
            });
    
            res.json({ msg: 'OK!', code: 200, info: rows, total: count });
        } catch (error) {
            console.error('Error al listar datos:', error);
            res.status(500).json({ msg: 'Error al listar datos', code: 500 });
        }
    }    
    
    async listarTemperaturaSemana(req, res) {
        try {
            const endDate = new Date();
            const startDate = new Date(endDate);
            startDate.setDate(startDate.getDate() - 7);

            const listar = await datoRecolectado.findAll({
                attributes: ['dato', 'fecha', 'hora', 'external_id'],
                where: {
                    id_sensor: 2,
                    fecha: {
                        [Op.between]: [startDate, endDate]
                    }
                },
            });
            res.json({ msg: 'OK!', code: 200, info: listar });
        } catch (error) {
            console.error('Error al listar datos de Temperatura por semana:', error);
            res.status(500).json({ msg: 'Error al listar datos de Temperatura por semana', code: 500 });
        }
    }

    async listarTemperaturaDia(req, res) {
        try {
            const id_sensor = 2; // ID del sensor de humedad
    
            // Obtener la fecha del último dato registrado
            const ultimoDato = await datoRecolectado.findOne({
                attributes: ['fecha'],
                where: { id_sensor },
                order: [['fecha', 'DESC']],
                limit: 1
            });
    
            if (!ultimoDato) {
                return res.status(404).json({ msg: 'No se encontraron datos para el sensor especificado.', code: 404 });
            }
    
            // Verificar el tipo de fecha y convertir si es necesario
            let fechaUltimoDato = ultimoDato.fecha;
            if (typeof fechaUltimoDato === 'string') {
                fechaUltimoDato = new Date(fechaUltimoDato);
            }
    
            const fecha = fechaUltimoDato.toISOString().slice(0, 10); // Formato YYYY-MM-DD
            console.log("Fecha del último dato: " + fecha);
    
            // Obtener todos los datos del día del último dato registrado
            const listar = await datoRecolectado.findAll({
                attributes: ['dato', 'fecha', 'hora', 'external_id'],
                where: {
                    id_sensor,
                    fecha
                },
            });
    
            res.json({ msg: 'OK!', code: 200, info: listar });
        } catch (error) {
            console.error('Error al listar datos de Humedad por día:', error);
            res.status(500).json({ msg: 'Error al listar datos de Humedad por día', code: 500 });
        }
    }
    
    async listarHumedadSemana(req, res) {
        try {
            const endDate = new Date();
            const startDate = new Date(endDate);
            startDate.setDate(startDate.getDate() - 7);

            const listar = await datoRecolectado.findAll({
                attributes: ['dato', 'fecha', 'hora', 'external_id'],
                where: {
                    id_sensor: 1,
                    fecha: {
                        [Op.between]: [startDate, endDate]
                    }
                },
            });
            res.json({ msg: 'OK!', code: 200, info: listar });
        } catch (error) {
            console.error('Error al listar datos de Temperatura por semana:', error);
            res.status(500).json({ msg: 'Error al listar datos de Temperatura por semana', code: 500 });
        }
    }

    async listarHumedadDia(req, res) {
        try {
            const id_sensor = 1; // ID del sensor de humedad
    
            // Obtener la fecha del último dato registrado
            const ultimoDato = await datoRecolectado.findOne({
                attributes: ['fecha'],
                where: { id_sensor },
                order: [['fecha', 'DESC']],
                limit: 1
            });
    
            if (!ultimoDato) {
                return res.status(404).json({ msg: 'No se encontraron datos para el sensor especificado.', code: 404 });
            }
    
            // Verificar el tipo de fecha y convertir si es necesario
            let fechaUltimoDato = ultimoDato.fecha;
            if (typeof fechaUltimoDato === 'string') {
                fechaUltimoDato = new Date(fechaUltimoDato);
            }
    
            const fecha = fechaUltimoDato.toISOString().slice(0, 10); // Formato YYYY-MM-DD
            console.log("Fecha del último dato: " + fecha);
    
            // Obtener todos los datos del día del último dato registrado
            const listar = await datoRecolectado.findAll({
                attributes: ['dato', 'fecha', 'hora', 'external_id'],
                where: {
                    id_sensor,
                    fecha
                },
            });
    
            res.json({ msg: 'OK!', code: 200, info: listar });
        } catch (error) {
            console.error('Error al listar datos de Humedad por día:', error);
            res.status(500).json({ msg: 'Error al listar datos de Humedad por día', code: 500 });
        }
    }    
    
    async listarCo2Semana(req, res) {
        try {
            const endDate = new Date();
            const startDate = new Date(endDate);
            startDate.setDate(startDate.getDate() - 7);

            const listar = await datoRecolectado.findAll({
                attributes: ['dato', 'fecha', 'hora', 'external_id'],
                where: {
                    id_sensor: 3,
                    fecha: {
                        [Op.between]: [startDate, endDate]
                    }
                },
            });
            res.json({ msg: 'OK!', code: 200, info: listar });
        } catch (error) {
            console.error('Error al listar datos de Temperatura por semana:', error);
            res.status(500).json({ msg: 'Error al listar datos de Temperatura por semana', code: 500 });
        }
    }

    async listarCo2Dia(req, res) {
        try {
            const id_sensor = 3; // ID del sensor de humedad
    
            // Obtener la fecha del último dato registrado
            const ultimoDato = await datoRecolectado.findOne({
                attributes: ['fecha'],
                where: { id_sensor },
                order: [['fecha', 'DESC']],
                limit: 1
            });
    
            if (!ultimoDato) {
                return res.status(404).json({ msg: 'No se encontraron datos para el sensor especificado.', code: 404 });
            }
    
            // Verificar el tipo de fecha y convertir si es necesario
            let fechaUltimoDato = ultimoDato.fecha;
            if (typeof fechaUltimoDato === 'string') {
                fechaUltimoDato = new Date(fechaUltimoDato);
            }
    
            const fecha = fechaUltimoDato.toISOString().slice(0, 10); // Formato YYYY-MM-DD
            console.log("Fecha del último dato: " + fecha);
    
            // Obtener todos los datos del día del último dato registrado
            const listar = await datoRecolectado.findAll({
                attributes: ['dato', 'fecha', 'hora', 'external_id'],
                where: {
                    id_sensor,
                    fecha
                },
            });
    
            res.json({ msg: 'OK!', code: 200, info: listar });
        } catch (error) {
            console.error('Error al listar datos de Humedad por día:', error);
            res.status(500).json({ msg: 'Error al listar datos de Humedad por día', code: 500 });
        }
    }

    async listarDatosBusqueda(req, res) {
        try {
            const { pagina = 1, items = 20, fecha } = req.query;
            const itemsPorPagina = items * 3; // 20 filas * 3 sensores = 60 elementos
            const offset = (pagina - 1) * itemsPorPagina;
    
            let whereCondition = {};
    
            if (fecha) {
                const startDate = new Date(fecha);
                const endDate = new Date(startDate);
                endDate.setDate(startDate.getDate() + 1); // Incrementar la fecha en un día
    
                whereCondition = {
                    fecha: {
                        [Op.gte]: startDate.toISOString().slice(0, 10),
                        [Op.lt]: endDate.toISOString().slice(0, 10)
                    }
                };
            }
    
            const { count, rows } = await datoRecolectado.findAndCountAll({
                attributes: ['dato', 'fecha', 'hora', 'external_id', 'id_sensor'],
                where: whereCondition,
                order: [['fecha', 'DESC'], ['hora', 'DESC']],
                offset: offset,
                limit: itemsPorPagina
            });
    
            res.json({ msg: 'OK!', code: 200, info: rows, total: count });
        } catch (error) {
            console.error('Error al listar datos:', error);
            res.status(500).json({ msg: 'Error al listar datos', code: 500 });
        }
    }

    async obtenerUltimosDatos(req, res) {
        try {
            const temperatura = await datoRecolectado.findOne({
                attributes: ['dato', 'fecha', 'hora', 'external_id'],
                where: {
                    id_sensor: 2
                },
                order: [['fecha', 'DESC'], ['hora', 'DESC']]
            });

            const humedad = await datoRecolectado.findOne({
                attributes: ['dato', 'fecha', 'hora', 'external_id'],
                where: {
                    id_sensor: 1
                },
                order: [['fecha', 'DESC'], ['hora', 'DESC']]
            });

            const co2 = await datoRecolectado.findOne({
                attributes: ['dato', 'fecha', 'hora', 'external_id'],
                where: {
                    id_sensor: 3
                },
                order: [['fecha', 'DESC'], ['hora', 'DESC']]
            });

            res.json({ msg: 'OK!', code: 200, info: { temperatura, humedad, co2 } });
        } catch (error) {
            console.error('Error al obtener los ultimos datos:', error);
            res.status(500).json({ msg: 'Error al obtener los ultimos datos', code: 500 });
        }
    }

    async chatbotResponse(req, res) {
        try {
            const { message } = req.body;
            let response = "";
    
            const contienePalabras = (msg, palabras) => palabras.some(palabra => msg.toLowerCase().includes(palabra));
    
            const palabrasTemperatura = ['temperatura', 'calor', 'frío', 'grados'];
            const palabrasHumedad = ['humedad', 'húmedo', 'seco'];
            const palabrasCO2 = ['co2', 'dióxido de carbono', 'aire'];
            const palabrasFecha = ['fecha', 'día', 'ayer', 'hoy', 'mes', 'semana'];
            const palabrasPromedio = ['promedio', 'media', 'promedios'];
    
            console.log('Mensaje recibido:', message); // Log para depuración
    
            // Función para obtener la fecha del último registro
            const obtenerUltimaFecha = async () => {
                const resultado = await datoRecolectado.findOne({
                    attributes: [
                        [datoRecolectado.sequelize.fn('MAX', datoRecolectado.sequelize.col('fecha')), 'fecha']
                    ],
                    raw: true
                });
                return resultado ? resultado.fecha : null;
            };
    
            // Función para calcular los promedios
            const calcularPromedios = async (fecha) => {
                if (!fecha) throw new Error('Fecha no disponible');
    
                const [promedioTemperatura, promedioHumedad, promedioCo2] = await Promise.all([
                    datoRecolectado.findOne({
                        attributes: [
                            [datoRecolectado.sequelize.fn('AVG', datoRecolectado.sequelize.col('dato')), 'promedio']
                        ],
                        where: {
                            id_sensor: 2, // temperatura
                            fecha: fecha
                        },
                        raw: true
                    }),
                    datoRecolectado.findOne({
                        attributes: [
                            [datoRecolectado.sequelize.fn('AVG', datoRecolectado.sequelize.col('dato')), 'promedio']
                        ],
                        where: {
                            id_sensor: 1, // humedad
                            fecha: fecha
                        },
                        raw: true
                    }),
                    datoRecolectado.findOne({
                        attributes: [
                            [datoRecolectado.sequelize.fn('AVG', datoRecolectado.sequelize.col('dato')), 'promedio']
                        ],
                        where: {
                            id_sensor: 3, // co2
                            fecha: fecha
                        },
                        raw: true
                    })
                ]);
    
                return {
                    temperatura: promedioTemperatura ? promedioTemperatura.promedio : 'N/A',
                    humedad: promedioHumedad ? promedioHumedad.promedio : 'N/A',
                    co2: promedioCo2 ? promedioCo2.promedio : 'N/A'
                };
            };
    
            if (contienePalabras(message, palabrasPromedio)) {
                try {
                    const fechaUltimoRegistro = await obtenerUltimaFecha();
                    const promedios = await calcularPromedios(fechaUltimoRegistro);
                    console.log('Promedios generales:', promedios); // Log para depuración
                    
                    if (contienePalabras(message, palabrasTemperatura)) {
                        response = `El promedio de temperatura del día es ${promedios.temperatura} °C.`;
                    } else if (contienePalabras(message, palabrasHumedad)) {
                        response = `El promedio de humedad del día es ${promedios.humedad} %.`;
                    } else if (contienePalabras(message, palabrasCO2)) {
                        response = `El promedio de CO2 del día es ${promedios.co2} ppm.`;
                    } else {
                        response = `El promedio de los datos del día es:\n- Temperatura: ${promedios.temperatura} °C\n- Humedad: ${promedios.humedad} %\n- CO2: ${promedios.co2} ppm.`;
                    }
                } catch (error) {
                    response = "Hubo un error al obtener el promedio de los datos. Por favor, intenta de nuevo más tarde.";
                }
            } else if (contienePalabras(message, palabrasTemperatura)) {
                const temperatura = await this.obtenerUltimaTemperatura();
                response = `La temperatura actual es ${temperatura}°C. `;
                if (temperatura >= 18 && temperatura <= 24) {
                    response += "La calidad del aire es óptima en cuanto a temperatura.";
                } else if ((temperatura >= 16 && temperatura < 18) || (temperatura > 24 && temperatura <= 26)) {
                    response += "La calidad del aire es buena en cuanto a temperatura.";
                } else if ((temperatura >= 14 && temperatura < 16) || (temperatura > 26 && temperatura <= 28)) {
                    response += "La calidad del aire es moderada en cuanto a temperatura. Se recomiendan acciones para mejorarla.";
                } else {
                    response += "La calidad del aire es pésima en cuanto a temperatura. Es necesario tomar medidas como ajustar la climatización.";
                }
            } else if (contienePalabras(message, palabrasHumedad)) {
                const humedad = await this.obtenerUltimaHumedad();
                response = `La humedad actual es ${humedad}%. `;
                if (humedad >= 40 && humedad <= 50) {
                    response += "La calidad del aire es óptima en cuanto a humedad.";
                } else if (humedad > 50 && humedad <= 60) {
                    response += "La calidad del aire es buena en cuanto a humedad.";
                } else if (humedad > 60 && humedad <= 70) {
                    response += "La calidad del aire es moderada en cuanto a humedad. Se recomiendan acciones para mejorarla.";
                } else {
                    response += "La calidad del aire es pésima en cuanto a humedad. Es necesario tomar medidas como ajustar la ventilación.";
                }
            } else if (contienePalabras(message, palabrasCO2)) {
                const co2 = await this.obtenerUltimoCo2();
                response = `El nivel actual de CO2 es ${co2} ppm. `;
                if (co2 >= 0 && co2 <= 400) {
                    response += "La calidad del aire es óptima en cuanto a niveles de CO2.";
                } else if (co2 > 400 && co2 <= 600) {
                    response += "La calidad del aire es buena en cuanto a niveles de CO2.";
                } else if (co2 > 600 && co2 <= 800) {
                    response += "La calidad del aire es moderada en cuanto a niveles de CO2. Se recomienda ventilar el área.";
                } else {
                    response += "La calidad del aire es pésima en cuanto a niveles de CO2. Es necesario ventilar inmediatamente y considerar reducir el aforo.";
                }
            } else if (contienePalabras(message, palabrasFecha)) {
                response = "Para consultar datos de una fecha específica, por favor dirígete a la sección de historial. Recuerda que para acceder a esta sección es necesario iniciar sesión.";
            } else if (message.toLowerCase().includes("clima") || message.toLowerCase().includes("ambiente")) {
                const [temperatura, humedad, co2] = await Promise.all([
                    this.obtenerUltimaTemperatura(),
                    this.obtenerUltimaHumedad(),
                    this.obtenerUltimoCo2()
                ]);
                response = `Resumen del ambiente: Temperatura: ${temperatura}°C, Humedad: ${humedad}%, CO2: ${co2} ppm.`;
            } else if (message.toLowerCase().includes("ayuda") || message.toLowerCase().includes("qué puedes hacer")) {
                response = "Puedo proporcionarte información sobre la temperatura, humedad y niveles de CO2 en el ambiente. También puedo darte un resumen general del clima. ¿En qué puedo ayudarte?";
            } else if (contienePalabras(message, ['hola', 'buenos días', 'buenas tardes', 'buenas noches'])) {
                response = "¡Hola! Soy el asistente del sistema de monitoreo ambiental. ¿En qué puedo ayudarte hoy?";
            } else if (contienePalabras(message, ['gracias', 'muchas gracias', 'te lo agradezco'])) {
                response = "¡De nada! Estoy aquí para ayudarte. Si necesitas algo más, no dudes en preguntar.";
            } else if (contienePalabras(message, ['adios', 'hasta luego', 'chao'])) {
                response = "¡Hasta luego! Si necesitas más información en el futuro, estaré aquí para ayudarte.";
            } else {
                response = "Lo siento, no estoy seguro de cómo responder a eso. Puedes preguntarme sobre la temperatura, humedad, niveles de CO2 o el ambiente en general. También puedes pedirme ayuda si no estás seguro de qué preguntar.";
            }
    
            console.log('Respuesta del chatbot:', response); // Log para depuración
    
            res.json({ msg: 'OK!', code: 200, response });
        } catch (error) {
            console.error('Error en la respuesta del chatbot:', error);
            res.status(500).json({ msg: 'Error en la respuesta del chatbot', code: 500 });
        }
    }
    
      
    
    async PromedioDiario(req, res) {
        try {
            // Obtener la fecha del último registro
            const ultimoRegistro = await datoRecolectado.findOne({
                attributes: [
                    [datoRecolectado.sequelize.fn('MAX', datoRecolectado.sequelize.col('fecha')), 'fecha']
                ],
                raw: true
            });
    
            if (!ultimoRegistro || !ultimoRegistro.fecha) {
                return res.status(404).json({ msg: 'No hay datos disponibles', code: 404 });
            }
    
            const fechaUltimoRegistro = ultimoRegistro.fecha;
            
            // Calcular promedio para cada sensor en la fecha del último registro
            const [promedioTemperatura, promedioHumedad, promedioCo2] = await Promise.all([
                datoRecolectado.findOne({
                    attributes: [
                        [datoRecolectado.sequelize.fn('AVG', datoRecolectado.sequelize.col('dato')), 'promedio']
                    ],
                    where: {
                        id_sensor: 2, // temperatura
                        fecha: fechaUltimoRegistro
                    },
                    raw: true
                }),
                datoRecolectado.findOne({
                    attributes: [
                        [datoRecolectado.sequelize.fn('AVG', datoRecolectado.sequelize.col('dato')), 'promedio']
                    ],
                    where: {
                        id_sensor: 1, // humedad
                        fecha: fechaUltimoRegistro
                    },
                    raw: true
                }),
                datoRecolectado.findOne({
                    attributes: [
                        [datoRecolectado.sequelize.fn('AVG', datoRecolectado.sequelize.col('dato')), 'promedio']
                    ],
                    where: {
                        id_sensor: 3, // co2
                        fecha: fechaUltimoRegistro
                    },
                    raw: true
                })
            ]);
    
            res.json({
                msg: 'OK!',
                code: 200,
                info: {
                    temperatura: promedioTemperatura ? promedioTemperatura.promedio : 'N/A',
                    humedad: promedioHumedad ? promedioHumedad.promedio : 'N/A',
                    co2: promedioCo2 ? promedioCo2.promedio : 'N/A'
                }
            });
        } catch (error) {
            console.error('Error al obtener promedio diario:', error);
            res.status(500).json({ msg: 'Error al obtener promedio diario', code: 500 });
        }
    }

    async obtenerUltimaTemperatura() {
        const data = await datoRecolectado.findOne({
            attributes: ['dato'],
            where: { id_sensor: 2 },
            order: [['fecha', 'DESC'], ['hora', 'DESC']]
        });
        return data ? data.dato : 'N/A';
    }

    async obtenerUltimaHumedad() {
        const data = await datoRecolectado.findOne({
            attributes: ['dato'],
            where: { id_sensor: 1 },
            order: [['fecha', 'DESC'], ['hora', 'DESC']]
        });
        return data ? data.dato : 'N/A';
    }

    async obtenerUltimoCo2() {
        const data = await datoRecolectado.findOne({
            attributes: ['dato'],
            where: { id_sensor: 3 },
            order: [['fecha', 'DESC'], ['hora', 'DESC']]
        });
        return data ? data.dato : 'N/A';
    }
    
}
module.exports = DatosController;