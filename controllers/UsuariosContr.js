const Usuarios = require('../models/UsuariosMod');
const EnviarEmail = require('../handlers/email');

exports.RegistroCuenta = (request, response)=>{
    response.render('registrocuenta', {
        tituloPagina:'Registrar Cuenta'
    });
}

exports.IniciarSesionCuenta = (request, response)=>{
    const { error }= response.locals.mensajes;

    response.render('iniciarsesion', {
        tituloPagina:'Iniciar Sesión',
        error
    });
}

exports.GrabarRegCuenta = async (request, response)=>{
    const {correo, clave} = request.body;
    const feccrea = new Date();
    const estado = 0; const bloqueo = 0;

    //NUEVA FORMA DE HACER EL GUARDE UTILIZANDO TRY-CATCH Y USO DE FLASH PARA MANEJO DE VALIDACIONES
    try {
        await Usuarios.create({correo, clave, feccrea, estado, bloqueo});

        //INICIO ÚLTIMOS CAMBIOS
        const confirmarUrl =`http://${request.headers.host}/confirmar/${correo}`;
        const usuario = { correo }

        await EnviarEmail.Enviar({
            usuario,
            subject: 'Confirma tu Cuenta de Empresas',
            confirmarUrl,
            archivo: 'confirmarcuenta'
        });
   
        request.flash(':D', 'Verifica tu correo para validar tu cuenta!');
        //FIN ÚLTIMOS CAMBIOS

        response.redirect('/iniciarsesion');
    }
    catch (error) {
        //console.log(error);
        request.flash('alert-danger alert-dismissible fade show', error.errors.map(error => error.message));
        response.render('registrocuenta', {
            mensajes: request.flash(),
            tituloPagina:'Registrar Cuenta',
            correo,
            clave
        });
    }

    /*Usuarios.create({correo, clave, feccrea, estado, bloqueo})
    .then(()=>{
        response.redirect('/iniciarsesion')
    })*/
}

exports.RestablecerClave = (request, response)=>{
    response.render('restablecer', {
        tituloPagina: 'Restablecer Tu Clave'
    });
 }

exports.ConfirmarCuenta = async (request, response) => {
    const usuario = await Usuarios.findOne({ where:{correo:request.params.correo} });

    if(!usuario){
        request.flash(':(', 'No existe la cuenta');
        response.redirect('/registrocuenta');
    }
    else{
        usuario.estado = 1;
        await usuario.save();
    
        request.flash(':D', 'Su cuenta esta activa, proceso exitoso');
        response.redirect('/iniciarsesion');
    }
}