import { Component, Inject } from '@angular/core';
import { Http } from '@angular/http';
import { X25519 } from '../../../plugins/js-x25519-master/lib/x25519'
import { JSHexi } from '../../../plugins/js-x25519-master/lib//jshexi'

@Component({
  selector: 'sharedsecret',
  templateUrl: './sharedsecret.component.html'
})
export class SharedSecretComponent {
    public forecasts: WeatherForecast[];
    sharedSecret = "";


    sharedSecretSender: string = '';
    sharedSecretReciver: string = '';
    secretsidentical = false;

    testSecrets: Array<string> = [];

    constructor() {
        let x25519 = new X25519();    
        let jsHexi = new JSHexi();
        
        // test
        let secret = jsHexi.fromBase16('77076d0a7318a57d3c16c17251b26645df4c2f87ebc0992ab177fba51db92c2a') as Uint8Array;
        let pub = x25519.getPublic(secret);
        let _sharedSecret = x25519.getSharedKey(secret, pub);    
        this.sharedSecret = jsHexi.toBase16(_sharedSecret);
        
        let secretSender = 'L4XthhmGNUE6MZyDkRUfgjERV3SmAxZGzAmpo1ynXUzcLizrQtCi'; // wif of the sender (shrinked to 44 commas)
        let secretReciver = 'L4WMZGbPUves4MPEPHaR1kGC5Roh7meupTQPjckssJY42SCzyvX6'; // wif of the sender (shrinked to 44 commas)

        let pubSender = x25519.getPublic(jsHexi.fromBase64(secretReciver));
        // let pubSender ='AVZDnsC6VT36Ju7w5o3f9bv9HHEZ8hP9Ke'; // wallet adress of reciver
        this.sharedSecretSender = this.getSharedSecret(secretSender, pubSender)    

        let pubReciver = x25519.getPublic(jsHexi.fromBase64(secretSender));
        //let pubReciver = 'Aen3HvJixg5EAnrkvZt43WTpReFBdB59yu'; // wallet adress of reciver
        this.sharedSecretReciver = this.getSharedSecret(secretReciver, pubReciver)    

        this.secretsidentical = this.sharedSecretSender === this.sharedSecretReciver;
    }

    private getSharedSecret(secret: string, pub: Uint8Array): string {
        let x25519 = new X25519();
        let jsHexi = new JSHexi();

        let uSecret = jsHexi.fromBase64(secret); // wif of the sender (shrinked to 44 commas)
        let uPub = pub; // wallet adress of reciver
        let uSharedSecret = x25519.getSharedKey(uSecret, uPub);
        let result = jsHexi.toBase16(uSharedSecret);

        this.testSecrets.push(result);

        return result;  
    }
}

interface WeatherForecast {
    dateFormatted: string;
    temperatureC: number;
    temperatureF: number;
    summary: string;
}
