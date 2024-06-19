// Importa la biblioteca NATS Streaming
const { connect, StringCodec } = require('node-nats-streaming');

// Configura la conexión al servidor NATS Streaming
const sc = connect('nats-streaming', 'subscriber-client', {
  url: 'nats://localhost:4222', // Asegúrate de ajustar el puerto si es necesario
});

sc.on('connect', () => {
  console.log('Conectado al servidor NATS Streaming');

  // Subscribe al tema 'foo'
  const opts = sc.subscriptionOptions().setStartWithLastReceived();
  const subscription = sc.subscribe('foo', opts);

  subscription.on('message', (msg) => {
    const message = msg.getData();
    console.log(`Received message: ${message}`);
    console.log(`Timestamp: ${new Date(msg.getTimestamp()).toLocaleTimeString()}`);
  });

  subscription.on('error', (err) => {
    console.error(`Error en la suscripción: ${err}`);
  });

  subscription.on('unsubscribed', () => {
    console.log('Se ha cancelado la suscripción');
    sc.close();
  });

  // Cierra la conexión después de un tiempo
  setTimeout(() => {
    console.log('Cerrando conexión');
    subscription.unsubscribe();
  }, 60000); // Después de 25 segundos, cancela la suscripción

});

sc.on('close', () => {
  console.log('Conexión cerrada');
  process.exit();
});

sc.on('error', (err) => {
  console.error('Error en la conexión:', err);
  process.exit(1);
});
