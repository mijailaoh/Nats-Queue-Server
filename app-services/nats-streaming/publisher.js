const { connect } = require('node-nats-streaming');

async function run() {
  const clusterID = 'test-cluster';
  const clientID = 'client-1';
  const servers = 'nats://192.168.1.170:4222';
  const subject = 'subject-1';
  const options = {
    user: 'token_usuario1',
    pass: 'password_segura'
  };

  try {
    const sc = connect(clusterID, clientID, {
      servers,
      ...options
    });

    sc.on('connect', () => {
      console.log(`Conectado a NATS Streaming cluster ID ${clusterID} como cliente ${clientID}`);

      // Suscribirse a un canal (subject)
      const sub = sc.subscribe(subject);
      sub.on('message', (msg) => {
        console.log(`[Received] ${msg.getData()}`);
      });

      // Publicar un mensaje
      const message = "Hola desde el publisher";
      sc.publish(subject, message, (err, guid) => {
        if (err) {
          console.error('Error al publicar:', err);
        } else {
          console.log(`[Published] Mensaje: ${message}, GUID: ${guid}`);
        }
      });
    });

    sc.on('error', (err) => {
      console.error('Error al conectar a NATS Streaming:', err);
    });

    sc.on('close', () => {
      console.log('Conexión a NATS Streaming cerrada');
      process.exit();
    });

  } catch (err) {
    console.error('Error al conectar a NATS Streaming:', err);
  }
}

run();
