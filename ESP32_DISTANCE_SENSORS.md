# ESP32 Three-Sensor Parking Monitor Setup

## Hardware Setup

### Required Components
- ESP32 Development Board
- 3x HC-SR04 Ultrasonic Distance Sensors
- Jumper wires
- Power supply (5V)

### Sensor Placement
\`\`\`
         [WALL]
    
Left    Center    Right
 |         |         |
 |    [VEHICLE]     |
 |         |         |
\`\`\`

### Wiring Diagram
**Left Sensor:**
- VCC → 5V
- GND → GND
- TRIG → GPIO 12
- ECHO → GPIO 14

**Center Sensor:**
- VCC → 5V
- GND → GND
- TRIG → GPIO 27
- ECHO → GPIO 26

**Right Sensor:**
- VCC → 5V
- GND → GND
- TRIG → GPIO 33
- ECHO → GPIO 32

## Arduino Code

\`\`\`cpp
#include <WiFi.h>
#include <HTTPClient.h>
#include <ArduinoJson.h>

// WiFi credentials
const char* ssid = "YOUR_WIFI_SSID";
const char* password = "YOUR_WIFI_PASSWORD";

// API configuration
const char* serverUrl = "https://v0-parkwise-smartparking.vercel.app/api/sensors/webhook";
const char* sensorId = "ESP32_PARKING_001_A1";  // Your unique sensor ID
const char* apiKey = "your-api-key-here";       // Get from /api/sensors/config
const char* spotNumber = "A1";

// Sensor pins
#define LEFT_TRIG 12
#define LEFT_ECHO 14
#define CENTER_TRIG 27
#define CENTER_ECHO 26
#define RIGHT_TRIG 33
#define RIGHT_ECHO 32

// Timing
unsigned long lastSend = 0;
const unsigned long sendInterval = 3000; // Send every 3 seconds

void setup() {
  Serial.begin(115200);
  
  // Initialize sensor pins
  pinMode(LEFT_TRIG, OUTPUT);
  pinMode(LEFT_ECHO, INPUT);
  pinMode(CENTER_TRIG, OUTPUT);
  pinMode(CENTER_ECHO, INPUT);
  pinMode(RIGHT_TRIG, OUTPUT);
  pinMode(RIGHT_ECHO, INPUT);
  
  // Connect to WiFi
  WiFi.begin(ssid, password);
  Serial.print("Connecting to WiFi");
  while (WiFi.status() != WL_CONNECTED) {
    delay(500);
    Serial.print(".");
  }
  Serial.println("\nConnected to WiFi");
  Serial.print("IP Address: ");
  Serial.println(WiFi.localIP());
}

float getDistance(int trigPin, int echoPin) {
  digitalWrite(trigPin, LOW);
  delayMicroseconds(2);
  digitalWrite(trigPin, HIGH);
  delayMicroseconds(10);
  digitalWrite(trigPin, LOW);
  
  long duration = pulseIn(echoPin, HIGH, 30000); // 30ms timeout
  
  if (duration == 0) {
    return -1; // Sensor error
  }
  
  float distance = (duration * 0.034) / 2; // Convert to cm
  return distance;
}

void sendSensorData(float leftDist, float centerDist, float rightDist) {
  if (WiFi.status() == WL_CONNECTED) {
    HTTPClient http;
    http.begin(serverUrl);
    http.addHeader("Content-Type", "application/json");
    
    // Create JSON payload
    StaticJsonDocument<512> doc;
    doc["sensor_id"] = sensorId;
    doc["api_key"] = apiKey;
    doc["spot_number"] = spotNumber;
    doc["center_distance"] = centerDist;
    doc["left_distance"] = leftDist;
    doc["right_distance"] = rightDist;
    doc["timestamp"] = millis();
    
    String jsonString;
    serializeJson(doc, jsonString);
    
    Serial.println("Sending: " + jsonString);
    
    int httpResponseCode = http.POST(jsonString);
    
    if (httpResponseCode > 0) {
      String response = http.getString();
      Serial.println("Response code: " + String(httpResponseCode));
      Serial.println("Response: " + response);
    } else {
      Serial.println("Error: " + String(httpResponseCode));
    }
    
    http.end();
  } else {
    Serial.println("WiFi not connected");
  }
}

void loop() {
  unsigned long currentTime = millis();
  
  if (currentTime - lastSend >= sendInterval) {
    // Read all three sensors
    float leftDist = getDistance(LEFT_TRIG, LEFT_ECHO);
    delay(50);
    float centerDist = getDistance(CENTER_TRIG, CENTER_ECHO);
    delay(50);
    float rightDist = getDistance(RIGHT_TRIG, RIGHT_ECHO);
    
    // Display readings
    Serial.println("\n=== Sensor Readings ===");
    Serial.printf("Left:   %.1f cm\n", leftDist);
    Serial.printf("Center: %.1f cm\n", centerDist);
    Serial.printf("Right:  %.1f cm\n", rightDist);
    
    // Send to server
    if (leftDist > 0 && centerDist > 0 && rightDist > 0) {
      sendSensorData(leftDist, centerDist, rightDist);
    } else {
      Serial.println("Sensor error - skipping send");
    }
    
    lastSend = currentTime;
  }
  
  delay(100);
}
\`\`\`

## Testing

1. Upload code to ESP32
2. Open Serial Monitor (115200 baud)
3. Verify WiFi connection
4. Check sensor readings
5. Verify data is sent to server
6. View real-time analysis at: https://v0-parkwise-smartparking.vercel.app/monitor/A1

## What the System Monitors

✅ **Parking Status**: Empty, Entering, Occupied, Exiting
✅ **Alignment Quality**: Centered, Left/Right Biased, Severely Misaligned
✅ **Quality Score**: 0-100 based on alignment, centering, and angle
✅ **Center Offset**: Distance from ideal center position
✅ **Angle Deviation**: Vehicle angle in degrees
✅ **Collision Detection**: Warns if obstacles too close
✅ **Misparking Alerts**: Automatic penalties for poor parking
✅ **Real-time Notifications**: Push alerts to renter and owner
