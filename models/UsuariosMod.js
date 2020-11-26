const Sequelize = require('sequelize');
const db = require('../config/Conexion');
const Empresas = require('./EmpresasMod');
const bcrypt = require('bcrypt-nodejs');

const Usuarios = db.define('usuarios',{
    idusuario:{
        type:Sequelize.INTEGER(11),
        primaryKey:true,
        autoIncrement:true
    },
    correo:{
        type:Sequelize.STRING(150),
        allowNull:false,
        //unique:true
        validate:{ //CONTROL DE VALIDACIÓN
            isEmail:{
                msg:'Ingresar un Email valido' 
            },
            notEmpty:{
                msg:'El Email no puede ir vacio'
            }
        },
        unique:{
            args: true,
            msg:'Email ya registrado!'
        }
    },
    clave:{
        type:Sequelize.STRING(60),
        allowNull:false,
        validate:{
            notEmpty:{
                msg:'La contraseña no puede ir vacia'
            }
        }
    },
    feccrea:{
        type:Sequelize.DATE(),
        allowNull:false
    },
    estado: {
        type:Sequelize.TINYINT(1),
        allowNull:false
    },
    bloqueo:{
        type:Sequelize.TINYINT(1),
        allowNull:false
    },
    token: Sequelize.STRING,
    expiracion: Sequelize.DATE
},{
    hooks:{
        beforeCreate(usumodel){
            usumodel.clave = bcrypt.hashSync(usumodel.clave, bcrypt.genSaltSync(10));
        }
    }
});

Usuarios.prototype.VerificarClaveAcceso = function(clave) {
    return bcrypt.compareSync(clave, this.clave);
}

Usuarios.hasMany(Empresas, {foreignKey: 'idusuario_fk', allowNull: false});

module.exports= Usuarios;