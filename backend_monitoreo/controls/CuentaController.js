'use strict';
const { body, validationResult, check } = require('express-validator');
var models = require('../models/');
var persona = models.persona;
var cuenta = models.cuenta;
var rol = models.rol
const bcypt = require('bcrypt');
let jwt = require('jsonwebtoken');
const nodemailer = require("nodemailer");

class CuentaController {

    async sesion(req, res) {
        let errors = validationResult(req);
        if (errors.isEmpty()) {
            var login = await cuenta.findOne({
                where: { correo: req.body.correo },
                include: [
                    {
                        model: persona,
                        as: 'persona',
                        attributes: ['apellidos', 'nombres', 'external_id'],
                        include: [
                            {
                                model: rol,
                                as: 'rol',
                                attributes: ['nombre']
                            }
                        ]
                    }
                ]
            });            
            if (login === null) {
                res.status(400);
                res.json({
                    msg: "CUENTA NO ENCONTRADA",
                    code: 400
                });
            } else {
                res.status(200);
                var isClaveValida = function (clave, claveUser) {
                    return bcypt.compareSync(claveUser, clave);
                }
                if (login.estado == "ACEPTADO") {
                    if (isClaveValida(login.clave, req.body.clave)) { //login.clave---BD //req.body.clave---lo que manda el correo
                        const tokenData = {
                            external: login.external_id,
                            correo: login.correo,
                            check: true
                        };
                        require('dotenv').config();
                        const llave = process.env.KEY_SQ;
                        const token = jwt.sign(tokenData, llave, {
                            expiresIn: '12h'
                        });

                        res.json({
                            token: token,
                            user: login.persona.nombres + ' ' + login.persona.apellidos,
                            msg: "Bienvenid@ " + login.persona.nombres + ' ' + login.persona.apellidos,
                            correo: login.correo,
                            rol: login.persona.rol.nombre,
                            external_id: login.persona.external_id,
                            code: 200
                        });
                    } else {
                        res.json({
                            msg: "CLAVE INCORRECTA",
                            code: 201
                        });
                    }
                } else if (login.estado == "RECHAZADO") {
                    res.json({
                        msg: "PETICION DE ACCESO RECHAZADA",
                        code: 201
                    });
                } else if (login.estado == "ESPERA") {
                    res.json({
                        msg: "PETICION DE ACCESO EN ESPERA",
                        code: 201
                    });

                } else {
                    res.json({
                        msg: "NO EXISTE ESA CUENTA",
                        code: 201
                    });
                }
            }
        } else {
            res.status(400);
            res.json({ msg: "Datos faltantes", code: 400, errors: errors });
        }
    }
    async obtener(req, res) {
        const external_id = req.params.external_id;
        var cuenta_persona = await cuenta.findOne({
            where: { external_id: external_id },
            attributes: ['external_id', 'correo', 'estado'],
        });
        if (cuenta_persona === null) {
            cuenta_persona = {};
        }
        res.status(200);
        res.json({ msg: 'OK!', code: 200, info: cuenta_persona });
    }
    async modificar_estado(req, res) {

        var cuenta_persona = await cuenta.findOne({ where: { external_id: req.body.external_id } });

        if (cuenta_persona === null) {
            res.status(400);
            res.json({
                msg: "NO EXISTEN REGISTROS",
                code: 400
            });
        } else {
            var uuid = require('uuid');
            console.log(cuenta_persona);
            cuenta_persona.estado = req.body.estado;
            cuenta_persona.external_id = uuid.v4();

            try {
                await cuenta_persona.save();

                res.status(200);
                if (cuenta_persona.estado == "ACEPTADO") {
                    res.json({
                        msg: "LA CUENTA HA SIDO ACEPTADA EXITOSAMENTE",
                        code: 200
                    });
                    const transporter = nodemailer.createTransport({
                        service: "gmail",
                        auth: {
                            user: "moniteroaulamagna@gmail.com",
                            pass: "cgxivvcggsxiriuw",
                        },
                    });
                    const mailOptions = {
                        from: "Monitoreo Aula Magna",
                        to: cuenta_persona.correo,
                        subject: "🏢🌡️ ¡TU CUENTA HA SIDO ACEPTADA! 🏢🌡️",
                        text: "!Tu solicitud ha sido ACEPTADA ahora puedes tener acceso a funciones e informaciòn extra!",
                    };
                    transporter.sendMail(mailOptions, function (error, info) {
                        try {
                            console.log("Correo electrónico enviado: " + info.response);
                           
                        } catch (error) {
                            console.log(error);
                            res.json({
                                msg: "HUBO UN ERROR AL ENVIAR EL CORREO",
                                code: 500
                            });
                        }


                    });
                } else if (cuenta_persona.estado == "RECHAZADO") {
                    res.json({
                        msg: "LA CUENTA HA SIDO RECHAZADA EXITOSAMENTE",
                        code: 200
                    });
                    const transporter = nodemailer.createTransport({
                        service: "gmail",
                        auth: {
                            user: "moniteroaulamagna@gmail.com",
                            pass: "cgxivvcggsxiriuw",
                        },
                    });
                    const mailOptions = {
                        from: "Monitoreo Aula Magna",
                        to: cuenta_persona.correo,
                        subject: "🏢🌡️ ¡TU CUENTA HA SIDO RECHAZADA! 🏢🌡️",
                        text: "Lamentamos informarte que tu solicitud ha sido RECHAZADA. Para más detalles, por favor, contacta con el equipo de soporte.",
                    };
                    
                    transporter.sendMail(mailOptions, function (error, info) {
                        try {
                            console.log("Correo electrónico enviado: " + info.response);
                           
                        } catch (error) {
                            console.log(error);
                            res.json({
                                msg: "HUBO UN ERROR AL ENVIAR EL CORREO",
                                code: 500
                            });
                        }


                    });
                } else {
                    res.json({
                        msg: "NO SE HA GENERADO NINGUN CAMBIO...",
                        code: 200
                    });
                }
            } catch (error) {
                res.status(400);
                res.json({
                    msg: "NO SE HA MODIFICADO EL ESTADO DE LA CUENTA",
                    code: 400,
                    error: error.message
                });

            }
        }
    }

}
module.exports = CuentaController;