import { Component, OnInit, OnDestroy, Input } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Observable } from 'rxjs/Observable';
import { OfferService } from '../../services/offer.service';
import * as aesjs from 'aes-js';
import * as sha256 from "fast-sha256";
import { AccountService } from '../../services/account.service';
import { OfferandfileService } from '../../services/offerandfile.service';
import { X25519 } from '../../plugins/js-x25519-master/lib/x25519'
import { JSHexi } from '../../plugins/js-x25519-master/lib//jshexi'


@Component({
  selector: 'app-grantoffer',
  templateUrl: './grantoffer.component.html'
})
export class GrantofferComponent implements OnInit {
  decryptedFileHash: string;
  private sub: any;
  grantoffers: Observable<any>;
  x25519 = new X25519();
  jsHexi = new JSHexi();


  constructor(private route: ActivatedRoute,
    private router: Router,
    private offerandfileService: OfferandfileService,
    private accountService: AccountService) { }

  ngOnInit() {
    this.grantoffers = this.offerandfileService.getGrantOffers();
  }

  grant(offer) {
    offer.decryptePW = this.decryptText(offer.encryptedPassword, this.accountService.getAccount().WIF);

    let buyerAddressHash = offer.buyerAddressHash;
    let aBuyerAddressHash = this.jsHexi.fromBase16(buyerAddressHash);
    let cretorWif = this.accountService.getAccount().WIF;
    let cretorWifshort = cretorWif.slice(0, 44);

    offer.sharedSecret = this.getSharedSecret(cretorWifshort, aBuyerAddressHash);

    let passwordSharedSecretEncrypted = this.encryptText(offer.decryptePW, offer.sharedSecret);

    offer.result = this.offerandfileService.grantOffer(offer.decryptedFileHash, passwordSharedSecretEncrypted)
  }


  private encryptText(file: string, password: string) {

    let bytePW = aesjs.utils.utf8.toBytes(password);
    let salt = aesjs.utils.utf8.toBytes('salt');
    let key = sha256.pbkdf2(bytePW, salt, 1, 128 / 8);

    // Convert text to bytes
    let fileBytes = aesjs.utils.utf8.toBytes(file);
    let decryptedFileHashPbkdf2 = sha256.pbkdf2(fileBytes, salt, 1, 30);

    // The counter is optional, and if omitted will begin at 1
    let aesCtr = new aesjs.ModeOfOperation.ctr(key, new aesjs.Counter(5));
    let encryptedBytes = aesCtr.encrypt(fileBytes);
    let encryptedBytesPbkdf2 = sha256.pbkdf2(encryptedBytes, salt, 1, 30);

    // To print or store the binary data, you may convert it to hex
    return aesjs.utils.hex.fromBytes(encryptedBytes) as string;
  }

  private decryptText(text: string, password: string): string {
    let bytePW = aesjs.utils.utf8.toBytes(password);
    let salt = aesjs.utils.utf8.toBytes('salt');
    var key = sha256.pbkdf2(bytePW, salt, 1, 128 / 8);

    // When ready to decrypt the hex string, convert it back to bytes
    var encryptedBytes = aesjs.utils.hex.toBytes(text);

    var aesCtr = new aesjs.ModeOfOperation.ctr(key, new aesjs.Counter(5));
    var decryptedBytes = aesCtr.decrypt(encryptedBytes);

    // Convert our bytes back into text
    return aesjs.utils.utf8.fromBytes(decryptedBytes);
  }



  private getSharedSecret(secret: string, pub: Uint8Array): string {

    let uSecret = this.jsHexi.fromBase64(secret); // wif of the sender (shrinked to 44 commas)
    let uPub = pub; // wallet adress of reciver
    let uSharedSecret = this.x25519.getSharedKey(uSecret, uPub);
    let result = this.jsHexi.toBase16(uSharedSecret);

    return result;
  }
}
