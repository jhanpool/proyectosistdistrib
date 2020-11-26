export const mostrarAlertas = ()=>{
    const alertas = document.querySelectorAll('#alertas');

    if(alertas.length){
        window.setTimeout(function(){
            $("alert").fadeTo(1500, 0).slideDown(1000, function(){
                $(this).remove();
            })
        }, 3000);
    }
}