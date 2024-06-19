// Importa la biblioteca NATS Streaming
const { connect } = require('node-nats-streaming');

const clusterName = 'nats-streaming';
const clientName = 'subscriber-client';
const natsHost = 'nats://localhost:4222';
const channel = 'foo';

const sc = connect(clusterName, clientName, {
  url: natsHost,
});

let subscription;

// Función para manejar la interrupción de Ctrl+C
process.on('SIGINT', () => {
  console.log('\nDesconectando...');
  if (subscription) {
    subscription.unsubscribe();
  }
  sc.close();
});

sc.on('connect', () => {
  console.log('Conectado al servidor NATS Streaming');

  // Subscribe al tema 'foo'
  const opts = sc.subscriptionOptions().setDeliverAllAvailable();
  subscription = sc.subscribe(channel, opts);

  subscription.on('message', (msg) => {
    const sequenceNumber = msg.getSequence();
    const subject = msg.getSubject();
    const redelivered = msg.isRedelivered();
    const message = msg.getData();
    console.log(`Received message: ${message}`);
    console.log(`Sequence Number: ${sequenceNumber}`);
    console.log(`Redelivered: ${redelivered}`);
    console.log(`Channel: ${subject}`);
    console.log(`Timestamp: ${new Date(msg.getTimestamp()).toLocaleTimeString()}`);
  });

  subscription.on('error', (err) => {
    console.error(`Error en la suscripción: ${err}`);
  });

  subscription.on('unsubscribed', () => {
    console.log('Se ha cancelado la suscripción');
    sc.close();
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
