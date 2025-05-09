const { createBot, createProvider, createFlow, addKeyword } = require('@bot-whatsapp/bot')

const QRPortalWeb = require('@bot-whatsapp/portal')
const BaileysProvider = require('@bot-whatsapp/provider/baileys')
const MockAdapter = require('@bot-whatsapp/database/mock')

// FLUJO PARA RESPUESTAS NO ENTENDIDAS
const flowDefault = addKeyword('')
    .addAnswer([
        '🤖 *Disculpa, no entendí tu mensaje*',
        '',
        'Opciones válidas:',
        '👉 *1*, *2*, *3* - Elegir destino',
        '👉 *información* - Sobre nuestra agencia',
        '👉 *reservar* - Iniciar reservación',
        '👉 *hola* - Volver al inicio'
    ])

// FLUJO DE RESERVAS
const flowReservar = addKeyword(['reservar', 'reserva'])
    .addAnswer([
        '📅 *¡Perfecto!* Vamos a crear tu reserva:',
        '',
        'Necesitamos:',
        '1. 📝 Nombre completo',
        '2. 👥 Número de personas',
        '3. 📅 Fechas deseadas',
        '4. 🏖 Destino elegido',
        '',
        'Un asesor te contactará pronto para confirmar ✨'
    ])

// INFORMACIÓN GENERAL DE LA AGENCIA
const flowInfoAgencia = addKeyword(['información', 'info', 'agencia'])
    .addAnswer([
        '🌟 *Somos una agencia con más de 25 años de trayectoria* 🌟',
        '',
        '✨ *Paquetes Full Day con todo incluido:*',
        '- 🚌 Bus con aire acondicionado',
        '- 🍽 3 comidas diarias',
        '- ⛵ Lanchas a playas paradisíacas',
        '- 🏨 Habitaciones privadas',
        '- 🕒 Asistencia 24/7',
        '- 💳 Facilidades de pago',
        '',
        'Escribe el *número* de tu destino favorito para ver detalles:',
        '1️⃣ Chichiriviche',
        '2️⃣ Mochima',
        '3️⃣ Tucacas'
    ])

// Función para filtrar fechas por mes
const filtrarFechasPorMes = (fechas, mes) => {
    const meses = {
        'enero': 'ENE', 'febrero': 'FEB', 'marzo': 'MAR', 'abril': 'ABR',
        'mayo': 'MAYO', 'junio': 'JUN', 'julio': 'JUL', 'agosto': 'AGO',
        'septiembre': 'SEP', 'octubre': 'OCT', 'noviembre': 'NOV', 'diciembre': 'DIC'
    };
    
    const mesBusqueda = meses[mes.toLowerCase()];
    if (!mesBusqueda) return [];
    
    return fechas.filter(fecha => fecha.includes(mesBusqueda));
}

// FLUJO PARA MANEJAR LA SELECCIÓN DE MES
const flowMes = addKeyword(['enero', 'febrero', 'marzo', 'abril', 'mayo', 'junio', 'julio', 'agosto', 'septiembre', 'octubre', 'noviembre', 'diciembre'])
    .addAction(
        async (ctx, { flowDynamic, state }) => {
            const mes = ctx.body.toLowerCase();
            const { destino } = await state.getMyState();
            
            // Fechas completas para cada destino
            const fechasChichiriviche = [
                '✓ DEL 15 AL 19 MAYO 2025 (4D/3N CELEBRACIÓN DE LAS MADRES)',
                '✓ DEL 21 AL 25 MAYO 2025 (4D/3N PAQUETE LUISANA BOGOTÁ)',
                '✓ DEL 05 AL 08 JUN 2025 (PROMO 3D/2N)',
                '✓ DEL 26 AL 29 JUN 2025 (PROMO 3D/2N)',
                '✓ DEL 19 AL 22 JUN 2025 (OCUMARE 3D/2N)',
                '✓ DEL 03 AL 06 JUL 2025 (PROMO 3D/2N)',
                '✓ DEL 17 AL 20 JUL 2025 (PROMO 3D/2N)',
                '✓ DEL 20 AL 24 JUL 2025 (4D/3N)',
                '✓ DEL 31 JUL AL 04 AGO 2025 (4D/3N)',
                '✓ DEL 04 AL 08 AGO 2025 (4D/3N)',
                '✓ DEL 08 AL 12 AGO 2025 (4D/3N)',
                '✓ DEL 12 AL 15 AGO 2025 (PROMO 3D/2N)',
                '✓ DEL 15 AL 19 AGO 2025 (4D/3N)',
                '✓ DEL 29 AGO AL 02 SEP 2025 (4D/3N)',
                '✓ DEL 12 AL 15 SEP 2025 (PROMO 3D/2N)',
                '✓ DEL 16 AL 19 SEP 2025 (PROMO 3D/2N)',
                '✓ DEL 19 AL 23 SEP 2025 (4D/3N)',
                '✓ DEL 25 AL 28 SEP 2025 (PROMO 3D/2N)',
                '✓ DEL 02 AL 05 OCT 2025 (PROMO 3D/2N)',
                '✓ DEL 30 OCT AL 02 NOV 2025 (PROMO 3D/2N)',
                '✓ DEL 06 AL 09 NOV 2025 (PROMO 3D/2N)',
                '✓ DEL 27 AL 30 NOV 2025 (PROMO 3D/2N)',
                '✓ DEL 11 AL 14 DIC 2025 (PROMO 3D/2N)',
                '✓ DEL 22 AL 26 DIC 2025 (4D/3N)',
                '✓ DEL 29 DIC AL 02 ENE 2026 (4D/3N)',
                '✓ DEL 03 AL 07 ENE 2026 (4D/3N)'
            ];
            
            const fechasMochima = [
                '✓ DEL 21 AL 27 AGO 2025 (5 DÍAS)',
                '✓ DEL 05 AL 11 SEP 2025 (5 DÍAS)',
                '✓ DEL 02 AL 08 ENE 2026 (5 DÍAS)'
            ];

            const fechasTucacas = [
                '✓ Próximas fechas en planificación',
                '✓ Consulta por paquetes personalizados'
            ];

            let fechasFiltradas = [];
            let nombreDestino = '';
            
            if (destino === 'Chichiriviche' || destino === '1') {
                fechasFiltradas = filtrarFechasPorMes(fechasChichiriviche, mes);
                nombreDestino = 'CHICHIRIVICHE';
            } else if (destino === 'Mochima' || destino === '2') {
                fechasFiltradas = filtrarFechasPorMes(fechasMochima, mes);
                nombreDestino = 'MOCHIMA';
            } else if (destino === 'Tucacas' || destino === '3') {
                fechasFiltradas = filtrarFechasPorMes(fechasTucacas, mes);
                nombreDestino = 'TUCACAS';
            }

            if (fechasFiltradas.length > 0) {
                await flowDynamic([
                    `📅 *FECHAS ${nombreDestino} - ${mes.toUpperCase()}*\n\n` +
                    fechasFiltradas.join('\n') +
                    '\n\n💬 *¿Vas a reservar?* Di *reservar*'
                ]);
            } else {
                await flowDynamic([
                    `ℹ No tenemos fechas programadas para ${nombreDestino} en ${mes}.`,
                    '',
                    '💬 Puedes escribir otro mes o *reservar* para contactar un asesor'
                ]);
            }
        }
    );

// FLUJO CHICHIRIVICHE
const flowChichiriviche = addKeyword(['Chichiriviche', '1'])
    .addAnswer([
        '🌴 *PAQUETE CHICHIRIVICHE* (3-4 días)',
        '',
        '📌 *Incluye:*',
        '- 🚌 Bus cama con puestos asignados',
        '- ⛵ Visita 4 o 3 playas:',
        '  • Cayo Sal',
        '  • Cayo Sombrero',
        '  • Varadero',
        '  • Cayo Muerto',
        '- 🎉 Transporte en chiva rumbera',
        '- 🏨 Alojamiento con aire acondicionado',
        '- 🍽 Alimentación completa',
        '',
        '¿Qué mes estás interesado en viajar? (Ejemplo: Agosto)'
    ])
    .addAction(
        { capture: true },
        async (ctx, { flowDynamic, gotoFlow, state }) => {
            await state.update({ destino: 'Chichiriviche' });
            const mes = ctx.body.toLowerCase();
            
            if (mes === 'reservar') {
                return gotoFlow(flowReservar);
            } else if (mes === 'información') {
                return gotoFlow(flowInfoAgencia);
            } else if (mes === 'hola') {
                return gotoFlow(flowPrincipal);
            } else {
                return gotoFlow(flowMes);
            }
        }
    );

// FLUJO MOCHIMA
const flowMochima = addKeyword(['Mochima', '2'])
    .addAnswer([
        '🏝 *PAQUETE MOCHIMA* (5 días)',
        '',
        '📌 *Incluye:*',
        '- 🚌 Viaje en buses cómodos con aire acondicionado',
        '- 🏨 Habitaciones cómodas con aire acondicionado',
        '- � 3 comidas diarias incluidas',
        '- ⛵ Visita a 4 playas espectaculares:',
        '  • La Gabarra',
        '  • Maritas',
        '  • Playa Blanca',
        '  • Manare',
        '- 🎉 Recreación personalizada',
        '- 🏞 Excursión al Parque Las Aguas de Moisés (Cariaco) con costo adicional de $10 por persona:',
        '  • Toboganes',
        '  • Pozos naturales',
        '  • Cascadas',
        '  • Y mucho más',
        '',
        '¿Qué mes estás interesado en viajar? (Ejemplo: Agosto)'
    ])
    .addAction(
        { capture: true },
        async (ctx, { flowDynamic, gotoFlow, state }) => {
            await state.update({ destino: 'Mochima' });
            const mes = ctx.body.toLowerCase();
            
            if (mes === 'reservar') {
                return gotoFlow(flowReservar);
            } else if (mes === 'información') {
                return gotoFlow(flowInfoAgencia);
            } else if (mes === 'hola') {
                return gotoFlow(flowPrincipal);
            } else {
                return gotoFlow(flowMes);
            }
        }
    );

// FLUJO TUCACAS
const flowTucacas = addKeyword(['Tucacas', '3'])
    .addAnswer([
        '🌊 *PAQUETE TUCACAS* (4 días/3 noches)',
        '',
        '📌 *Incluye:*',
        '- 🚌 Transporte ida y vuelta en bus ejecutivo con aire acondicionado',
        '- 🏨 Alojamiento en posada turística (habitaciones dobles/triples con A/A)',
        '- 🍽️ Alimentación completa (3 comidas diarias + snacks)',
        '- ⛵ Excursiones a:',
        '  • Cayo Sombrero (2 días)',
        '  • Cayo Sal (1 día)',
        '  • Playas de Morrocoy (1 día)',
        '- 🤿 Equipo básico de snorkel',
        '- 🎉 Actividades recreativas y juegos en la playa',
        '- 🚤 Transporte lacustre a todos los cayos',
        '- �‍⚕️ Asistencia médica básica',
        '',
        '¿Qué mes estás interesado en viajar? (Ejemplo: Agosto)'
    ])
    .addAction(
        { capture: true },
        async (ctx, { flowDynamic, gotoFlow, state }) => {
            await state.update({ destino: 'Tucacas' });
            const mes = ctx.body.toLowerCase();
            
            if (mes === 'reservar') {
                return gotoFlow(flowReservar);
            } else if (mes === 'información') {
                return gotoFlow(flowInfoAgencia);
            } else if (mes === 'hola') {
                return gotoFlow(flowPrincipal);
            } else {
                return gotoFlow(flowMes);
            }
        }
    );

// FLUJO FECHAS (ACTUALIZADO)
const flowFechas = addKeyword(['fechas', 'disponibilidad', 'cuándo', 'fecha'])
    .addAnswer([
        '📅 *Consulta de Fechas Disponibles*',
        '',
        'Escribe el nombre del destino para ver sus fechas programadas:',
        '🏝 *Chichiriviche*',
        '🏝 *Mochima*',
        '🏝 *Tucacas*',
        '',
        'O escribe *todas* para ver toda la programación'
    ])
    .addAction(
        { capture: true },
        async (ctx, { gotoFlow, flowDynamic }) => {
            const destino = ctx.body.toLowerCase();
            
            // Fechas actualizadas
            const fechasChichiriviche = [
                '✓ DEL 15 AL 19 MAYO 2025 (4D/3N CELEBRACIÓN DE LAS MADRES)',
                '✓ DEL 21 AL 25 MAYO 2025 (4D/3N PAQUETE LUISANA BOGOTÁ)',
                '✓ DEL 05 AL 08 JUN 2025 (PROMO 3D/2N)',
                '✓ DEL 26 AL 29 JUN 2025 (PROMO 3D/2N)',
                '✓ DEL 19 AL 22 JUN 2025 (OCUMARE 3D/2N)',
                '✓ DEL 03 AL 06 JUL 2025 (PROMO 3D/2N)',
                '✓ DEL 17 AL 20 JUL 2025 (PROMO 3D/2N)',
                '✓ DEL 20 AL 24 JUL 2025 (4D/3N)',
                '✓ DEL 31 JUL AL 04 AGO 2025 (4D/3N)',
                '✓ DEL 04 AL 08 AGO 2025 (4D/3N)',
                '✓ DEL 08 AL 12 AGO 2025 (4D/3N)',
                '✓ DEL 12 AL 15 AGO 2025 (PROMO 3D/2N)',
                '✓ DEL 15 AL 19 AGO 2025 (4D/3N)',
                '✓ DEL 29 AGO AL 02 SEP 2025 (4D/3N)',
                '✓ DEL 12 AL 15 SEP 2025 (PROMO 3D/2N)',
                '✓ DEL 16 AL 19 SEP 2025 (PROMO 3D/2N)',
                '✓ DEL 19 AL 23 SEP 2025 (4D/3N)',
                '✓ DEL 25 AL 28 SEP 2025 (PROMO 3D/2N)',
                '✓ DEL 02 AL 05 OCT 2025 (PROMO 3D/2N)',
                '✓ DEL 30 OCT AL 02 NOV 2025 (PROMO 3D/2N)',
                '✓ DEL 06 AL 09 NOV 2025 (PROMO 3D/2N)',
                '✓ DEL 27 AL 30 NOV 2025 (PROMO 3D/2N)',
                '✓ DEL 11 AL 14 DIC 2025 (PROMO 3D/2N)',
                '✓ DEL 22 AL 26 DIC 2025 (4D/3N)',
                '✓ DEL 29 DIC AL 02 ENE 2026 (4D/3N)',
                '✓ DEL 03 AL 07 ENE 2026 (4D/3N)'
            ];
            
            const fechasMochima = [
                '✓ DEL 21 AL 27 AGO 2025 (5 DÍAS)',
                '✓ DEL 05 AL 11 SEP 2025 (5 DÍAS)',
                '✓ DEL 02 AL 08 ENE 2026 (5 DÍAS)'
            ];

            const fechasTucacas = [
                '✓ Próximas fechas en planificación',
                '✓ Consulta por paquetes personalizados'
            ];

            if (destino.includes('chichiriviche') || destino === '1') {
                await flowDynamic([
                    '🌴 *TODAS LAS FECHAS CHICHIRIVICHE 2025-2026*\n\n' + 
                    fechasChichiriviche.join('\n') +
                    '\n\n💬 Escribe el *mes* que te interesa (ej: Agosto) o *reservar*'
                ]);
            }
            else if (destino.includes('mochima') || destino === '2') {
                await flowDynamic([
                    '🏝 *TODAS LAS FECHAS MOCHIMA 2025-2026*\n\n' + 
                    fechasMochima.join('\n') +
                    '\n\n💬 Escribe el *mes* que te interesa o *reservar*'
                ]);
            }
            else if (destino.includes('tucacas') || destino === '3') {
                await flowDynamic([
                    '🌊 *FECHAS TUCACAS*\n\n' + 
                    fechasTucacas.join('\n') +
                    '\n\n💬 Escribe *reservar* para contactar un asesor'
                ]);
            }
            else if (destino.includes('todas')) {
                await flowDynamic([
                    '📅 *TODAS LAS FECHAS VIGENTES 2025-2026*',
                    '',
                    '🌴 *CHICHIRIVICHE:*\n' + fechasChichiriviche.join('\n'),
                    '',
                    '🏝 *MOCHIMA:*\n' + fechasMochima.join('\n'),
                    '',
                    '🌊 *TUCACAS:*\n' + fechasTucacas.join('\n'),
                    '',
                    '📅 Para reservar di *reservar*'
                ]);
            }
            else {
                await flowDynamic('⚠️ No reconozco ese destino. Por favor escribe: *Chichiriviche*, *Mochima* o *Tucacas*');
                return gotoFlow(flowFechas);
            }
        }
    );

// FLUJO PRINCIPAL
const flowPrincipal = addKeyword(['hola', 'buenos días', 'buenas', 'alo'])
    .addAnswer([
        '✨ ¡Hola Viajero! ✨',
        '*Soy Nenita*, tu bot asistente 🤖',
        '¿En qué puedo ayudarte? 😊',
        '',
        'Elige una opción:',
        '',
        '🏖 *Destinos:*',
        '🏝 1 Chichiriviche',
        '🏝 2 Mochima',
        '🏝 3 Tucacas',
        '',
        '📅 *Consultas:*',
        '👉 *fechas* - Ver disponibilidad',
        '👉 *reservar* - Iniciar reserva',
        '',
        'ℹ *Información:*',
        '👉 *información* - Sobre nuestra agencia'
    ], null, null, [flowChichiriviche, flowMochima, flowTucacas, flowInfoAgencia, flowFechas, flowReservar])

// MAIN FUNCTION
const main = async () => {
    const adapterDB = new MockAdapter()
    const adapterFlow = createFlow([
        flowPrincipal,
        flowInfoAgencia,
        flowChichiriviche,
        flowMochima,
        flowTucacas,
        flowReservar,
        flowFechas,
        flowMes,
        flowDefault
    ])
    const adapterProvider = createProvider(BaileysProvider)

    createBot({
        flow: adapterFlow,
        provider: adapterProvider,
        database: adapterDB,
    })

    QRPortalWeb()
}

main()