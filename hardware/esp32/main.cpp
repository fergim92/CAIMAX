#include <SPI.h>                  // Incluye la biblioteca para la comunicación SPI
#include <MFRC522.h>              // Biblioteca para manejar el módulo RFID MFRC522
#include <WiFi.h>                 // Biblioteca para manejar la conexión WiFi en ESP32
#include <PubSubClient.h>         // Biblioteca para el cliente MQTT
#include <ArduinoJson.h>          // Biblioteca para manejar JSON en Arduino
#include <unordered_map>          // Incluye la biblioteca para usar estructuras de datos tipo mapa
#include <string>                 // Biblioteca para utilizar el tipo de dato string
#include <LiquidCrystal_I2C.h>    // Biblioteca para manejar displays LCD con interfaz I2C

#define GREEN_LED_PIN 4           // Define el pin para el LED verde
#define RED_LED_PIN 2             // Define el pin para el LED rojo
#define BUZZER_PIN 15             // Define el pin para el buzzer
#define SS_PIN 21                 // Pin de selección de esclavo para el lector RFID
#define RST_PIN 22                // Pin de reset para el lector RFID

MFRC522 mfrc522(SS_PIN, RST_PIN);   // Crea una instancia de la clase MFRC522
LiquidCrystal_I2C lcd(0x27, 16, 2); // Configura la dirección I2C y el tamaño del LCD (16 caracteres y 2 líneas)

const int lectorID = 1;             // Identificador único para este lector RFID

const char *ssid = "Naboo";         // SSID de la red WiFi
const char *password = "Ciudadela682"; // Contraseña de la red WiFi
const char *mqtt_broker = "192.168.10.104"; // Dirección IP del broker MQTT
const char *topic = "users/update";  // Tópico MQTT para actualizaciones de usuarios
const int mqtt_port = 1883;          // Puerto para la conexión MQTT

WiFiClient espClient;               // Crea un cliente WiFi
PubSubClient client(espClient);     // Crea un cliente MQTT usando el cliente WiFi

struct YourDataType                 // Define una estructura para los datos del usuario
{
    std::string name;
    std::string last_name;
    int dni;
    std::string fingerprint;
    std::string rfid;
    std::string tag_rfid;
    int role;
};

std::unordered_map<int, YourDataType> userDataMap; // Mapa para almacenar datos de usuario basados en un ID
bool dataReceived = false; // Bandera para controlar la recepción de datos

void setup_wifi()                    // Función para configurar la conexión WiFi
{
    Serial.begin(115200);            // Inicia la comunicación serial a 115200 baudios
    WiFi.begin(ssid, password);      // Inicia la conexión WiFi
    while (WiFi.status() != WL_CONNECTED)
    {
        delay(500);
        Serial.print(".");           // Imprime un punto en el serial cada 500 ms mientras se conecta
    }
    Serial.println("WiFi connected"); // Imprime en el serial que la conexión WiFi fue exitosa
}

void reconnect()                     // Función para reconectar o conectar al broker MQTT
{
    while (!client.connected())      // Mientras el cliente no esté conectado
    {
        Serial.println("Intentando conexión MQTT...");
        if (client.connect("ESP32Client")) // Intenta conectar con el ID de cliente "ESP32Client"
        {
            Serial.println("Conectado al broker MQTT");
            client.subscribe(topic); // Suscribe al tópico de actualizaciones de usuario
            Serial.println("Suscripto al tópico: " + String(topic));
        }
        else
        {
            Serial.print("Falló la conexión, rc=");
            Serial.println(client.state()); // Imprime el estado de la conexión
            Serial.println("Intentando de nuevo en 5 segundos");
            delay(5000);                   // Espera 5 segundos antes de reintentar
        }
    }
}

void printUserDataMap()               // Función para imprimir los datos del usuario almacenados en el mapa
{
    for (const auto &pair : userDataMap)
    {
        Serial.println("User ID: " + String(pair.first)); // Imprime el ID del usuario
        Serial.println("Name: " + String(pair.second.name.c_str())); // Imprime el nombre
        Serial.println("Last Name: " + String(pair.second.last_name.c_str())); // Imprime el apellido
        Serial.println("DNI: " + String(pair.second.dni)); // Imprime el DNI
        Serial.println("Fingerprint: " + String(pair.second.fingerprint.c_str())); // Imprime la huella dactilar
        Serial.println("RFID: " + String(pair.second.rfid.c_str())); // Imprime el RFID
        Serial.println("Tag RFID: " + String(pair.second.tag_rfid.c_str())); // Imprime el tag RFID
        Serial.println("Role: " + String(pair.second.role)); // Imprime el rol
        Serial.println("-------------------------------");
    }
}

void callback(char *topic, byte *payload, unsigned int length) // Callback para recibir mensajes MQTT
{
    String message;
    for (int i = 0; i < length; i++)
    {
        message += (char)payload[i];  // Construye el mensaje a partir del payload
    }

    DynamicJsonDocument doc(4096);
    DeserializationError error = deserializeJson(doc, message); // Deserializa el JSON
    if (error)
    {
        Serial.print("Failed to deserialize JSON: ");
        Serial.println(error.c_str()); // Imprime el error si la deserialización falla
        return;
    }

    int id = doc["id"]; // Obtiene el ID del documento JSON
    if (userDataMap.find(id) == userDataMap.end()) // Si el ID no está en el mapa
    {
        YourDataType data; // Crea un nuevo objeto de datos
        data.name = doc["name"].as<std::string>(); // Asigna el nombre desde el JSON
        data.last_name = doc["last_name"].as<std::string>(); // Asigna el apellido desde el JSON
        data.dni = doc["dni"]; // Asigna el DNI desde el JSON
        data.fingerprint = doc["fingerprint"].as<std::string>(); // Asigna la huella dactilar desde el JSON
        data.rfid = doc["rfid"].as<std::string>(); // Asigna el RFID desde el JSON
        data.tag_rfid = doc["tag_rfid"].as<std::string>(); // Asigna el tag RFID desde el JSON
        data.role = doc["role"]; // Asigna el rol desde el JSON
        userDataMap[id] = data; // Agrega los datos al mapa
    }
    dataReceived = true; // Establece la bandera a verdadero al recibir datos
}

void setup()                         // Función de configuración inicial del dispositivo
{
    setup_wifi();                    // Configura y conecta a WiFi
    pinMode(GREEN_LED_PIN, OUTPUT);  // Configura el pin del LED verde como salida
    pinMode(RED_LED_PIN, OUTPUT);    // Configura el pin del LED rojo como salida
    digitalWrite(GREEN_LED_PIN, LOW);// Inicia con el LED verde apagado
    digitalWrite(RED_LED_PIN, LOW);  // Inicia con el LED rojo apagado
    pinMode(BUZZER_PIN, OUTPUT);     // Configura el pin del buzzer como salida

    lcd.init();                      // Inicializa el LCD
    lcd.backlight();                 // Enciende la retroiluminación del LCD
    lcd.clear();                     // Limpia cualquier texto previo en el LCD
    lcd.print("Cargando datos...");  // Muestra mensaje de carga en el LCD

    delay(2000);                     // Espera 2 segundos
    client.setServer(mqtt_broker, mqtt_port); // Configura el servidor MQTT y el puerto
    client.setCallback(callback);    // Asigna la función de callback para mensajes MQTT

    SPI.begin();                     // Inicia la comunicación SPI
    mfrc522.PCD_Init();              // Inicia el lector RFID MFRC522
}

void loop()                          // Bucle principal de la aplicación
{
    if (!client.connected())         // Si el cliente MQTT no está conectado
    {
        reconnect();                 // Intenta reconectar
    }
    client.loop();                   // Procesa mensajes MQTT pendientes

    // Revisa si se presenta una nueva tarjeta RFID y si se puede leer
    if (mfrc522.PICC_IsNewCardPresent() && mfrc522.PICC_ReadCardSerial())
    {
        std::string rfidUid = "";    // Variable para almacenar el UID de la tarjeta RFID
        for (byte i = 0; i < mfrc522.uid.size; i++)
        {
            char buf[5];             // Buffer para convertir los bytes a hexadecimal
            sprintf(buf, "%02X", mfrc522.uid.uidByte[i]);
            rfidUid += buf;          // Agrega el valor convertido al UID
        }

        bool accessGranted = false;  // Bandera para controlar el acceso

        // Verifica si el UID leído está asociado con algún usuario autorizado
        for (const auto &pair : userDataMap)
        {
            if (pair.second.rfid == rfidUid)
            {
                accessGranted = true;
                break;
            }
        }

        if (accessGranted)          // Si el acceso es concedido
        {
            digitalWrite(GREEN_LED_PIN, HIGH);  // Enciende el LED verde
            delay(1000);             // Espera un segundo
            digitalWrite(GREEN_LED_PIN, LOW);   // Apaga el LED verde
            digitalWrite(BUZZER_PIN, HIGH);     // Enciende el buzzer
            delay(1000);                        // Espera un segundo
            digitalWrite(BUZZER_PIN, LOW);      // Apaga el buzzer
            delay(1000);                        // Espera un segundo
        }
        else                        // Si el acceso no es concedido
        {
            digitalWrite(RED_LED_PIN, HIGH);   // Enciende el LED rojo
            delay(1000);                       // Espera un segundo
            digitalWrite(RED_LED_PIN, LOW);    // Apaga el LED rojo
        }

        mfrc522.PICC_HaltA();       // Detiene la lectura de la tarjeta RFID
    }
}

