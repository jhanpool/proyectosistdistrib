const express = require('express'); //ACÁ HACEMOS EL LLAMADO A EXPRESS
const app = express(); //SE INICIA CREACIÓN DE UNA APP express

const routes = require('./routes'); //LLAMADO DE NUESTRA EXTRUCTURA DE RUTAS
const path = require('path'); //ESTO ES OBLIGATORIO TENERLO SIEMPRE, ENRUTAMIENTO A VISTAS
const bodyParser = require('body-parser'); //LECTURAS http TRABAJA middleware
const helpers = require('./helpers');
const flash = require('connect-flash');
const session = require('express-session');
const cookieParser = require('cookie-parser');
const passport = require('./config/Passport');

require('./models/EmpresasMod');
require('./models/EmpleadosMod');
require('./models/UsuariosMod');
const conexion = require('./config/Conexion');
conexion.sync()
    .then(() => '')
    .catch(error=> console.log('Error en la conexión de DB'));

app.use(express.static('./public')); //LLAMADO TOTAL DE LA CARPETA PUBLIC
app.set('view engine', 'pug'); //LLAMADO TEMPLETA ENGINE PARA LAS VISTAS
app.set('views', path.join(__dirname, './views')); //LLAMADO DE LAS CARPETAS DEL SERVIDOR PARA LA VISTA

app.use(bodyParser.urlencoded({extended:true})); //HABILITAR LIBRERIA bodyParser

app.use(flash()); //INVOCAR FLASH

app.use(cookieParser()); //MANEJO DE SESIONES

app.use(session({
    secret:'Secreto',
    resave:false,
    saveUninitialized:false
}));

app.use(passport.initialize());
app.use(passport.session());

app.use((request, response, next) => {
    response.locals.vardump = helpers.vardump;
    response.locals.mensajes = request.flash();
    response.locals.usuarios = {...request.user} || null;
    next();
});

//app.use(bodyParser.urlencoded({extended:true})); //HABILITAR LIBRERIA bodyParser
app.use('/', routes());
app.listen(2020); //CREACIÓN DEL PUERTO PARA NUESTRO SERVICIO