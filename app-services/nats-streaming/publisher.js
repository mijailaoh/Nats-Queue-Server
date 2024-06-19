const { connect, StringCodec } = require('node-nats-streaming');

const clusterId = 'test-cluster';
const clientId = 'publisher-client';
const serverUrl = 'nats://localhost:4222';

(async () => {
  try {
    // Conectarse al servidor NATS Streaming
    const sc = connect(clusterId, clientId, { url: serverUrl });

    // Manejar evento de conexión exitosa
    sc.on('connect', () => {
      console.log(`Conectado al servidor NATS Streaming en ${serverUrl}`);

      // Función para publicar un mensaje
      const publishMessage = () => {
        const subject = 'foo';
        const data = 'Hello from publisher!';

        const sc = StringCodec();
        sc.publish(subject, sc.encode(data), (err, guid) => {
          if (err) {
            console.error(`Error al publicar mensaje en '${subject}': ${err}`);
          } else {
            console.log(`Mensaje publicado en '${subject}': ${data}, guid: ${guid}`);
          }
        });
      };

      // Publicar un mensaje cada 5 segundos
      setInterval(publishMessage, 5000);

      // Manejar evento de cierre de conexión
      sc.on('close', () => {
        console.log('Conexión cerrada');
        process.exit();
      });
    });

    // Manejar eventos de error
    sc.on('error', (err) => {
      console.error(`Error en la conexión NATS Streaming: ${err}`);
    });

  } catch (err) {
    console.error(`Error al conectar con NATS Streaming: ${err}`);
    process.exit(1);
  }
})();
