// Importa la biblioteca NATS Streaming
const { connect, StringCodec } = require('node-nats-streaming');

const clusterName = 'nats-streaming'
const clientName = 'subscriber-client'
const natsHost = 'nats://localhost:4222'
const chanel = 'foo'

const sc = connect(clusterName, clientName, {
  url: natsHost,
});


sc.on('connect', () => {
  console.log('Conectado al servidor NATS Streaming');

  // Subscribe al tema 'foo'
  //const opts = sc.subscriptionOptions().setDeliverAllAvailable();
  //const opts = sc.subscriptionOptions().setStartWithLastReceived();
  //const opts = sc.subscriptionOptions().setStartAtSequence(1);
  const opts = sc.subscriptionOptions().setDeliverAllAvailable();
  const subscription = sc.subscribe(chanel, opts);

  subscription.on('message', (msg) => {
    const sequenceNumber = msg.getSequence();
    const subject = msg.getSubject();
    const redelivered = msg.isRedelivered();
    const message = msg.getData();
    console.log(`Received message: ${message}`);
    console.log(`Sequence Number: ${sequenceNumber}`);
    console.log(`Redelivered: ${redelivered}`);
    console.log(`chanel: ${subject}`);
    console.log(`Timestamp: ${new Date(msg.getTimestamp()).toLocaleTimeString()}`);
  
    // Confirma el mensaje después de procesarlo
    //msg.ack();
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
