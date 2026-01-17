'use strict';
const { UUIDV4 } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
    const datoRecolectado = sequelize.define('datoRecolectado', {
        dato: { type: DataTypes.DECIMAL(10, 2), defaultValue: 0.0 },
        fecha: { type: DataTypes.DATEONLY },
        hora: { type: DataTypes.STRING(10), defaultValue: "NO DATA" },
        external_id: { type: DataTypes.UUID, defaultValue: DataTypes.UUIDV4 },

    }, {freezeTableName: true });
    datoRecolectado.associate = function (models) {
        datoRecolectado.belongsTo(models.sensor, {foreignKey: 'id_sensor'});
    }
    return datoRecolectado;
}
