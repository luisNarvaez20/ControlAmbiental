'use strict';
const { body, validationResult, check } = require('express-validator');
var models = require('../models/');
var sensor = models.sensor;
const bcypt = require('bcrypt');
const salRounds = 8;
//Importando la biblioteca nodemailer en tu archivo
const nodemailer = require("nodemailer");

class SensorController {
    
    async listar(req, res) {
        var listar = await sensor.findAll({
            attributes: ['nombre', 'ubicacion', 'tipo_sensor', 'estado', 'external_id']
        });
        res.json({ msg: 'OK!', code: 200, info: listar });
    }

    //LISTA SENSOR INACTIVO
    async listarInactivo(req, res) {
        try {
            var listar = await sensor.findAll({
                attributes: ['nombre', 'ubicacion', 'tipo_sensor', 'estado', 'external_id'],
                where: {
                    '$sensor.estado$': '0',
                }
            });

            res.json({ msg: 'OK!', code: 200, info: listar });
        } catch (error) {
            console.error('Error al listar personas en espera:', error);
            res.status(500).json({ msg: 'Error interno del servidor', code: 500 });
        }
    }

    //LISTA SENSOR ACTIVO
    async listarActivo(req, res) {
        try {
            var listar = await sensor.findAll({
                attributes: ['nombre', 'ubicacion', 'tipo_sensor', 'estado', 'external_id'],
                where: {
                    '$sensor.estado$': '1',
                }
            });

            res.json({ msg: 'OK!', code: 200, info: listar });
        } catch (error) {
            console.error('Error al listar personas en espera:', error);
            res.status(500).json({ msg: 'Error interno del servidor', code: 500 });
        }
    }

    //METODO DE REGUSTRO DE USUARIOS
    async guardar(req, res) {
        try {
            const errors = validationResult(req);
    
            if (!errors.isEmpty()) {
                res.status(400).json({ msg: "DATOS FALTANTES", code: 400, errors: errors });
                return;
            }
    
            const data = {
                nombre: req.body.nombre,
                ubicacion: req.body.ubicacion,
                tipo_sensor: req.body.tipo_sensor,
            };
    
            console.log(data);
    
            let transaction = await models.sequelize.transaction();
    
            try {
                await models.sensor.create(data, { transaction });
                await transaction.commit();
                res.json({ msg: "Sensor agregado correctamente", code: 200 }); // Mensaje de éxito
            } catch (error) {
                if (transaction) await transaction.rollback();
                const errorMsg = error.errors && error.errors[0] && error.errors[0].message
                    ? error.errors[0].message
                    : error.message;
                res.json({ msg: errorMsg, code: 400 }); // Cambio el código a 400 para errores
            }
        } catch (error) {
            console.error(error);
            res.status(500).json({ msg: "Error interno del servidor", code: 500 });
        }
    }
    

    async modificar(req, res) {
        console.log("ENTRO EN EL METODO")
        var sen = await sensor.findOne({ where: { external_id: req.body.external_id } });
        if (sen === null) {
            console.log("valio");
            res.status(400);
            res.json({
                msg: "ERROR", tag: "Sensor no existe", code: 400
            });
        } else {
            var uuid = require('uuid');
            sen.estado = req.body.estado,
            sen.external_id = uuid.v4();
            var result = await sen.save();
            if (result === null) {
                res.status(400);
                res.json({
                    msg: "ERROR", tag: "No se han modificado los datos", code: 400
                });
            } else {
                res.status(200);
                res.json({
                    msg: "OK", tag: "Estado modificado exito",code: 200 
                });
            }
        }
    }
}
module.exports = SensorController;