#include <ESP8266WiFi.h>
#include <ArduinoJson.h>                      
#include <ESP8266HTTPClient.h>
 
const char* ssid = "Freddy"; 
const char* password = "1234nancho"; 

const char* serverIP = "http://192.168.43.73";

const int redButtonPin = 2;
const int greenButtonPin = 4;
const int redPin =  12;
const int greenPin =  13;          

volatile long lastPush = 0;
volatile bool toggleRedPending;
volatile bool toggleGreenPending;

enum BoardState {LOOK_FOR_UPDATE, SEND_UPDATE_PENDING};
volatile BoardState currentState = LOOK_FOR_UPDATE;
enum Actions {TOGGLE_RED, TOGGLE_GREEN};

// Red Button Interruption
void IRAM_ATTR redButtonPushed() {
  if (millis() - lastPush < 300) { // debounce 300ms
    return;
  }
  lastPush = millis();
  
  changeState(SEND_UPDATE_PENDING, TOGGLE_RED);
}

// Green Button Interruption
void IRAM_ATTR greenButtonPushed () {
  if (millis() - lastPush < 300) { // debounce 300ms
    return;
  }
  lastPush = millis();

  changeState(SEND_UPDATE_PENDING, TOGGLE_GREEN);
}

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

  pinMode(redButtonPin, INPUT_PULLUP);
  attachInterrupt(digitalPinToInterrupt(redButtonPin), redButtonPushed, FALLING);
  pinMode(greenButtonPin, INPUT_PULLUP);
  attachInterrupt(digitalPinToInterrupt(greenButtonPin), greenButtonPushed, FALLING);
}

void loop()
{
  evaluateStateAndSendRequest();
  
  delay(500);
}

void evaluateStateAndSendRequest(){
  switch (currentState) {
    case LOOK_FOR_UPDATE:
      requestDataAndUpdateLeds("/led");
      break;

    case SEND_UPDATE_PENDING:
      if(toggleRedPending) {
        requestDataAndUpdateLeds("/toggle-led/red");
        toggleRedPending = false;
      }
      if(toggleGreenPending) {
        requestDataAndUpdateLeds("/toggle-led/green");
        toggleGreenPending = false;
      }
      currentState = LOOK_FOR_UPDATE;
      break;
  }
}

void requestDataAndUpdateLeds(String endpoint) {
  String ledState = sendHttpReq(endpoint);
  StaticJsonDocument<100> state;
  DeserializationError error = deserializeJson(state, ledState);
  
  bool redOn = state["red"];
  bool greenOn = state["green"];
  digitalWrite(redPin, redOn);
  digitalWrite(greenPin, greenOn);
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

void changeState(BoardState newState, Actions action) {
  currentState = newState;
  switch (action) {
    case TOGGLE_RED:
      toggleRedPending = true;
      break;

    case TOGGLE_GREEN:
      toggleGreenPending = true;
      break;
  }
}
