import Swal from 'sweetalert2';
import axios from 'axios';

const btnEliminar = document.querySelector('#eliminar-empresa');

if(btnEliminar){
    btnEliminar.addEventListener('click', e =>{
        const idempresa_pk = e.target.dataset.idempresa_pk

        Swal.fire({
            title: 'Estas seguro Eliminar la Empresa?',
            text: "Si se elimina, pierde la empresa!",
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#d33',
            confirmButtonText: 'Si, Borrarlo!',
            cancelButtonText: 'Cancelar!'
        }).then((result) => {
            if (result.value) {
                const enlaceUrl =`${location.origin}/empresas/${idempresa_pk}`;

                axios.delete(enlaceUrl, {params: {idempresa_pk}})
                .then(function(respuesta){
                    Swal.fire(
                        'Operación Exitosa!',
                        respuesta.data,
                        'success'
                    );
                    
                    setTimeout(()=>{
                        window.location.href='/'
                    }, 2000);
                })
                .catch(()=>{
                    Swal.fire({
                        type: 'error',
                        title: 'Hubo un eror',
                        text: 'No se pudo eliminar la empresa!',
                        icon: 'error'
                    })
                })
            }
        })
    })
}

export default btnEliminar;