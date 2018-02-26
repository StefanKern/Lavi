import { Component, OnInit, ViewChild } from '@angular/core';
import * as aesjs from 'aes-js';
import * as sha256 from "fast-sha256";

@Component({
  selector: 'app-aestest',
  templateUrl: './aestest.component.html'
})
export class AestestComponent implements OnInit {

  constructor() { }

  text = `Lorem ipsum dolor sit amet, consetetur sadipscing elitr, sed diam nonumy eirmod tempor invidunt ut labore et dolore magna aliquyam erat, sed diam voluptua. At vero eos et accusam et justo duo dolores et ea rebum. Stet clita kasd gubergren, no sea takimata sanctus est Lorem ipsum dolor sit amet. Lorem ipsum dolor sit amet, consetetur sadipscing elitr, sed diam nonumy eirmod tempor invidunt ut labore et dolore magna aliquyam erat, sed diam voluptua. At vero eos et accusam et justo duo dolores et ea rebum. Stet clita kasd gubergren, no sea takimata sanctus est Lorem ipsum dolor sit amet.`;
  password = "P4ssw0rd";
  passwordPbkdf2: Uint8Array = new Uint8Array(16);
  encryptedText = "";
  reDecryptedText = "";

  ngOnInit() {
  }

  encrypt() {
    // https://github.com/dchest/fast-sha256-js
    let bytePW = aesjs.utils.utf8.toBytes(this.password);
    let salt = aesjs.utils.utf8.toBytes('salt');
    var key = this.passwordPbkdf2 = sha256.pbkdf2(bytePW, salt, 1, 128 / 8);


    // Convert text to bytes
    var textBytes = aesjs.utils.utf8.toBytes(this.text);

    // The counter is optional, and if omitted will begin at 1
    var aesCtr = new aesjs.ModeOfOperation.ctr(key, new aesjs.Counter(5));
    var encryptedBytes = aesCtr.encrypt(textBytes);

    // To print or store the binary data, you may convert it to hex
    var encryptedHex = aesjs.utils.hex.fromBytes(encryptedBytes);
    this.encryptedText = encryptedHex;

    // When ready to decrypt the hex string, convert it back to bytes
    var encryptedBytes = aesjs.utils.hex.toBytes(encryptedHex);

    // The counter mode of operation maintains internal state, so to
    // decrypt a new instance must be instantiated.
    var aesCtr = new aesjs.ModeOfOperation.ctr(key, new aesjs.Counter(5));
    var decryptedBytes = aesCtr.decrypt(encryptedBytes);

    // Convert our bytes back into text
    var decryptedText = aesjs.utils.utf8.fromBytes(decryptedBytes);
    this.reDecryptedText = decryptedText;
  }



  passwordImg = "P4ssw0rd";
  passwordPbkdf2Img: Uint8Array = new Uint8Array(16);
  encryptedImage = "";
  reDecryptedImage = "";
  @ViewChild('fileInput') fileInput;

  private getBase64(file) {
    var reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = function () {
      console.log(reader.result);
    };
    reader.onerror = function (error) {
      console.log('Error: ', error);
    };
  }


  encryptImage() {
    let fileBrowser = this.fileInput.nativeElement;
    if (fileBrowser.files && fileBrowser.files[0]) {
      const formData = new FormData();

      var reader = new FileReader();
      reader.readAsDataURL(fileBrowser.files[0]);
      reader.onload = () => {
        let file = reader.result;        
        // https://github.com/dchest/fast-sha256-js
        let bytePW = aesjs.utils.utf8.toBytes(this.passwordImg);
        let salt = aesjs.utils.utf8.toBytes('salt');
        var key = this.passwordPbkdf2Img = sha256.pbkdf2(bytePW, salt, 1, 128 / 8);


        // Convert text to bytes
        var textBytes = aesjs.utils.utf8.toBytes(file);

        // The counter is optional, and if omitted will begin at 1
        var aesCtr = new aesjs.ModeOfOperation.ctr(key, new aesjs.Counter(5));
        var encryptedBytes = aesCtr.encrypt(textBytes);

        // To print or store the binary data, you may convert it to hex
        var encryptedHex = aesjs.utils.hex.fromBytes(encryptedBytes);
        this.encryptedImage = encryptedHex;

        // When ready to decrypt the hex string, convert it back to bytes
        var encryptedBytes = aesjs.utils.hex.toBytes(encryptedHex);

        // The counter mode of operation maintains internal state, so to
        // decrypt a new instance must be instantiated.
        var aesCtr = new aesjs.ModeOfOperation.ctr(key, new aesjs.Counter(5));
        var decryptedBytes = aesCtr.decrypt(encryptedBytes);

        // Convert our bytes back into text
        var decryptedText = aesjs.utils.utf8.fromBytes(decryptedBytes);
        this.reDecryptedImage = decryptedText;
        console.log(reader.result);
      };
      reader.onerror = (error) => {
        console.log('Error: ', error);
      }
    }
  }
}
