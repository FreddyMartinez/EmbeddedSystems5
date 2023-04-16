#include <ESP8266WiFi.h>
#include <ArduinoJson.h>                      
#include <ESP8266HTTPClient.h>
 
const char* ssid = "Freddy"; 
const char* password = "1234"; 

const char* serverIP = "http://192.168.43.73";

const int redPin =  12;
const int greenPin =  13;          
 
void setup()
{
  Serial.begin(9600);
  pinMode(redPin, OUTPUT);
  pinMode(greenPin, OUTPUT);

  Serial.printf("Connecting to %s ", ssid);     
  WiFi.begin(ssid, password);
  while (WiFi.status() != WL_CONNECTED)
  {
    delay(500);
    Serial.print(".");
  }
  WiFi.setAutoReconnect(true);
  Serial.println(" connected");
}
 
void loop()
{
  String ledState = sendHttpReq("/led");
  StaticJsonDocument<100> state;
  DeserializationError error = deserializeJson(state, ledState);
  
  bool redOn = state["red"];
  bool greenOn = state["green"];
  digitalWrite(redPin, redOn);
  digitalWrite(greenPin, greenOn);
  
  delay(500);
}

String sendHttpReq(String endpoint) {
  WiFiClient client;
  HTTPClient http;
  String payload;

  if (http.begin(client, serverIP + endpoint)) {
    int httpCode = http.GET();

    if (httpCode > 0) {
      if (httpCode == HTTP_CODE_OK || httpCode == HTTP_CODE_MOVED_PERMANENTLY) {
        payload = http.getString();
      }
    } else {
      Serial.printf("[HTTP] GET... failed, error: %s\n", http.errorToString(httpCode).c_str());
    }
    http.end();
  } else {
    Serial.println("[HTTP] Unable to connect");
  }

  return payload;
}
