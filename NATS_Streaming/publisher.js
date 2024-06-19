// Importa la biblioteca NATS Streaming
const { connect, StringCodec } = require('node-nats-streaming');

// Configura la conexión al servidor NATS Streaming
const sc = connect('nats-streaming', 'publisher-client', {
  url: 'nats://localhost:4222', // Asegúrate de ajustar el puerto si es necesario
});

sc.on('connect', () => {
  console.log('Conectado al servidor NATS Streaming');

  // Función para publicar un mensaje cada 3 segundos
  setInterval(() => {
    const message = `Mensaje enviado a las ${new Date().toLocaleTimeString()}`;
    // Simple Publisher (all publishes are async in the node version of the client)
    sc.publish('foo', 'Hello node-nats-streaming!', (err, guid) => {
    if (err) {
        console.log('publish failed: ' + err)
    } else {
        console.log('published message with guid: ' + guid)
    }
    })


  }, 1000); // Envía un mensaje cada 3 segundos

  // Cierra la conexión después de un tiempo
  setTimeout(() => {
    console.log('Cerrando conexión');
    sc.close();
  }, 60000); // Cierra la conexión después de 15 segundos (opcional)
});

sc.on('close', () => {
  console.log('Conexión cerrada');
  process.exit();
});

sc.on('error', (err) => {
  console.error('Error en la conexión:', err);
  process.exit(1);
});
