<?php
/**
 * Alternative Contact Form Handler - Without domain
 * Uses external email service or saves to file
 */

// Security headers
header('Content-Type: application/json; charset=utf-8');
header('X-Content-Type-Options: nosniff');
header('X-Frame-Options: DENY');
header('X-XSS-Protection: 1; mode=block');

// Error reporting
ini_set('display_errors', 0);
ini_set('log_errors', 1);
error_reporting(E_ALL);

// Configuration - VERVANG met jouw gegevens
define('RECIPIENT_EMAIL', 'Farhan2005231@gmail.com'); // VERVANG met jouw echte e-mail
define('SITE_NAME', 'BarakahBoost');
define('MAX_MESSAGE_LENGTH', 2000);
define('MIN_MESSAGE_LENGTH', 10);

/**
 * Send JSON response and exit
 */
function sendResponse($status, $message) {
    echo json_encode([
        'status' => $status,
        'message' => $message,
        'timestamp' => date('c')
    ]);
    exit;
}

/**
 * Validate and sanitize input
 */
function validateInput($data) {
    $errors = [];
    
    // Name validation
    $name = trim($data['name'] ?? '');
    if (empty($name)) {
        $errors['name'] = 'Naam is verplicht';
    } elseif (strlen($name) < 2) {
        $errors['name'] = 'Naam moet minimaal 2 karakters bevatten';
    } elseif (strlen($name) > 100) {
        $errors['name'] = 'Naam mag maximaal 100 karakters bevatten';
    } elseif (!preg_match('/^[a-zA-ZÀ-ÿ\s\'-]+$/u', $name)) {
        $errors['name'] = 'Naam bevat ongeldige karakters';
    }
    
    // Email validation
    $email = trim($data['email'] ?? '');
    if (empty($email)) {
        $errors['email'] = 'E-mailadres is verplicht';
    } elseif (!filter_var($email, FILTER_VALIDATE_EMAIL)) {
        $errors['email'] = 'Ongeldig e-mailadres';
    } elseif (strlen($email) > 254) {
        $errors['email'] = 'E-mailadres is te lang';
    }
    
    // Phone validation (optional)
    $phone = trim($data['phone'] ?? '');
    if (!empty($phone)) {
        if (!preg_match('/^[\+]?[0-9\s\-()]{8,20}$/', $phone)) {
            $errors['phone'] = 'Ongeldig telefoonnummer';
        }
    }
    
    // Message validation
    $message = trim($data['message'] ?? '');
    if (empty($message)) {
        $errors['message'] = 'Bericht is verplicht';
    } elseif (strlen($message) < MIN_MESSAGE_LENGTH) {
        $errors['message'] = 'Bericht moet minimaal ' . MIN_MESSAGE_LENGTH . ' karakters bevatten';
    } elseif (strlen($message) > MAX_MESSAGE_LENGTH) {
        $errors['message'] = 'Bericht mag maximaal ' . MAX_MESSAGE_LENGTH . ' karakters bevatten';
    }
    
    // Honeypot check (spam protection)
    $honeypot = trim($data['website'] ?? '');
    if (!empty($honeypot)) {
        error_log('Spam attempt detected from IP: ' . ($_SERVER['REMOTE_ADDR'] ?? 'unknown'));
        sendResponse('error', 'Er is een fout opgetreden. Probeer het later opnieuw.');
    }
    
    return [
        'errors' => $errors,
        'data' => [
            'name' => htmlspecialchars($name, ENT_QUOTES, 'UTF-8'),
            'email' => filter_var($email, FILTER_SANITIZE_EMAIL),
            'phone' => htmlspecialchars($phone, ENT_QUOTES, 'UTF-8'),
            'message' => htmlspecialchars($message, ENT_QUOTES, 'UTF-8'),
            'send_copy' => !empty($data['send_copy'])
        ]
    ];
}

/**
 * Save message to file (alternative to email)
 */
function saveMessageToFile($data) {
    $filename = 'contact_messages.txt';
    $timestamp = date('Y-m-d H:i:s');
    
    $message = "=== NIEUWE CONTACTAANVRAAG ===\n";
    $message .= "Datum: {$timestamp}\n";
    $message .= "Naam: {$data['name']}\n";
    $message .= "E-mail: {$data['email']}\n";
    if (!empty($data['phone'])) {
        $message .= "Telefoon: {$data['phone']}\n";
    }
    $message .= "Bericht:\n{$data['message']}\n";
    $message .= "IP: " . ($_SERVER['REMOTE_ADDR'] ?? 'unknown') . "\n";
    $message .= "================================\n\n";
    
    return file_put_contents($filename, $message, FILE_APPEND | LOCK_EX) !== false;
}

/**
 * Try to send email using different methods
 */
function tryToSendEmail($data) {
    // Method 1: Try PHP mail() function
    $subject = "Nieuwe contactaanvraag van " . $data['name'];
    $message = "Naam: " . $data['name'] . "\n";
    $message .= "E-mail: " . $data['email'] . "\n";
    if (!empty($data['phone'])) {
        $message .= "Telefoon: " . $data['phone'] . "\n";
    }
    $message .= "Bericht:\n" . $data['message'];
    
    $headers = "From: noreply@localhost\r\n";
    $headers .= "Reply-To: " . $data['email'] . "\r\n";
    $headers .= "Content-Type: text/plain; charset=UTF-8\r\n";
    
    if (mail(RECIPIENT_EMAIL, $subject, $message, $headers)) {
        return true;
    }
    
    // Method 2: Save to file as backup
    return saveMessageToFile($data);
}

// Rate limiting
function checkRateLimit() {
    $ip = $_SERVER['REMOTE_ADDR'] ?? 'unknown';
    $rateLimitFile = sys_get_temp_dir() . '/contact_form_' . md5($ip);
    
    if (file_exists($rateLimitFile)) {
        $lastSubmission = (int)file_get_contents($rateLimitFile);
        if (time() - $lastSubmission < 60) {
            sendResponse('error', 'Je kunt maximaal 1 bericht per minuut versturen. Probeer het later opnieuw.');
        }
    }
    
    file_put_contents($rateLimitFile, time());
}

// Main execution
try {
    if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
        sendResponse('error', 'Alleen POST-verzoeken zijn toegestaan.');
    }
    
    checkRateLimit();
    
    $validation = validateInput($_POST);
    
    if (!empty($validation['errors'])) {
        $errorMessage = 'Controleer de volgende velden: ' . implode(', ', array_keys($validation['errors']));
        sendResponse('error', $errorMessage);
    }
    
    $data = $validation['data'];
    
    // Try to send email or save to file
    if (tryToSendEmail($data)) {
        error_log('Contact form submission successful from: ' . $data['email']);
        sendResponse('success', 'Bedankt voor je aanvraag! We hebben je bericht ontvangen en nemen binnen 24 uur contact met je op.');
    } else {
        error_log('Failed to process contact form submission');
        sendResponse('error', 'Er is een probleem opgetreden bij het versturen van je bericht. Probeer het later opnieuw.');
    }
    
} catch (Exception $e) {
    error_log('Contact form error: ' . $e->getMessage());
    sendResponse('error', 'Er is een onverwachte fout opgetreden. Probeer het later opnieuw.');
}
?>
