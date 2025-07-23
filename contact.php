<?php
// Dit is het PHP-script dat de e-mail verstuurt.
// Plaats dit bestand op je webserver (bijv. in dezelfde map als je index.html).

// Zorg ervoor dat je foutrapportage inschakelt tijdens ontwikkeling
ini_set('display_errors', 1);
ini_set('display_startup_errors', 1);
error_reporting(E_ALL);

header('Content-Type: application/json'); // Belangrijk: vertel de browser dat we JSON terugsturen

// Controleer of het formulier is ingediend via POST
if ($_SERVER["REQUEST_METHOD"] == "POST") {
  // Haal de formuliergegevens op en ontsnap ze om injectie te voorkomen
  $name = htmlspecialchars(trim($_POST['name']));
  $email = htmlspecialchars(trim($_POST['email']));
  $phone = htmlspecialchars(trim($_POST['phone']));
  $message = htmlspecialchars(trim($_POST['message']));

  // Valideer de gegevens
  if (empty($name) || empty($email) || empty($message)) {
      echo json_encode(['status' => 'error', 'message' => 'Vul alle verplichte velden in.']);
      exit;
  }

  if (!filter_var($email, FILTER_VALIDATE_EMAIL)) {
      echo json_encode(['status' => 'error', 'message' => 'Voer een geldig e-mailadres in.']);
      exit;
  }

  // Configureer je e-mailinstellingen
  // VERVANG 'jouw_ontvangst_email@example.com' met het e-mailadres waar je de berichten wilt ontvangen
  $to = 'volgaspapa@gmail.com'; 
  $subject = "Nieuwe contactaanvraag van " . $name;
  $headers = "From: " . $email . "\r\n";
  $headers .= "Reply-To: " . $email . "\r\n";
  $headers .= "MIME-Version: 1.0\r\n";
  $headers .= "Content-Type: text/html; charset=UTF-8\r\n";

  // E-mailinhoud
  $email_content = "
      <html>
      <head>
          <title>Nieuwe contactaanvraag</title>
      </head>
      <body>
          <p><strong>Naam:</strong> {$name}</p>
          <p><strong>E-mail:</strong> {$email}</p>
          <p><strong>Telefoon:</strong> " . (!empty($phone) ? $phone : 'Niet opgegeven') . "</p>
          <p><strong>Bericht:</strong></p>
          <p>{$message}</p>
      </body>
      </html>
  ";

  // Verstuur de e-mail
  if (mail($to, $subject, $email_content, $headers)) {
      echo json_encode(['status' => 'success', 'message' => 'Bedankt voor je aanvraag! We nemen binnen 24 uur contact met je op.']);
      exit;
  } else {
      echo json_encode(['status' => 'error', 'message' => 'Er is een fout opgetreden bij het verzenden van het bericht. Probeer het later opnieuw.']);
      exit;
  }
} else {
  // Als het script direct wordt benaderd zonder POST-gegevens
  echo json_encode(['status' => 'error', 'message' => 'Ongeldige aanvraagmethode.']);
  exit;
}
// IMPORTANT: Do NOT add a closing ?> tag here.
// This prevents accidental whitespace from being sent after the JSON.
