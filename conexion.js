// 1. Credenciales limpias de tu proyecto de Supabase
const supabaseUrl = "https://iakmzftscycojyehqyun.supabase.co";
const supabaseKey = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imlha216ZnRzY3ljb2p5ZWhxeXVuIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODAxNDgyNDMsImV4cCI6MjA5NTcyNDI0M30.4vSn_pQ-d4_dGfsqcACjkaOd_7eD_KrLZTXJW6Aco6w";

// Inicialización del cliente Cloud
const _supabase = supabase.createClient(supabaseUrl, supabaseKey);

// 2. Función para procesar y enviar la orden a internet
async function cambiarEstadoEnNube(nuevoEstado) {
    console.log("Enviando comando a Supabase Cloud: " + nuevoEstado);
    
    // Primero cambiamos la interfaz de forma reactiva para que el usuario no sienta lag
    actualizarInterfazLED(nuevoEstado);

    // Mandamos la orden de actualización a la base de datos
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

// 3. Escuchadores de eventos para activar la conexión
btnEncender.addEventListener("click", () => {
    cambiarEstadoEnNube(true);
});

btnApagar.addEventListener("click", () => {
    cambiarEstadoEnNube(false);
});

// 4. Leer el estado de la base de datos al abrir la página por primera vez
async function sincronizarEstadoInicial() {
    const { data, error } = await _supabase
        .from('device_state')
        .select('led_status')
        .eq('device_name', 'esp32-led-1');

    if (data && data.length > 0) {
        actualizarInterfazLED(data[0].led_status);
    }
}

// Ejecutar sincronización al inicio
sincronizarEstadoInicial();