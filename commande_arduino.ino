#include <SoftwareSerial.h>
SoftwareSerial mavoieserie(5, 6); // Rx = pin 6 et Tx = pin 5

#define LEDPIN 2

char character;
int lightVal = 0;
int temp = 0 ;
char command = '\0';
bool blink = false;
bool light_on = false;
unsigned long last_blink = 0;
unsigned long last_temp_export =0;
unsigned long timer = 0;
int timer_lenght;
int timer_utilisation = 0; // 0 is unused, 1 is for light on and 2 for light off 


void setup() {
  pinMode(2, OUTPUT);
  pinMode(A0,INPUT);
  Serial.begin(9600);
  mavoieserie.begin(9600);
  switchOffLight();
}
void loop() {

  if (blink && (millis() -last_blink) > 500){
    light_on = digitalRead(LEDPIN);
    last_blink = millis();
    digitalWrite(LEDPIN, !light_on);
    mavoieserie.print("05"+String(!light_on)+"!");
  }

  if ((timer_utilisation != 0) && (millis() - timer > timer_lenght*1000)){
    if (timer_utilisation == 1){
      switchOnLight();
    }else if (timer_utilisation == 2){
      switchOffLight();
    }
    timer_utilisation = 0;
  }

  if(millis() -last_temp_export>30000){
      temp = getTemperature(A0);
      last_temp_export = millis();
      char tempStr[10]; 
      dtostrf(temp, 4, 2, tempStr); 
      mavoieserie.print(String("04") + String(tempStr) + "!");
  }

  if (mavoieserie.available()) {
    raw_command = mavoieserie.read();
    command = raw_command[0]
    Serial.print("Commande recue : ");
    Serial.println(command);
    switch (command-'0') { 
      case 1: 
        blink = false;
        Serial.print("Light On");
        switchOnLight(); 
        lightVal = 1;
        mavoieserie.print("01"+String(lightVal)+"!");
        break;
      case 2: 
        blink = false;
        Serial.print("Light Off");
        switchOffLight(); 
        lightVal = 0;
        mavoieserie.print("02"+String(lightVal)+"!");
        break; 
      case 3: 
        blink = false;
        Serial.print("Light Switched");
        switchLight(lightVal); 
        lightVal = !lightVal;
        mavoieserie.print("03"+String(lightVal)+"!");
        break; 
      case 4: 
        blink = false;
        temp = getTemperature(A0);
        char tempStr[10]; 
        dtostrf(temp, 4, 2, tempStr); 
        mavoieserie.print(String("04") + String(tempStr) + "!");
        break; 

      case 5:
        blink = true;
        break;
      case 6:
        timer_lenght = raw_command[1];
        timer = millis();
        timer_utilisation = 1;
        mavoieserie.print("06"+String(lightVal)+"!");
        break;
      case 7:
        timer_lenght = raw_command[1];
        timer = millis();
        timer_utilisation = 2;
        mavoieserie.print("07"+String(lightVal)+"!");
        break;

      default: 
        Serial.print("Message non reconnu");
        mavoieserie.print(String("1") + String(command) + String("!"));
        break; 
    } 
  }
  delay(500);
}


int getTemperature(uint8_t pin){
  float val = analogRead(pin);
  float volts = val *5.0/1023.0;
  return 100*volts-50;
}

void switchOnLight(){
  digitalWrite(2, HIGH);
}

void switchOffLight(){
  digitalWrite(2, LOW);
}

void switchLight(int val){
  digitalWrite(2, !val);
}
