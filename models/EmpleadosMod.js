const Sequelize = require('sequelize');

const db = require('../config/Conexion');
const Empresas = require('./EmpresasMod');

const Empleados = db.define('empleados',{
    idempleado:{
        type:Sequelize.INTEGER(11),
        primaryKey: true,
        autoIncrement: true
    },
    tipodocum:{
        type:Sequelize.STRING(3),
        allowNull:false
    },
    nrodocum:{
        type:Sequelize.STRING(20),
        allowNull:false
    },
    prinom: {
        type:Sequelize.STRING(150),
        allowNull:false
    },
    segnom: {
        type:Sequelize.STRING(150),
        allowNull:true
    },
    priape: {
        type:Sequelize.STRING(150),
        allowNull:false
    },
    segape: {
        type:Sequelize.STRING(150),
        allowNull:true
    },
    estado: {
        type:Sequelize.TINYINT(1),
        allowNull:true
    }
});

Empleados.belongsTo(Empresas, {foreignKey: 'idempresa_fk', allowNull: false});

module.exports = Empleados;