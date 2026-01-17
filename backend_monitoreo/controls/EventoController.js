'use strict';
const { body, validationResult, check } = require('express-validator');
var models = require('../models');
var evento = models.evento;
var persona = models.persona;

class EventoController{

    async listar(req, res) {
        var lista = await evento.findAll({
            attributes: ['tipo','nombre', 'descripcion', 'fecha', 'usuario','external_id']
        });
        res.status(200);
        res.json({ msg: "OK", code: 200, datos: lista });
    }

    async guardar(req, res) {
        try {
            const errors = validationResult(req);
    
            if (!errors.isEmpty()) {
                res.status(400).json({ msg: "DATOS FALTANTES", code: 400, errors: errors.array() });
                return;
            }
    
            const user = await persona.findOne({ where: { external_id: req.body.external_persona } });
            console.log(user);
            if (user == null) {
                res.status(400).json({ msg: "NO EXISTE PERSONA", code: 400 });
                return; // Asegúrate de retornar para evitar continuar la ejecución
            }
    
            var uuid = require('uuid');
            var data = {
                tipo: req.body.tipo, //PUBLICO, PRIVADO
                fecha: req.body.fecha, //YYYY/MM/DD
                descripcion: req.body.descripcion,
                nombre: req.body.nombre,
                external_id: uuid.v4(),
                usuario: `${user.nombres} ${user.apellidos}`,
            };
            var result = await evento.create(data);
            if (result === null) {
                res.status(401).json({ msg: "ERROR", tag: "No se puede crear", code: 401 });
            } else {
                res.status(200).json({ msg: "EVENTO CREADO CON EXITO", code: 200 });
            }
        } catch (error) {
            console.error(error);
            res.status(500).json({ msg: "Error interno del servidor", code: 500 });
        }
    }
    
}
module.exports = EventoController