export const nroempleados = ()=>{
    const empleados = document.querySelector('#tbempleados');

    if(empleados){
        if(empleados.childElementCount > 0){
            const empleadosActivos = document.querySelectorAll('.estempl.btn.btn-success');
            const empleadosInactivos = document.querySelectorAll('.estempl.btn.btn-secondary');
            
            const activos = document.querySelector('#empacti');
            const inactivos = document.querySelector('#empinact');

            activos.innerHTML = empleadosActivos.length;
            inactivos.innerHTML = empleadosInactivos.length;
        }
    }
}