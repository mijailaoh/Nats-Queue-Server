const { connect } = require('nats');

// Información de conexión al servidor NATS
const servers = ['nats://192.168.1.240:4222'];
const opts = {
    token: 'token_secreto1' // Token para autenticación
};

// Función para publicar un mensaje con el tiempo actual
function publishMessage(nc) {
    const currentTime = new Date().toISOString();
    nc.publish('subject1', `Mensaje enviado por un publisher a las ${currentTime}`);
    console.log(`[Publisher] Mensaje enviado desde publisher a las ${currentTime}`);
}

// Conexión al servidor NATS con token
connect({ servers, token: opts.token })
    .then((nc) => {
        console.log('Conectado al servidor NATS');

        // Publicar un mensaje cada 5 segundos
        setInterval(() => {
            publishMessage(nc);
        }, 5000); // Intervalo de publicación cada 5 segundos

        // Manejar eventos de cierre de conexión
        nc.closed().then(() => {
            console.log('Conexión cerrada, intentando reconectar...');
            connect({ servers, token: opts.token }).then((newNc) => {
                console.log('Reconectado al servidor NATS');
                nc = newNc; // Actualizar la conexión
            }).catch((err) => {
                console.error('Error al reconectar:', err);
            });
        });
    })
    .catch((err) => {
        console.error('Error al conectar al servidor NATS:', err);
    });
