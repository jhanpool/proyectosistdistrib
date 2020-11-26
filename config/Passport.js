const passport = require('passport');
const LocalStrategy = require('passport-local');
const Usuarios = require('../models/UsuariosMod');

passport.use(
    new LocalStrategy (
        {
            //PRIMERO usernameField Y passwordField SON CLAVES GENERADOS PARA IDENTIFICAR DATOS
            //SEGUNDO correo y clave SON DEL MODELO
            usernameField: 'correo',
            passwordField: 'clave'
        },

        async(correo, clave, done) => {
            try {
                const usuario = await Usuarios.findOne({ where:{correo, estado:1} });
                
                if(!usuario.VerificarClaveAcceso(clave)){
                    return done(null, false, { message: 'Contraseña Incorrecta!' });
                }

                return done(null, usuario);
            } catch (error) {
                return done(null, false, { message: 'Cuenta no existe!' });
            }
        }
    )
)

passport.serializeUser((usuario, callback)=>{
    callback(null, usuario);
});

passport.deserializeUser((usuario, callback)=>{
    callback(null, usuario);
});

module.exports = passport;