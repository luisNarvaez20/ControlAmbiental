'use strict';
const { UUIDV4 } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
    const persona = sequelize.define('persona', {
        external_id: { type: DataTypes.UUID, defaultValue: DataTypes.UUIDV4},
        nombres: { type: DataTypes.STRING(50), defaultValue: "NO_DATA" },
        apellidos: { type: DataTypes.STRING(50), defaultValue: "NO_DATA" },
        fecha_nacimiento: { type: DataTypes.DATE},
        telefono:  { type: DataTypes.INTEGER, defaultValue: 0},
        ocupacion: {type: DataTypes.STRING(50), defaultValue: "NO_DATA"},
        institucion: {type: DataTypes.STRING(100), defaultValue: "NO_DATA"},
    }, {
        freezeTableName: true
    });
    persona.associate = function (models){
        persona.belongsTo(models.rol, {foreignKey: 'id_rol'});
        persona.hasOne(models.cuenta, { foreignKey: 'id_persona', as: 'cuenta'});
    }
    return persona;
};