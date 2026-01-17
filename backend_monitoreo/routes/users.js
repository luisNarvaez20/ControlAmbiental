var express = require('express');
var router = express.Router();
let jwt = require('jsonwebtoken');

const { body, validationResult } = require('express-validator');
const RolController = require('../controls/RolController');
var rolController = new RolController();
const PersonaController = require('../controls/PersonaController');
var personaController = new PersonaController();
const CuentaController = require('../controls/CuentaController');
var cuentaController = new CuentaController();
const EventoController = require('../controls/EventoController');
var eventoController = new EventoController();
const DatosController = require('../controls/DatosController');
var datosController = new DatosController();
const SensorController = require('../controls/SensorController');
var sensorController = new SensorController();

/* GET users listing. */
router.get('/', function (req, res, next) {
  res.send('respond with a resource');
});
var auth = function middleware(req, res, next) {
  const token = req.headers['x-api-token'];
  if (token) {
    require('dotenv').config();
    const llave = process.env.KEY_SQ;

    jwt.verify(token, llave, async (err, decoded) => {
      if (err) {
        res.status(401);
        res.json({
          msg: "TOKEN NO VALIDO",
          code: 401
        });
      } else {
        var models = require('../models');
        var cuenta = models.cuenta;
        req.decoded = decoded;
        let aux = await cuenta.findOne({ where: { external_id: req.decoded.external } })
        if (aux === null) {
          res.status(401);
          res.json({
            msg: "TOKEN NO VALIDO O EXPIRADO",
            code: 401
          });
        } else {
          next();
        }
      }
    });
  } else {
    res.status(401);
    res.json({
      msg: "NO EXISTE TOKEN",
      code: 401
    });
  }

}

/*-----------------------------------------------------------------RUTAS------------------------------------------------------------------*/

/*ROL CONTROLLER*/
router.post('/rol/guardar', rolController.guardar);
router.get('/rol/listar', rolController.listar);

/*PERSONA CONTROLLER*/
router.post('/persona/usuario', personaController.guardar);
router.post('/persona/admin', [
  body('apellidos', 'Ingrese sus apellidos').trim().exists().not().isEmpty().isLength({ min: 3, max: 50 }).withMessage("Ingrese un valor mayor o igual a 3 y menor a 50"),
  body('nombres', 'Ingrese sus nombres').trim().exists().not().isEmpty().isLength({ min: 3, max: 50 }).withMessage("Ingrese un valor mayor o igual a 3 y menor a 50"),
],personaController.guardarAdmin);
router.post('/persona/modificar', personaController.modificar);
router.get('/persona/listar', auth, personaController.listar);
router.get('/persona/aceptado', auth, personaController.listarAceptado);
router.get('/persona/espera', auth , personaController.listarEspera);
router.get('/persona/rechazado', auth, personaController.listarRechazado);
router.get('/persona/obtener/:external', auth, personaController.obtener);
/*CUENTA CONTROLLER */
router.post('/cuenta/sesion', [
  body('correo', 'Ingrese un correo').trim().exists().not().isEmpty().isEmail(),
  body('clave', 'Ingrese una clave').trim().exists().not().isEmpty(),
], cuentaController.sesion);
router.post('/cuenta/modificar_estado', cuentaController.modificar_estado);
/*EVENTO CONTROLLER */
router.get('/evento/listar', eventoController.listar);
router.post('/evento/guardar', eventoController.guardar);
/**DATOS CONTROLLER */
router.get('/datos/temperaturaSemana', datosController.listarTemperaturaSemana);
router.get('/datos/temperaturaDia', datosController.listarTemperaturaDia);
router.get('/datos/humedadSemana', datosController.listarHumedadSemana);
router.get('/datos/humedadDia', datosController.listarHumedadDia);
router.get('/datos/co2Semana', datosController.listarCo2Semana);
router.get('/datos/co2Dia', datosController.listarCo2Dia);
router.get('/datos', auth, datosController.listarDatos);
router.get('/datosBusqueda', auth, datosController.listarDatosBusqueda);
router.get('/datos/ultimosDatos', datosController.obtenerUltimosDatos);
router.post('/chatbot', datosController.chatbotResponse.bind(datosController));
router.get('/datos/promedio', datosController.PromedioDiario);
/**SENSOR CONTROLLER */
router.get('/sensor/listar', auth, sensorController.listar);
router.get('/sensor/listarActivo', auth, sensorController.listarActivo);
router.get('/sensor/listarInactivo', auth, sensorController.listarInactivo);
router.post('/sensor/modificar', auth,sensorController.modificar);
router.post('/sensor/guardar', auth, sensorController.guardar);
module.exports = router;
