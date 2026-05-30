// Capturamos los elementos visuales de la pantalla
const ledVirtual = document.getElementById("ledVirtual");
const estadoTexto = document.getElementById("estadoTexto");
const btnEncender = document.getElementById("btnEncender");
const btnApagar = document.getElementById("btnApagar");

// FUNCIÓN DE INTERFAZ: Cambia el look del LED de inmediato en pantalla
function actualizarInterfazLED(encendido) {
    if (encendido) {
        ledVirtual.classList.remove("apagado");
        ledVirtual.classList.add("encendido");
        estadoTexto.innerText = "SISTEMA: ENCENIDO";
        estadoTexto.style.color = "#00ffaa";
    } else {
        ledVirtual.classList.remove("encendido");
        ledVirtual.classList.add("apagado");
        estadoTexto.innerText = "SISTEMA: APAGADO";
        estadoTexto.style.color = "#ff3366";
    }
}