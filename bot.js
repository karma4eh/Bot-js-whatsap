const { Client, LocalAuth } = require('whatsapp-web.js');
const qrcode = require('qrcode-terminal');

// Configurar cliente de WhatsApp
const client = new Client({
    authStrategy: new LocalAuth(), // Almacena la sesión localmente
});

// Generar código QR para iniciar sesión
client.on('qr', (qr) => {
    console.log('Escanea este código QR con tu teléfono:');
    qrcode.generate(qr, { small: true });
});
// Confirmar que el bot está liston
client.on('ready', () => {
    console.log('¡El bot está listo para usar!');
});

// Responder automáticamente a los mensajes
client.on('message', (message) => {
    console.log(`Mensaje recibido de ${message.from}: ${message.body}`);

    // Ejemplo de respuestas automáticas
    if (message.body.toLowerCase().includes('hola')) {
        message.reply('¡Hola! 😊 ¿Cómo puedo ayudarte con tu viaje?');
    } else if (message.body.toLowerCase().includes('paquete')) {
        message.reply('Tenemos paquetes turísticos increíbles. Envíame más detalles para ayudarte.');
    } else if (message.body.toLowerCase().includes('gracias')) {
        message.reply('¡De nada! Estoy aquí para ayudarte. 🌍✈️');
    }
});

// Iniciar el cliente
client.initialize();
