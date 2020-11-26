import axios from 'axios';
import Swal from 'sweetalert2';
import {nroempleados} from '../funciones/listaempleados';

const empleados = document.querySelector('.table');

if(empleados){
    empleados.addEventListener('click', e =>{
        var idEmpleado;

        if(e.target.classList.contains('estempl')){
            const boton = e.target;
            //const icons = boton.childNodes;
            idEmpleado = boton.parentElement.parentElement.dataset.empleados;
            const enlaceUrl = `${location.origin}/empleados/${idEmpleado}`;
            
            axios.patch(enlaceUrl, { idEmpleado })
            .then(function(respuesta){
                if(respuesta.status===200){
                    boton.className = respuesta.data.classbtn;
                    //icons[1].className = respuesta.data.iconsbtn;
                    //boton.innerText = respuesta.data.desc;
                    boton.innerHTML = respuesta.data.ihbtn;
                    nroempleados();
                }
            })
        }

        if(e.target.classList.contains('btn-danger')){
            const empleadoEP = e.target.parentElement.parentElement;

            idEmpleado = empleadoEP.dataset.empleados;
            const empleado = empleadoEP.dataset.infoempleado;
            
            Swal.fire({
                title: '¿Estas seguro de eliminar la persona?',
                text: "Si se elimina, pierde el registro de " + empleado + "!",
                icon: 'warning',
                showCancelButton: true,
                confirmButtonColor: '#3085d6',
                cancelButtonColor: '#d33',
                confirmButtonText: 'Si, Eliminar!',
                cancelButtonText: 'Cancelar!'
            }).then((result) => {
                if (result.value) {
                    const enlaceUrl = `${location.origin}/empleados/${idEmpleado}`;

                    axios.delete(enlaceUrl, {params:{idEmpleado}})
                    .then(function(respuesta){
                        if(respuesta.status===200){
                            empleadoEP.parentElement.removeChild(empleadoEP);

                            Swal.fire(
                                'Operación Exitosa',
                                respuesta.data,
                                'success'
                            )

                            nroempleados();
                        }
                    })
                }
            })
        }
    });
}

export default empleados;