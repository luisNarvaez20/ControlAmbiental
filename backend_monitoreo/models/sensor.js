'use strict'
const { UUIDV4 } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
    const sensor = sequelize.define('sensor', {
        nombre: { type: DataTypes.STRING(150), defaultValue: "NO_DATA" },
        ubicacion: { type: DataTypes.STRING(255), defaultValue: "NO_DATA" },
        tipo_sensor: { type: DataTypes.ENUM('TEMPERATURA', 'HUMEDAD', 'CO2'), defaultValue: "TEMPERATURA" },
        external_id: { type: DataTypes.UUID, defaultValue: DataTypes.UUIDV4 },
        estado: { type: DataTypes.BOOLEAN, defaultValue: true },

    }, { freezeTableName: true });
    sensor.associate = function (models) {
        sensor.hasMany(models.datoRecolectado, { foreignKey: 'id_sensor', as: 'datoRecolectado' });
    }
    return sensor;
}