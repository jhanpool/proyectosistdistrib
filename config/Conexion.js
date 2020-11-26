const {Sequelize} = require('sequelize');

const db = new Sequelize('ProyectoSistDistrib', 'root', '', {
    host:'localhost',
    dialect:'mysql',
    port:'3306',
    define:{ timestamps:false}
});

//EXPORTAR ARCHIVO
module.exports = db;