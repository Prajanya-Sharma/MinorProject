# ESP32 Parking Sensor Setup Guide

This guide explains how to configure your ESP32 microcontroller to send parking sensor data to the SmartParking platform.

## Hardware Requirements

- ESP32 Development Board
- Ultrasonic Sensor (HC-SR04) or IR Sensor
- Power Supply (5V)
- WiFi Connection

## API Endpoint

Your ESP32 will send data to: `https://your-domain.com/api/sensors/webhook`

## Getting Sensor Credentials

1. Login to your SmartParking account
2. Go to "My Lots" page
3. Click "Manage Sensors" on your parking lot
4. Click "Add New Sensor" and enter the spot number
5. Copy the `sensor_id` and `api_key` provided

## ESP32 Code Example (Arduino IDE)

\`\`\`cpp
#include <WiFi.h>
#include <HTTPClient.h>
#include <ArduinoJson.h>

// WiFi credentials
const char* ssid = "YOUR_WIFI_SSID";
const char* password = "YOUR_WIFI_PASSWORD";

// API configuration
const char* apiEndpoint = "https://your-domain.com/api/sensors/webhook";
const char* sensorId = "YOUR_SENSOR_ID";
const char* apiKey = "YOUR_API_KEY";
const char* spotNumber = "A1";

// Ultrasonic sensor pins
const int trigPin = 5;
const int echoPin = 18;

// Distance thresholds (in cm)
const int OCCUPIED_THRESHOLD = 50;
const int MISPARKED_THRESHOLD = 30;

bool isOccupied = false;
unsigned long lastUpdate = 0;
const unsigned long UPDATE_INTERVAL = 5000; // 5 seconds

void setup() {
  Serial.begin(115200);
  
  pinMode(trigPin, OUTPUT);
  pinMode(echoPin, INPUT);
  
  // Connect to WiFi
  WiFi.begin(ssid, password);
  Serial.print("Connecting to WiFi");
  while (WiFi.status() != WL_CONNECTED) {
    delay(500);
    Serial.print(".");
  }
  Serial.println("\nConnected to WiFi");
}

void loop() {
  if (millis() - lastUpdate > UPDATE_INTERVAL) {
    lastUpdate = millis();
    
    int distance = getDistance();
    Serial.print("Distance: ");
    Serial.print(distance);
    Serial.println(" cm");
    
    if (distance < MISPARKED_THRESHOLD && isOccupied) {
      // Vehicle is too close - misparked
      sendEvent("misparked", distance);
    } else if (distance < OCCUPIED_THRESHOLD && !isOccupied) {
      // Vehicle entered
      isOccupied = true;
      sendEvent("entry", distance);
    } else if (distance > OCCUPIED_THRESHOLD && isOccupied) {
      // Vehicle exited
      isOccupied = false;
      sendEvent("exit", distance);
    }
  }
}

int getDistance() {
  // Send ultrasonic pulse
  digitalWrite(trigPin, LOW);
  delayMicroseconds(2);
  digitalWrite(trigPin, HIGH);
  delayMicroseconds(10);
  digitalWrite(trigPin, LOW);
  
  // Read echo
  long duration = pulseIn(echoPin, HIGH);
  int distance = duration * 0.034 / 2;
  
  return distance;
}

void sendEvent(const char* eventType, int distance) {
  if (WiFi.status() == WL_CONNECTED) {
    HTTPClient http;
    http.begin(apiEndpoint);
    http.addHeader("Content-Type", "application/json");
    
    // Create JSON payload
    StaticJsonDocument<256> doc;
    doc["sensor_id"] = sensorId;
    doc["api_key"] = apiKey;
    doc["event_type"] = eventType;
    doc["spot_number"] = spotNumber;
    
    JsonObject sensorData = doc.createNestedObject("sensor_data");
    sensorData["distance_cm"] = distance;
    sensorData["timestamp"] = millis();
    
    String jsonString;
    serializeJson(doc, jsonString);
    
    Serial.print("Sending: ");
    Serial.println(jsonString);
    
    int httpCode = http.POST(jsonString);
    
    if (httpCode > 0) {
      String response = http.getString();
      Serial.print("Response: ");
      Serial.println(response);
    } else {
      Serial.print("Error: ");
      Serial.println(http.errorToString(httpCode));
    }
    
    http.end();
  }
}
\`\`\`

## Event Types

Your ESP32 should send these event types:

- **`entry`**: When a vehicle enters the parking spot (distance < threshold)
- **`exit`**: When a vehicle leaves the parking spot (distance > threshold)
- **`misparked`**: When a vehicle is detected in incorrect position (too close to sensor)
- **`sensor_update`**: Periodic status updates (optional)

## JSON Payload Format

\`\`\`json
{
  "sensor_id": "ESP32_xxxxx_A1",
  "api_key": "your-64-char-hex-api-key",
  "event_type": "entry",
  "spot_number": "A1",
  "sensor_data": {
    "distance_cm": 45,
    "timestamp": 123456789
  }
}
\`\`\`

## Testing

1. Use Serial Monitor to verify sensor readings
2. Test API calls with a REST client first (Postman, curl)
3. Verify events appear in the parking lot dashboard

## Troubleshooting

- **401 Error**: Check sensor_id and api_key are correct
- **Connection Failed**: Verify WiFi credentials and API endpoint URL
- **No Response**: Check if ESP32 has internet access
- **False Positives**: Adjust distance thresholds for your environment

## Security Notes

- Store API keys securely (consider using SPIFFS or EEPROM)
- Use HTTPS for all API communications
- Rotate API keys periodically
- Monitor sensor heartbeat in dashboard
