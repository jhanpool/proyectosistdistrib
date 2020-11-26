const express = require('express'); //INICIAMOS EL LLAMADO A express
const router = express.Router(); //LLAMADO DEL METODO DE Router()

const {body} = require('express-validator');

const IndexController = require('../controllers/IndexContr');
const EmpresasController = require('../controllers/EmpresasContr');
const EmpleadosController = require('../controllers/EmpleadosContr');
const UsuariosController = require('../controllers/UsuariosContr');
const AuthController = require('../controllers/AuthContr');

//CREAMOS UN MODULO DE EXPORTACIÓN PARA EL ENRUTAMIENTO DE LAS PÁGINAS
module.exports = function (){
    router.get('/', AuthController.ValidaSesionActiva, IndexController.PrincipalListaEmpresas);

    router.get('/empresas', AuthController.ValidaSesionActiva, EmpresasController.FormularioEmpresas);
    router.post('/nuevaempresa',  AuthController.ValidaSesionActiva,
        [
            body('tipodocum').not().isEmpty().trim().escape(),
            body('nrodocum').not().isEmpty().trim().escape(),
            body('razonsocial').not().isEmpty().trim().escape(),
            body('direccion').not().isEmpty().trim().escape(),
            body('codubicaciudad'),
            body('codubicabarrio'),
            body('email').not().isEmpty().trim().escape(),
            body('telfijo').not().isEmpty().trim().escape()
        ],
    EmpresasController.EmpresasGrabar);

    router.get('/empresas/:id', AuthController.ValidaSesionActiva, EmpresasController.ListaEmpresaId); //LISTO LA EMPRESA AL SELECCIONARLA
    router.get('/empresa/editar/:id', AuthController.ValidaSesionActiva, EmpresasController.FormEditarEmpresas); //RUTA DEL FORMULARIO PARA 

    router.post('/nuevaempresa/:id', AuthController.ValidaSesionActiva, EmpresasController.EditarEmpresa); //MÉTODO PARA LA EDICIÓN DE LOS DATOS DE LA EMPRESA SELECCIONADA
    router.delete('/empresas/:id', AuthController.ValidaSesionActiva, EmpresasController.EliminarEmpresa); //MÉTODO PARA LA ELIMINACIÓN DE EMPRESA SELECCIONADA

    router.post('/empresas/:id', AuthController.ValidaSesionActiva, EmpleadosController.AgregarEmpleado);

    router.patch('/empleados/:id', AuthController.ValidaSesionActiva, EmpleadosController.CambioEstadoEmpleado); //MÉTODO QUE ME ACTUALIZARA EL ESTADO DEL EMPLEADO
    router.delete('/empleados/:id', AuthController.ValidaSesionActiva, EmpleadosController.EliminarEmpleado); //MÉTODO QUE ME ELIMINARA EL EMPLEADO
    
    router.get('/registrocuenta', UsuariosController.RegistroCuenta); //CREACIÓN DE USUARIOS/REGISTRO
    router.post('/registrocuenta', UsuariosController.GrabarRegCuenta); //CREACIÓN DE USUARIOS/REGISTRO

    router.get('/iniciarsesion', UsuariosController.IniciarSesionCuenta); //INICIO DE SESIÓN
    
    router.post('/iniciarsesion', AuthController.AutenticarUsuarioAcceso); //AL PROCESAR EL INTENTO DE LOGUEO

    router.get('/cerrarsesion', AuthController.CerrarSesion); //LLAMADO PARA CERRAR SESIÓN
    router.get('/restablecer', UsuariosController.RestablecerClave);
    
    router.post('/restablecer', AuthController.EnviarToken); //GENERA TOKEN PARA RESTABLECER CONTRASEÑA
    router.get('/restablecer/:token', AuthController.ResetearClave); //ENVIAR TOKEN Y RESETEAR CLAVE

    router.post('/restablecer/:token', AuthController.ActualizarClave); //CAMBIAR CLAVE
    router.get('/confirmar/:correo', UsuariosController.ConfirmarCuenta); //ACTIVAR CUENTA DE CONFIRMACIÓN

    //DENTRO DE ESTE JSON DEBEMOS RETORNAR ESE ARREGLO
    return router;
}