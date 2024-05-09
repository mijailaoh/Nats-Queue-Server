const { connect, StringCodec } = require('nats');

(async () => {
    // para crear una conexión a un servidor nats:
    const nc = await connect({ servers: "nats://192.168.1.131:4222" });

    // crear un codec
    const sc = StringCodec();

    // crear un suscriptor simple e iterar sobre los mensajes
    // que coincidan con la suscripción
    const sub = nc.subscribe("subject1");
    for await (const m of sub) {
        console.log(`[${sub.getProcessed()}]: ${sc.decode(m.data)}`);
    }
    console.log("suscripción cerrada");

    // publicar algunos mensajes
    nc.publish("subject1", sc.encode("world"));
    nc.publish("subject1", sc.encode("again"));

    // queremos asegurarnos de que los mensajes en tránsito
    // se procesen, así que vamos a drenar la conexión.
    // Drenar es lo mismo que cerrar, pero asegura que todos
    // los mensajes en tránsito sean vistos por el iterador.
    // Después de llamar a drenar en la conexión, la conexión se cierra.
    await nc.drain();
})();
