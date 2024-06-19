// Importa el cliente NATS Streaming
const { connect } = require('node-nats-streaming');

// Define la configuración de conexión al servidor NATS Streaming
const clusterId = 'test-cluster';  // ID del cluster NATS Streaming
const clientId = 'subscriber-client';  // ID único del cliente
const serverUrl = 'nats://localhost:4222';  // URL del servidor NATS Streaming

// Crea un cliente NATS Streaming y suscríbete a un canal
(async () => {
  // Conecta al servidor NATS Streaming
  const sc = connect(clusterId, clientId, { url: serverUrl });

  sc.on('connect', () => {
    console.log(`Conectado al servidor NATS Streaming en ${serverUrl}`);

    // Función para manejar los mensajes recibidos
    const handleMessage = (msg) => {
      console.log(`Recibido mensaje en '${msg.getSubject()}': ${msg.getData()}`);
    };

    // Suscríbete a un canal
    const channel = 'mi-canal';  // Sustituye con el nombre del canal al que deseas suscribirte
    const subscription = sc.subscribe(channel, { durableName: 'durable-subscriber' });

    // Maneja los mensajes recibidos
    subscription.on('message', (msg) => {
      handleMessage(msg);
    });

    // Manejo de errores y cierre de conexión
    sc.on('error', (err) => {
      console.error(`Error en la conexión NATS Streaming: ${err}`);
    });

    sc.on('close', () => {
      console.log('Conexión cerrada');
      process.exit();
    });
  });

  // Manejo de errores de conexión
  sc.on('error', (err) => {
    console.error(`Error en la conexión NATS Streaming: ${err}`);
    process.exit(1);
  });
})();
