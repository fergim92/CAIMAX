#include <Wire.h>
#include <SPI.h>
#include <MFRC522.h>
#include <LiquidCrystal_I2C.h>
#include <Adafruit_Fingerprint.h>
#include <WiFi.h>
#include <HTTPClient.h>
#include <ArduinoJson.h>

// Pines para RFID RC522
#define RST_PIN 22
#define SS_PIN 5

// Pines para Sensor de Huella
#define FP_RX 16
#define FP_TX 17

// Pines LED
#define RED_PIN 14
#define GREEN_PIN 12

// Configuración WiFi y API
const char *ssid = "UNRN";
const char *password = "estudiante2022+";
const char *apiUrl = "https://caimax.vercel.app/api/accessActivity";
const int lectorId = 1;

// Instancias de dispositivos
MFRC522 rfid(SS_PIN, RST_PIN);
LiquidCrystal_I2C lcd(0x27, 16, 2);
HardwareSerial fpSerial(2);
Adafruit_Fingerprint finger = Adafruit_Fingerprint(&fpSerial);

// Constantes de tiempo
const unsigned long WIFI_TIMEOUT = 20000;
const unsigned long RETRY_DELAY = 5000;
const int MAX_RETRIES = 3;

// Estados del sistema
enum SystemState
{
  WAITING,
  ENROLLING,
  SCANNING,
  CONNECTING,
  ERROR
};

// Tipos de identificación
enum IDType
{
  FINGERPRINT,
  RFID,
  TAG_RFID
};

SystemState currentState = WAITING;
uint8_t enrollId = 1;
bool modoLectura = false;

void updateLCDMessage(String line1, String line2 = "")
{
  lcd.clear();
  lcd.setCursor(0, 0);
  lcd.print(line1);
  if (line2.length() > 0)
  {
    lcd.setCursor(0, 1);
    lcd.print(line2);
  }
}

void showAccessMessage(bool granted, String id = "")
{
  if (granted)
  {
    // Para verde necesitamos ambos pines en HIGH
    digitalWrite(GREEN_PIN, HIGH);
    digitalWrite(RED_PIN, HIGH);
    Serial.println("Acceso Autorizado");
    if (modoLectura && id != "")
    {
      updateLCDMessage("Acceso Autorizado", id);
    }
    else
    {
      updateLCDMessage("Acceso", "Autorizado");
    }
  }
  else
  {
    // Para rojo necesitamos un pin en HIGH y otro en LOW
    digitalWrite(RED_PIN, HIGH);
    digitalWrite(GREEN_PIN, LOW);
    Serial.println("Acceso Denegado");
    if (modoLectura && id != "")
    {
      updateLCDMessage("Acceso Denegado", id);
    }
    else
    {
      updateLCDMessage("Acceso", "Denegado");
    }
  }
  delay(2000);
  // Para apagar ambos en LOW
  digitalWrite(GREEN_PIN, LOW);
  digitalWrite(RED_PIN, LOW);
}

bool connectToWiFi()
{
  unsigned long startAttempt = millis();
  WiFi.begin(ssid, password);
  updateLCDMessage("Conectando WiFi");

  while (WiFi.status() != WL_CONNECTED)
  {
    if (millis() - startAttempt > WIFI_TIMEOUT)
    {
      updateLCDMessage("Timeout WiFi");
      return false;
    }
    delay(500);
  }

  updateLCDMessage("WiFi OK", WiFi.localIP().toString());
  delay(1000);
  return true;
}

bool ensureWiFiConnection()
{
  if (WiFi.status() == WL_CONNECTED)
    return true;

  WiFi.disconnect(true);
  delay(1000);

  for (int i = 0; i < MAX_RETRIES; i++)
  {
    if (connectToWiFi())
      return true;
    delay(RETRY_DELAY);
  }

  return false;
}

bool registrarAcceso(String id, IDType idType)
{
  if (!ensureWiFiConnection())
  {
    updateLCDMessage("Error WiFi");
    return false;
  }

  HTTPClient http;
  http.begin(apiUrl);
  http.addHeader("Content-Type", "application/json");

  StaticJsonDocument<200> doc;

  switch (idType)
  {
  case FINGERPRINT:
    doc["fingerprint_id"] = id.toInt();
    break;
  case RFID:
    doc["rfid"] = id;
    break;
  case TAG_RFID:
    doc["tag_rfid"] = id;
    break;
  }

  doc["lector_id"] = lectorId;

  String jsonString;
  serializeJson(doc, jsonString);
  Serial.println("Enviando: " + jsonString);

  int httpResponseCode = http.POST(jsonString);
  String response = http.getString();
  Serial.println("Código de respuesta: " + String(httpResponseCode));
  Serial.println("Respuesta: " + response);

  bool success = (httpResponseCode == 201 || httpResponseCode == 200);

  if (success)
  {
    Serial.println("POST exitoso");
    showAccessMessage(true, id);
  }
  else
  {
    Serial.println("Error POST: " + String(httpResponseCode));
    showAccessMessage(false, id);
  }

  http.end();
  return success;
}

void setupFingerprint()
{
  fpSerial.begin(57600, SERIAL_8N1, FP_RX, FP_TX);
  if (finger.verifyPassword())
  {
    updateLCDMessage("Sensor OK");
  }
  else
  {
    updateLCDMessage("Error Sensor!");
    while (1)
    {
      delay(1000);
    }
  }
  delay(1000);
}

uint8_t getFingerprintEnroll()
{
  int p = -1;
  updateLCDMessage("Coloque su dedo", "en el sensor");

  while (p != FINGERPRINT_OK)
  {
    p = finger.getImage();
    switch (p)
    {
    case FINGERPRINT_OK:
      updateLCDMessage("Imagen tomada");
      break;
    case FINGERPRINT_NOFINGER:
      break;
    default:
      updateLCDMessage("Error imagen");
      return p;
    }
  }

  p = finger.image2Tz(1);
  if (p != FINGERPRINT_OK)
  {
    updateLCDMessage("Error conversion");
    return p;
  }

  updateLCDMessage("Retire el dedo");
  delay(2000);
  p = 0;
  while (p != FINGERPRINT_NOFINGER)
  {
    p = finger.getImage();
  }

  updateLCDMessage("Mismo dedo", "nuevamente");
  while (p != FINGERPRINT_OK)
  {
    p = finger.getImage();
  }

  p = finger.image2Tz(2);
  if (p != FINGERPRINT_OK)
  {
    updateLCDMessage("Error conv. 2");
    return p;
  }

  p = finger.createModel();
  if (p != FINGERPRINT_OK)
  {
    updateLCDMessage("Error modelo");
    return p;
  }

  p = finger.storeModel(enrollId);
  if (p == FINGERPRINT_OK)
  {
    updateLCDMessage("Huella guardada", "ID: " + String(enrollId));
  }
  else
  {
    updateLCDMessage("Error guardando");
    return p;
  }

  return true;
}

int getFingerprintID()
{
  uint8_t p = finger.getImage();
  if (p != FINGERPRINT_OK)
    return -1;

  p = finger.image2Tz();
  if (p != FINGERPRINT_OK)
    return -1;

  p = finger.fingerSearch();
  if (p == FINGERPRINT_OK)
  {
    String fingerprintId = String(finger.fingerID);
    Serial.println("Huella encontrada ID: " + fingerprintId);
    registrarAcceso(fingerprintId, FINGERPRINT);
    return finger.fingerID;
  }
  else
  {
    showAccessMessage(false);
  }

  return -1;
}

void checkRFID()
{
  if (!rfid.PICC_IsNewCardPresent() || !rfid.PICC_ReadCardSerial())
  {
    return;
  }

  String uid = "";
  for (byte i = 0; i < rfid.uid.size; i++)
  {
    uid += (rfid.uid.uidByte[i] < 0x10 ? "0" : "");
    uid += String(rfid.uid.uidByte[i], HEX);
  }
  uid.toUpperCase();

  Serial.println("UID Detectado: " + uid);

  if (modoLectura)
  {
    updateLCDMessage("UID Detectado:", uid);
    delay(2000);
  }

  bool accessGranted = false;

  // Intentar primero como tag_rfid
  HTTPClient http;
  http.begin(apiUrl);
  http.addHeader("Content-Type", "application/json");
  StaticJsonDocument<200> doc;

  // Probar primero como tag_rfid
  doc["tag_rfid"] = uid;
  doc["lector_id"] = lectorId;
  String jsonString;
  serializeJson(doc, jsonString);
  Serial.println("Enviando: " + jsonString);

  int httpResponseCode = http.POST(jsonString);
  String response = http.getString();
  Serial.println("Código de respuesta: " + String(httpResponseCode));
  Serial.println("Respuesta: " + response);

  if (httpResponseCode == 201 || httpResponseCode == 200)
  {
    accessGranted = true;
    Serial.println("Acceso concedido por tag_rfid");
  }
  else
  {
    // Si falla, intentar como rfid normal
    doc.clear();
    doc["rfid"] = uid;
    doc["lector_id"] = lectorId;
    jsonString = "";
    serializeJson(doc, jsonString);
    Serial.println("Enviando: " + jsonString);

    httpResponseCode = http.POST(jsonString);
    response = http.getString();
    Serial.println("Código de respuesta: " + String(httpResponseCode));
    Serial.println("Respuesta: " + response);

    if (httpResponseCode == 201 || httpResponseCode == 200)
    {
      accessGranted = true;
      Serial.println("Acceso concedido por rfid");
    }
    else
    {
      Serial.println("Acceso denegado");
    }
  }

  http.end();

  // Mostrar mensaje solo una vez al final
  showAccessMessage(accessGranted, uid);

  rfid.PICC_HaltA();
  rfid.PCD_StopCrypto1();
}

void setup()
{
  Serial.begin(115200);

  // Inicializar LCD
  Wire.begin();
  lcd.init();
  lcd.backlight();
  updateLCDMessage("Iniciando...");

  // Configurar LEDs
  pinMode(RED_PIN, OUTPUT);
  pinMode(GREEN_PIN, OUTPUT);
  digitalWrite(RED_PIN, LOW); // Ambos en LOW para asegurar que estén apagados
  digitalWrite(GREEN_PIN, LOW);

  // Inicializar RFID
  SPI.begin();
  rfid.PCD_Init();
  Serial.println("RFID Iniciado");

  // Inicializar sensor de huella
  setupFingerprint();

  // Conectar WiFi
  int wifiAttempts = 0;
  while (!ensureWiFiConnection() && wifiAttempts < 3)
  {
    wifiAttempts++;
    delay(2000);
  }

  if (wifiAttempts >= 3)
  {
    updateLCDMessage("Error WiFi", "Reiniciando...");
    delay(3000);
    ESP.restart();
  }

  updateLCDMessage("Sistema Listo");
}

void loop()
{
  if (Serial.available())
  {
    char cmd = Serial.read();
    if (cmd == 'e')
    {
      currentState = ENROLLING;
      updateLCDMessage("Modo Enrolado", "ID: " + String(enrollId));
      delay(1000);
      getFingerprintEnroll();
      enrollId++;
      currentState = WAITING;
    }
    else if (cmd == 'm')
    {
      modoLectura = !modoLectura;
      if (modoLectura)
      {
        Serial.println("Modo lectura RFID activado");
        updateLCDMessage("Modo Lectura RFID");
      }
      else
      {
        Serial.println("Modo lectura RFID desactivado");
        updateLCDMessage("Modo Normal");
      }
    }
  }

  checkRFID();

  switch (currentState)
  {
  case WAITING:
    getFingerprintID();
    if (finger.getImage() == FINGERPRINT_NOFINGER)
    {
      if (!modoLectura)
      {
        updateLCDMessage("Esperando", "huella/tarjeta");
      }
    }
    break;

  case ERROR:
    if (ensureWiFiConnection())
    {
      currentState = WAITING;
    }
    else
    {
      updateLCDMessage("Error Sistema", "Reiniciando...");
      delay(3000);
      ESP.restart();
    }
    break;

  default:
    currentState = WAITING;
    break;
  }

  delay(50);
}