const Empresas = require('../models/EmpresasMod');
const Empleados = require('../models/EmpleadosMod');
const slug = require('slug');

exports.FormularioEmpresas = async (request, response)=>{
    //console.log(response.locals.usuarios);
    const idusuario_fk = response.locals.usuarios.idusuario;

    //const empresas = await Empresas.findAll();
    const empresas = await Empresas.findAll({where:{idusuario_fk}});
    response.render('empresas', {nombrePagina:'Nueva Empresa', empresas});
}

exports.EmpresasGrabar = async (request, response)=>{
    const { tipodocum, nrodocum, razonsocial, direccion, codubicaciudad, codubicabarrio, email, telfijo } = request.body;
    let validacionesGrabar = [];

    if(!nrodocum) { validacionesGrabar.push({'texto':'Ingresar número de Documento'}); }
    if(!razonsocial) { validacionesGrabar.push({'texto':'Ingresar razón social'}); }
    if(!direccion) { validacionesGrabar.push({'texto':'Ingresar razón social'}); }
    if(!codubicaciudad) { validacionesGrabar.push({'texto':'Ingresar Código de Ciudad'}); }
    if(!codubicabarrio) { validacionesGrabar.push({'texto':'Ingresar Código de Barrio'}); }
    if(!email) { validacionesGrabar.push({'texto':'Ingresar Correo Electrónico'}); }
    if(!telfijo) { validacionesGrabar.push({'texto':'Ingresar Teléfono Fijo'}); }

    if(validacionesGrabar.length > 0){
        response.render('empresas', {
            titulo:'Campos Requeridos',
            validacionesGrabar
        });   
    }
    else
    {
        //NUEVA VARIABLE PARA FILTRAR CON LAS EMPRESAS DEL USUARIO LOGUEADO
        const idusuario_fk = response.locals.usuarios.idusuario;

        const empresasGrabar = await Empresas.create({tipodocum, nrodocum, razonsocial, direccion, codubicaciudad, codubicabarrio, email, telfijo, idusuario_fk});
        response.redirect('/empresas');
    }
};

exports.ListaEmpresaId= async (request, response, next)=>{
    const idusuario_fk = response.locals.usuarios.idusuario;
    //const empresasPromise = Empresas.findAll();
    const empresasPromise = Empresas.findAll({where:{idusuario_fk}});

    const empresaPromise = Empresas.findOne({ where:{ idempresa:request.params.id } });

    const[empresas, empresa] = await Promise.all([empresasPromise, empresaPromise]);

    const empleados = await Empleados.findAll({
        where:{
            idempresa_fk : empresa.idempresa
        },
        include: [{ model: Empresas}]
    });

    if(!empresa) return next();

    response.render('empleados', {
        nombrePagina: 'Empleados Empresa',
        empresa, //findOne -url
        empresas,
        empleados // findAll
    })
}

exports.FormEditarEmpresas = async(request, response) =>{
    const idusuario_fk = response.locals.usuarios.idusuario;
    //const empresasPromise = Empresas.findAll();
    const empresasPromise = Empresas.findAll({where:{idusuario_fk}});

    const empresaPromise = Empresas.findOne({ where:{idempresa:request.params.id} });

    const[empresas, empresa] = await Promise.all([empresasPromise, empresaPromise]);

    response.render('empresas',{
        nombrePagina:'Editar Empresa',
        empresas,
        empresa
    })
};

exports.EditarEmpresa = async (request, response) =>{
    const idusuario_fk = response.locals.usuarios.idusuario;

    //const empresas = await Empresas.findAll();
    const empresas = Empresas.findAll({where:{idusuario_fk}});

    const { tipodocum, nrodocum, razonsocial, direccion, codubicaciudad, codubicabarrio, email, telfijo } = request.body;

    let validacionesGrabar = [];

    if(!nrodocum) { validacionesGrabar.push({'texto':'Ingresar número de Documento'}); }
    if(!razonsocial) { validacionesGrabar.push({'texto':'Ingresar razón social'}); }
    if(!direccion) { validacionesGrabar.push({'texto':'Ingresar razón social'}); }
    if(!codubicaciudad) { validacionesGrabar.push({'texto':'Ingresar Código de Ciudad'}); }
    if(!codubicabarrio) { validacionesGrabar.push({'texto':'Ingresar Código de Barrio'}); }
    if(!email) { validacionesGrabar.push({'texto':'Ingresar Correo Electrónico'}); }
    if(!telfijo) { validacionesGrabar.push({'texto':'Ingresar Teléfono Fijo'}); }

    if(validacionesGrabar.length>0){
        response.render('empresas',{
            nombrePagina:'Editar Empresa',
            validacionesGrabar,
            empresas
        })
    }
    else {
        await Empresas.update(
            { tipodocum, nrodocum, razonsocial, direccion, codubicaciudad, codubicabarrio, email, telfijo },
            {where:{idempresa:request.params.id}
        });
           
        response.redirect('/');   
    }
}

exports.EliminarEmpresa = async(request, response, next)=>{
    const {idempresa_pk} = request.query;
    
    const resultado = await Empresas.destroy({where:{idempresa:idempresa_pk}});

    if(!resultado){
        return next();
    }

    response.status(200).send('Empresa Eliminada Correctamente!');
}