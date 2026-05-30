// ==========================================
// 1. CREDENCIALES DE TU PROYECTO SUPABASE
// ==========================================
const supabaseUrl = "https://iakmzftscycojyehqyun.supabase.co";
const supabaseKey = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imlha216ZnRzY3ljb2p5ZWhxeXVuIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODAxNDgyNDMsImV4cCI6MjA5NTcyNDI0M30.4vSn_pQ-d4_dGfsqcACjkaOd_7eD_KrLZTXJW6Aco6w";

// Inicialización del cliente Cloud de Supabase
const _supabase = supabase.createClient(supabaseUrl, supabaseKey);

// ==========================================
// 2. CAPTURA DE ELEMENTOS VISUALES DE LA UI
// ==========================================
const ledVirtual = document.getElementById("ledVirtual");
const estadoTexto = document.getElementById("estadoTexto");
const btnEncender = document.getElementById("btnEncender");
const btnApagar = document.getElementById("btnApagar");

// ==========================================
// 3. FUNCIÓN VISUAL: CAMBIAR EL COLOR DEL LED
// ==========================================
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

// ==========================================
// 4. FUNCIÓN CLOUD: ENVIAR COMANDOS A INTERNET
// ==========================================
async function cambiarEstadoEnNube(nuevoEstado) {
    console.log("Enviando comando a Supabase Cloud: " + nuevoEstado);
    
    // Cambiamos el color de la pantalla de inmediato (sin lag para el usuario)
    actualizarInterfazLED(nuevoEstado);

    // Mandamos la orden de actualización a la base de datos remota
    const { data, error } = await _supabase
        .from('device_state')
        .update({ led_status: nuevoEstado })
        .eq('device_name', 'esp32-led-1');

    if (error) {
        console.error("Error al actualizar Supabase Cloud:", error.message);
    } else {
        console.log("¡Base de datos en la nube sincronizada con éxito!");
    }
}

// ==========================================
// 5. ESCUCHADORES DE CLICS (BOTONES)
// ==========================================
btnEncender.addEventListener("click", () => {
    cambiarEstadoEnNube(true); // Envia TRUE a internet
});

btnApagar.addEventListener("click", () => {
    cambiarEstadoEnNube(false); // Envia FALSE a internet
});

// ==========================================
// 6. SINCRONIZACIÓN INICIAL AL ABRIR LA WEB
// ==========================================
async function sincronizarEstadoInicial() {
    const { data, error } = await _supabase
        .from('device_state')
        .select('led_status')
        .eq('device_name', 'esp32-led-1');

    if (data && data.length > 0) {
        actualizarInterfazLED(data[0].led_status);
    }
}

// Ejecutar sincronización al inicio automático
sincronizarEstadoInicial();