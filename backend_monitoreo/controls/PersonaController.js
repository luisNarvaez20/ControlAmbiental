'use strict';
const { body, validationResult, check } = require('express-validator');
var models = require('../models/');
var persona = models.persona;
var rol = models.rol;
var cuenta = models.cuenta;
const bcypt = require('bcrypt');
const salRounds = 8;
//Importando la biblioteca nodemailer en tu archivo
const nodemailer = require("nodemailer");

class PersonaController {
    //LISTA TODO
    async obtener(req, res) {
        try {
            const listar = await persona.findOne({
                attributes: ['apellidos', 'nombres', 'external_id', 'fecha_nacimiento', 'ocupacion', 'institucion', 'telefono'],
                include: [
                    { model: cuenta, as: 'cuenta', attributes: ['external_id', 'correo', 'estado'] },
                    { model: models.rol, as: 'rol', attributes: ['nombre'] }
                ],
                where: { external_id: req.params.external } // Utiliza req.params.external para obtener el external desde la URL
            });
            
            res.json({ msg: 'OK!', code: 200, info: listar });
        } catch (error) {
            console.error('Error al obtener el perfil de usuario:', error);
            res.status(500).json({ msg: 'Error al obtener el perfil de usuario', code: 500 });
        }
    }
    
    async listar(req, res) {
        var listar = await persona.findAll({
            attributes: ['apellidos', 'nombres', 'external_id', 'fecha_nacimiento', 'ocupacion', 'institucion', 'telefono'],
            include: [
                { model: cuenta, as: 'cuenta', attributes: ['external_id', 'correo', 'estado'] },
                { model: models.rol, as: 'rol', attributes: ['nombre'] }
            ]
        });
        res.json({ msg: 'OK!', code: 200, info: listar });
    }
    //LISTA USUARIOS EN ESTADO DE ESPERA
    async listarEspera(req, res) {
        try {
            var listar = await persona.findAll({
                attributes: ['apellidos', 'nombres', 'external_id', 'fecha_nacimiento', 'ocupacion', 'institucion', 'telefono'],
                include: [
                    { model: cuenta, as: 'cuenta', attributes: ['external_id', 'correo', 'estado'] },
                    { model: models.rol, as: 'rol', attributes: ['nombre'] }
                ],
                where: {
                    '$cuenta.estado$': 'ESPERA',
                    '$rol.nombre$': 'USUARIO'
                }
            });

            res.json({ msg: 'OK!', code: 200, info: listar });
        } catch (error) {
            console.error('Error al listar personas en espera:', error);
            res.status(500).json({ msg: 'Error interno del servidor', code: 500 });
        }
    }

    //LISTA USUARIOS EN ESTADO DE ACEPTADO
    async listarAceptado(req, res) {
        try {
            var listar = await persona.findAll({
                attributes: ['apellidos', 'nombres', 'external_id', 'fecha_nacimiento', 'ocupacion', 'institucion', 'telefono'],
                include: [
                    { model: cuenta, as: 'cuenta', attributes: ['external_id', 'correo', 'estado'] },
                    { model: models.rol, as: 'rol', attributes: ['nombre'] }
                ],
                where: {
                    '$cuenta.estado$': 'ACEPTADO',
                    '$rol.nombre$': 'USUARIO'
                }
            });

            res.json({ msg: 'OK!', code: 200, info: listar });
        } catch (error) {
            console.error('Error al listar personas en espera:', error);
            res.status(500).json({ msg: 'Error interno del servidor', code: 500 });
        }
    }

    async listarRechazado(req, res) {
        try {
            var listar = await persona.findAll({
                attributes: ['apellidos', 'nombres', 'external_id', 'fecha_nacimiento', 'ocupacion', 'institucion', 'telefono'],
                include: [
                    { model: cuenta, as: 'cuenta', attributes: ['external_id', 'correo', 'estado'] },
                    { model: models.rol, as: 'rol', attributes: ['nombre'] }
                ],
                where: {
                    '$cuenta.estado$': 'RECHAZADO',
                    '$rol.nombre$': 'USUARIO'
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

            const rol = await models.rol.findOne({
                where: { nombre: 'USUARIO' },
                attributes: ['external_id']
            });

            if (!rol || !rol.external_id) {
                res.status(400).json({ msg: "DATOS INCORRECTOS", code: 400 });
                return;
            }

            const rolAux = await models.rol.findOne({
                where: { nombre: 'USUARIO' },
                attributes: ['id']
            });

            const claveHash = (clave) => bcypt.hashSync(clave, bcypt.genSaltSync(salRounds), null);

            const correoAux = req.body.correo;

            // Validar Datos duplicados en la Base de datos
            const correoExistente = await models.cuenta.findOne({ where: { correo: correoAux } });
            const telefonoExistente = await models.persona.findOne({ where: { telefono: req.body.telefono } });

            if (correoExistente || telefonoExistente) {
                res.json({ msg: "Correo o Telefono ya existente", code: 500 });
                return;
            }

            const data = {
                nombres: req.body.nombres,
                apellidos: req.body.apellidos,
                fecha_nacimiento: req.body.fecha_nacimiento,
                telefono: req.body.telefono,
                ocupacion: req.body.ocupacion,
                institucion: req.body.institucion,
                id_rol: rolAux.id,
                cuenta: { correo: req.body.correo, clave: claveHash(req.body.clave) }
            };

            console.log(data);

            let transaction = await models.sequelize.transaction();

            try {
                // Crear usuario en la base de datos
                await models.persona.create(data, {
                    include: [
                        { model: models.cuenta, as: "cuenta" },
                    ],
                    transaction
                });

                await transaction.commit();
                //Importando la biblioteca nodemailer en tu archivo

                // Configuración del servicio de correo electrónico
                const transporter = nodemailer.createTransport({
                    service: "gmail",
                    auth: {
                        user: "moniteroaulamagna@gmail.com",
                        pass: "cgxivvcggsxiriuw",
                    },
                });

                // Definir el contenido del cuepro para el correo electrónico que deseas enviar
                const correo = req.body.correo;
                const mailOptions = {
                    from: "Monitoreo Aula Magna",
                    to: [correo],
                    subject: "🏢🌡️ ¡REGISTRO COMPLETADO EXITOSAMENTE! 🌡️🏢",
                    text: "Has completado el registro de manera exitosa, por este medio te daremos a conocer el estado en el que se encuentra tu cuenta. Actualmente tu cuenta se encuentra en ¡ESPERA! 🕓",
                };

                // Envía el correo electrónico utilizando el método sendMail del objeto transporter
                transporter.sendMail(mailOptions, function (error, info) {
                    try {
                        if (error) {
                            console.error("Error al enviar el correo electrónico:", error);
                            res.status(500).json({ msg: "HUBO UN ERROR AL ENVIAR EL CORREO", code: 500 });
                            return;
                        }

                        if (info && info.response) {
                            console.log("Correo electrónico enviado:", info.response);
                        } else {
                            console.warn("No se pudo obtener la respuesta del correo electrónico.");
                        }

                        res.json({
                            msg: "POR FAVOR REVISE SU CORREO ELECTRÓNICO Y ESPERE EL ACCESO AL SISTEMA",
                            code: 200
                        });
                    } catch (error) {
                        console.error("Error al manejar la respuesta del correo electrónico:", error);
                        res.status(500).json({ msg: "HUBO UN ERROR AL ENVIAR EL CORREO", code: 500 });
                    }
                });

                // Envía un mensaje de éxito sin mencionar el correo electrónico

            } catch (error) {
                if (transaction) await transaction.rollback();
                const errorMsg = error.errors && error.errors[0] && error.errors[0].message
                    ? error.errors[0].message
                    : error.message;
                res.json({ msg: errorMsg, code: 200 });
            }
        } catch (error) {
            console.error(error);
            res.status(500).json({ msg: "Error interno del servidor", code: 500 });
        }
    }


    //METODO DE REGISTRO DE ADMINISTRADOR
    async guardarAdmin(req, res) {
        try {
            const errors = validationResult(req);

            if (!errors.isEmpty()) {
                res.status(400).json({ msg: "DATOS FALTANTES", code: 400, errors: errors });
                return;
            }

            const claveHash = (clave) => bcypt.hashSync(clave, bcypt.genSaltSync(salRounds), null);

            const correoAux = req.body.correo;

            // Validar Datos duplicados en la Base de datos
            const correoExistente = await models.cuenta.findOne({ where: { correo: correoAux } });

            if (correoExistente) {
                res.json({ msg: "Correo ya existente", code: 500 });
                return;
            }

            var rolAux = await rol.findOne({ where: { external_id: 'f384b5c3-9d40-485f-82dd-4a2e7a36b451' } });

            const data = {
                nombres: req.body.nombres,
                apellidos: req.body.apellidos,
                fecha_nacimiento: req.body.fecha_nacimiento,
                telefono: req.body.telefono,
                ocupacion: req.body.cargo,
                institucion: req.body.institucion,
                id_rol: rolAux.id,
                cuenta: { estado: "ACEPTADO", correo: req.body.correo, clave: claveHash(req.body.clave) }
            };

            console.log(data);

            let transaction = await models.sequelize.transaction();

            try {
                // Crear usuario en la base de datos
                await models.persona.create(data, {
                    include: [
                        { model: models.cuenta, as: "cuenta" },
                    ],
                    transaction
                });

                await transaction.commit();
                res.status(200).json({ msg: "ADMINISTRADOR CREADO CON EXITO", code: 200 });

            } catch (error) {
                if (transaction) await transaction.rollback();
                const errorMsg = error.errors && error.errors[0] && error.errors[0].message
                    ? error.errors[0].message
                    : error.message;
                res.json({ msg: errorMsg, code: 200 });
            }
        } catch (error) {
            console.error(error);
            res.status(500).json({ msg: "Error interno del servidor", code: 500 });
        }
    }

    async modificar(req, res) {
        console.log("ENTRO EN EL METODO")
        var person = await persona.findOne({ where: { external_id: req.body.external } });
        if (person === null) {
            console.log("valio");
            res.status(400);
            res.json({
                msg: "ERROR", tag: "Persona no existe", code: 400
            });
        } else {
            var uuid = require('uuid');
            person.nombres = req.body.nombres,
            person.apellidos = req.body.apellidos,
            person.ocupacion = req.body.ocupacion,
            person.institucion = req.body.institucion,
            person.fecha_nacimiento = req.body.fecha_nacimiento,
            person.telefono = req.body.telefono,
            person.external = uuid.v4();
            var result = await person.save();
            if (result === null) {
                res.status(400);
                res.json({
                    msg: "ERROR", tag: "No se han modificado los datos", code: 400
                });
            } else {
                res.status(200);
                res.json({
                    msg: "OK", tag: "Datos modificados con exito",code: 200 
                });
            }
        }
    }
}
module.exports = PersonaController;