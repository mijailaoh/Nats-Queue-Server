const { connect, StringCodec } = require('node-nats-streaming');

const sc = connect('nats-streaming', 'subscriber-client', {
  url: 'nats://localhost:4222',
});

sc.on('connect', () => {
  console.log('Conectado al servidor NATS Streaming');

  // Suscripción a estadísticas de canal
  const opts = sc.subscriptionOptions();
  const subscription = sc.subscribe('_STAN.acks.nats-streaming', opts);

  subscription.on('message', (msg) => {
    const channelInfo = JSON.parse(msg.getData());
    console.log('Estadísticas del canal:', channelInfo);
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
