'use strict';
const { UUIDV4 } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
    const evento = sequelize.define('evento', {
        external_id: { type: DataTypes.UUID, defaultValue: DataTypes.UUIDV4},
        tipo: {type: DataTypes.ENUM("PUBLICO","PRIVADO"), defaultValue: "PUBLICO"},
        nombre: { type: DataTypes.STRING(50), allowNull: false },
        fecha: { type: DataTypes.DATE},
        descripcion: { type: DataTypes.STRING(250), allowNull: false },
        usuario: { type: DataTypes.STRING(50), allowNull: false },
    }, 
    {
        freezeTableName: true
    });
    return evento;
};