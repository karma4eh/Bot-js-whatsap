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

// Confirmar que el bot está listo
client.on('ready', () => {
    console.log('¡El bot está listo para usar!');
});

// Responder automáticamente a los mensajes
client.on('message', (message) => {
    console.log(`Mensaje recibido de ${message.from}: ${message.body}`);

    const text = message.body.toLowerCase();

    if (text.includes('hola')) {
        message.reply('¡Hola! 😊 ¿Cómo puedo ayudarte con tu viaje?');
    } else if (text.includes('mochima')) {
        message.reply(
            `🌴 *Paquete Mochima* 🌊\n` +
            `Incluye:\n` +
            `- 5 días de playa: La Gabarra, Maritas, Playa Blanca, Manare y las Aguas de Moisés (entrada adicional $10).\n` +
            `- Desayunos, almuerzos y cenas.\n` +
            `- Recreación personalizada.\n` +
            `¡Un viaje inolvidable! ¿Te interesa? 🏖️`
        );
    } else if (text.includes('chichiriviche')) {
        message.reply(
            `🌴 *Paquete Chichiriviche* 🌊\n` +
            `Opciones disponibles:\n` +
            `- 3 días ($130): Playas incluidas: Varadero, Cayo Mero, Cayo Sombrero.\n` +
            `- 4 días ($155): Incluye las playas anteriores y Los Juanes.\n` +
            `Ambas opciones incluyen desayunos, almuerzos y cenas.\n` +
            `¿Qué te parece? 🌅`
        );
    } else if (text.includes('paquete')) {
        message.reply(
            `📦 *Paquetes disponibles*:\n` +
            `1️⃣ *Mochima*: 5 días de aventura por $10 adicionales (entrada Aguas de Moisés).\n` +
            `2️⃣ *Chichiriviche*: 3 días por $130 o 4 días por $155.\n` +
            `¡Dime cuál te interesa para darte más detalles! 😊`
        );
    } else if (text.includes('gracias')) {
        message.reply('¡De nada! Estoy aquí para ayudarte. 🌍✈️');
    } else {
        message.reply(
            `Lo siento, no entiendo tu mensaje. 😅\n` +
            `Puedes preguntar por los paquetes de *Mochima* o *Chichiriviche*. ¡Estoy para ayudarte!`
        );
    }
});

// Iniciar el cliente
client.initialize();
