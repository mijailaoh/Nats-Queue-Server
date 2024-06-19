const { connect, StringCodec } = require('nats');

(async () => {
    try {
        // Configuración de conexión a un servidor NATS con token
        const nc = await connect({
            servers: "nats://192.168.1.240:4222",
            token: "token_secreto1" // Token para autenticación
        });

        console.log('Conectado al servidor NATS');

        // Crear un codec para decodificar mensajes
        const sc = StringCodec();

        // Función para manejar los mensajes recibidos
        function handleMessage(msg) {
            console.log(`[Subscribe]: ${sc.decode(msg.data)}`);
        }

        // Crear un suscriptor simple e iterar sobre los mensajes que coinciden con la suscripción
        const sub = nc.subscribe("subject1");
        (async () => {
            for await (const msg of sub) {
                handleMessage(msg);
            }
        })().then(() => {
            console.log("Suscripción activa a 'subject1'");
        }).catch((err) => {
            console.error('Error al suscribirse:', err);
        });

        // Mantener la conexión activa y esperar a que se cierren manualmente
        process.on('SIGINT', async () => {
            console.log('Desconectando del servidor NATS de manera ordenada...');
            await nc.close();
            console.log('Conexión cerrada');
            process.exit();
        });

    } catch (err) {
        console.error('Error al conectar al servidor NATS:', err);
    }
})();
