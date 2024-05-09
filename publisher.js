const { connect } = require('nats');

// Información de conexión al servidor NATS
const servers = ['nats://192.168.1.131:4222'];
const opts = {
    user: 'token_usuario1', // Token de autenticación
  };
  
  // Función para publicar un mensaje con el tiempo actual
  function publishMessage(nc) {
    const currentTime = new Date().toISOString();
    nc.publish('subject1', `Mensaje enviado por un publisher a las ${currentTime}`);
    console.log(`Mensaje enviado desde publisher a las ${currentTime}`);
  }
  
  // Conexión al servidor NATS
  connect({ servers, user: opts.user })
    .then((nc) => {
      console.log('Conectado al servidor NATS');
  
      // Publicar un mensaje cada 5 segundos
      setInterval(() => {
        publishMessage(nc);
      }, 500);
  
      // Cierra la conexión
      // nc.close();
    })
    .catch((err) => {
      console.error('Error al conectar al servidor NATS:', err);
    });
