const Empresas = require('../models/EmpresasMod');
const slug = require('slug');

exports.PrincipalListaEmpresas = async(request, response)=>{
    //NUEVA VARIABLE PARA FILTRAR CON LAS EMPRESAS DEL USUARIO LOGUEADO
    const idusuario_fk = response.locals.usuarios.idusuario;

    //const empresas = await Empresas.findAll();
    const empresas = await Empresas.findAll({where:{idusuario_fk}});
    response.render('index', {tituloPagina:'Lista de empresas', empresas});
};