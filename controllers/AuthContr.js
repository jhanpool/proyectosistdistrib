const passport = require('passport');
const Usuarios = require('../models/UsuariosMod');
const Crypto = require('crypto');
const Sequelize = require('sequelize');
const Op = Sequelize.Op
const bcrypt = require('bcrypt-nodejs');
const EnvioEmail = require('../handlers/Email');

exports.AutenticarUsuarioAcceso = passport.authenticate('local', {
    successRedirect: '/', //ESTE SI EL PROCESO ES EXITOSO, LO MANDAMOS A LA RAIZ DEL PROYECTO
    failureRedirect: '/iniciarsesion', //EN CASO DE HABER FALLO O UNA AUTENTICACIÓN ERRONEA, MANDO A LA SESIÓN
    failureFlash: true, //TRAER LOS ERRORES
    badRequestMessage: 'Usuario y Clave son obligatorios!' //MENSAJE DE ERRORES
});

exports.ValidaSesionActiva = (request, response, next)=>{
    if(request.isAuthenticated()){
        return next();
    }

    return response.redirect('/iniciarsesion');
}

exports.CerrarSesion = (request, response)=>{ 
    request.session.destroy(()=>{
         response.redirect('/iniciarsesion');
     });
}

exports.EnviarToken = async(request, response)=>{
    const usuario = await Usuarios.findOne({where:{correo:request.body.correo}});

    if(!usuario){
        request.flash('alert-danger alert-dismissible fade show', '¡No existe esta cuenta, por favor verificar!');
        response.render('restablecer', {
            tituloPagina: 'Restablecer Tu Clave',
            mensajes: request.flash()
        });
    }
    else{
        //ENVIAR TOKEN
        usuario.token = Crypto.randomBytes(20).toString('hex');
        //console.log(token);

        usuario.expiracion = Date.now() + 3600000;

        await usuario.save();
        const resetUrl = `http://${request.headers.host}/restablecer/${usuario.token}`;

        //INICIO ÚLTIMO AJUSTE
        await EnvioEmail.Enviar({
            usuario,
            subject: 'Resetear Clave',
            resetUrl,
            archivo: 'restablecerclave'
        });
    
        request.flash('alert-success alert-dismissible fade show', 'Por favor verificar su correo electrónico');
        response.redirect('/restablecer');
        //FIN ÚLTIMO AJUSTE
    }
}

exports.ResetearClave = async(request, response) => {
    //response.json(request.params.token);
    const usuario = await Usuarios.findOne({where:{token:request.params.token} });

    if(!usuario){
        //request.flash('error','No es Válido el Token');
        //response.redirect('/restablecer');

        request.flash('alert-danger alert-dismissible fade show', '¡No es valido el Token!');
        response.render('restablecer', {
            tituloPagina: 'Restablecer Tu Clave',
            mensajes: request.flash()
        });
    }
    else{
        response.render('resetearclave',{
            tituloPagina: 'Restablecer Clave!'
        });
    }
}

exports.ActualizarClave = async(request, response) => {
    const usuario = await Usuarios.findOne({
        where:{
            token:request.params.token,
            expiracion:{
                [Op.gte]:Date.now()
            }
        }
    });

    if(!usuario) {
        //request.flash('error','No válido.. Excedió la Fecha y Hora');
        //response.redirect('/restablecer');
        request.flash('alert-danger alert-dismissible fade show', '¡No es valido el Token!');
        response.render('restablecer', {
            tituloPagina: 'Restablecer Tu Clave',
            mensajes: request.flash()
        });
    }
    else {
        usuario.clave = bcrypt.hashSync(request.body.clave, bcrypt.genSaltSync(10));
        usuario.token = null;
        usuario.expiracion = null;

        await usuario.save();

        request.flash('alert-success alert-dismissible fade show', 'Tu clave se ha actualizado exitosamente');
        response.redirect('/iniciarsesion');
    }
}