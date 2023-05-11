import RPi.GPIO as GPIO
from write_log import log_me
from time import sleep
import sys

def run_gpio(pin):
    try:
       
        GPIO.setmode(GPIO.BCM)
    
       
        GPIO.setup(pin, GPIO.OUT)
            
        
        GPIO.output(pin, GPIO.HIGH)

        f = open("water_time", "w")
        f.write(v_time)
        f.close()        

        GPIO.output(pin, GPIO.LOW)
        
        sleep(10)
    
        GPIO.cleanup()
        print("GPIO Cleaned up")
        
    except Exception as error:
        log_me(error)
        
def main(pin):
    run_gpio(int(pin))

if _name_ == "_main_":
    main(sys.argv[1])

