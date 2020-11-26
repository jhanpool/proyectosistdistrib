const Sequelize = require('sequelize');

const slug = require('slug');
const shortid = require('shortid');

const db = require('../config/Conexion');

//CREACION TABLA
const Empresas = db.define('empresas', {
    idempresa:{
        type:Sequelize.INTEGER(11),
        primaryKey:true,
        autoIncrement:true
    },
    tipodocum:{
        type:Sequelize.STRING(3),
        allowNull:false
    },
    nrodocum:{
        type:Sequelize.STRING(20),
        allowNull:false
    },
    razonsocial:{
        type:Sequelize.STRING(300),
        allowNull:false
    },
    direccion:{
        type:Sequelize.STRING(50),
        allowNull:false
    },
    codubicaciudad:{
        type:Sequelize.STRING(10),
        allowNull:false
    },
    codubicabarrio:{
        type:Sequelize.STRING(10),
        allowNull:false
    },
    email:{
        type:Sequelize.STRING(150),
        allowNull:false
    },
    telfijo:{
        type:Sequelize.STRING(10),
        allowNull:false
    },
    url:Sequelize.STRING
}
,{
    //hooks SECUENCIA ANTES O DESPUESTA DE LA SENTENCIA
    hooks:{
        //(empresasModels) --> ESTE PUEDE LLAMARSE COMO QUERAMOS
        beforeCreate(empresasModels){
            const url = slug(empresasModels.razonsocial).toLowerCase();
            empresasModels.url = `${url}-${shortid.generate()}`;
        }
    }
}
);

module.exports = Empresas;