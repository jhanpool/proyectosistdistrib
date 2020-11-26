const Empresas = require('../models/EmpresasMod');
const Empleados = require('../models/EmpleadosMod');

exports.AgregarEmpleado= async (request, response, next)=>{
    const { tipodocum, nrodocum, prinom, segnom, priape, segape } = request.body;

    const empresa = await Empresas.findOne({where:{	idempresa:request.params.id}});

    const estado = 0;
    const idempresa_fk = empresa.idempresa;

    const resultado = await Empleados.create({tipodocum, nrodocum, prinom, segnom, priape, segape, estado, idempresa_fk});

    if(!resultado){
        return next();
    }

    response.redirect(`/empresas/${request.params.id}`);
}

exports.CambioEstadoEmpleado = async (request, response)=>{
    const { id }= request.params;
    const empleado = await Empleados.findOne({where:{idempleado:id}});

    //ACÁ DEJO EL VALOR DE LAS VARIABLES SEGUND EL ESTADO QUE QUEDE EL EMPLEADO
    let estado = 0;
    //let descest = "Inactivo";
    let classButton = "estempl btn btn-secondary";
    //let icons = "fa.fa-user-times";
    let innerHtmlBtn = "Inactivo <i class='fa fa-user-times' aria-hidden='true'></i>";
    if(empleado.estado === estado){
        estado = 1;
        //descest = "Activo";
        classButton = "estempl btn btn-success";
        //icons = "fa.fa-user-plus";
        innerHtmlBtn = "Activo <i class='fa fa-user-plus' aria-hidden='true'></i>";
    }

    empleado.estado = estado;

    const resultado = await empleado.save();

    if(!resultado) return next();

    //response.status(200).send({classbtn: classButton, iconsbtn: icons, desc: descest, ihbtn: innerHtmlBtn});
    response.status(200).send({classbtn: classButton, ihbtn: innerHtmlBtn});
}

exports.EliminarEmpleado = async(request, response)=>{
    const {id} = request.params;
    const resultado = await Empleados.destroy({where:{idempleado:id}});

    if(!resultado) return next();

    response.status(200).send("Empleado(a) Eliminado(a) Correctamente");
}