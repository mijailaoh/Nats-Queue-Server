// Importa la biblioteca NATS Streaming
const { connect } = require('node-nats-streaming');

const clusterName = 'nats-streaming';
const clientName = 'publisher-client';
const natsHost = 'nats://localhost:4222';
const channel = 'foo';

// Configura la conexión al servidor NATS Streaming
const sc = connect(clusterName, clientName, {
  url: natsHost, // Asegúrate de ajustar el puerto si es necesario
});

sc.on('connect', () => {
  console.log('Conectado al servidor NATS Streaming');

  // Función para publicar mensajes continuamente
  const publishMessages = () => {
    const message = `Hello node-nats-streaming! Mensaje enviado a las ${new Date().toLocaleTimeString()}`;

    // Publica el mensaje en el canal especificado
    sc.publish(channel, message, (err, guid) => {
      if (err) {
        console.log('Error al publicar:', err);
      } else {
        console.log('Mensaje publicado con GUID:', guid);
      }
    });
  };

  // Publica un mensaje inicial inmediatamente
  publishMessages();

  // Programa la publicación de mensajes cada 3 segundos
  const intervalId = setInterval(publishMessages, 3000);

  // Manejo de la señal SIGINT (Ctrl + C) para cerrar la conexión
  process.on('SIGINT', () => {
    console.log('\nCerrando conexión...');
    clearInterval(intervalId); // Detiene la publicación de mensajes
    sc.close(); // Cierra la conexión NATS Streaming
  });
});

sc.on('close', () => {
  console.log('Conexión cerrada');
  process.exit();
});

sc.on('error', (err) => {
  console.error('Error en la conexión:', err);
  process.exit(1);
});
