import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { AccountService } from './account.service';
import { HttpClient } from '@angular/common/http';
import * as aesjs from 'aes-js';
import * as sha256 from "fast-sha256";

@Injectable()
export class OfferandfileService {
  constructor(private accountService: AccountService, private http: HttpClient) { }

  get(): Observable<server.offer[]> {
    return this.http.get<server.offer[]>("/api/fileandoffer");
  }

  getbydecryptedfilehash(decryptedfilehash: string): Observable<server.offer[]> {
    return this.http.get<server.offer[]>(`/api/fileandoffer/bydecryptedfilehash/${decryptedfilehash}`);
  }

  private encryptText(file: string, password: string) {
    let result = {
      decryptedFileHash: undefined,
      encryptedData: undefined,
      encryptedFileHash: undefined
    }

    let bytePW = aesjs.utils.utf8.toBytes(password);
    let salt = aesjs.utils.utf8.toBytes('salt');
    let key = sha256.pbkdf2(bytePW, salt, 1, 128 / 8);

    // Convert text to bytes
    let fileBytes = aesjs.utils.utf8.toBytes(file);
    let decryptedFileHashPbkdf2 = sha256.pbkdf2(fileBytes, salt, 1, 30);
    result.decryptedFileHash = aesjs.utils.hex.fromBytes(decryptedFileHashPbkdf2) as string;

    // The counter is optional, and if omitted will begin at 1
    let aesCtr = new aesjs.ModeOfOperation.ctr(key, new aesjs.Counter(5));
    let encryptedBytes = aesCtr.encrypt(fileBytes);
    let encryptedBytesPbkdf2 = sha256.pbkdf2(encryptedBytes, salt, 1, 30);

    result.encryptedFileHash = aesjs.utils.hex.fromBytes(encryptedBytesPbkdf2) as string;

    // To print or store the binary data, you may convert it to hex
    result.encryptedData = aesjs.utils.hex.fromBytes(encryptedBytes) as string;

    return result;
  }

  openOffer(name: string, type: string, data: string, password: string) {
    let wif = this.accountService.getAccount().WIF;

    // https://github.com/dchest/fast-sha256-js
    let bytePW = aesjs.utils.utf8.toBytes(password);
    let salt = aesjs.utils.utf8.toBytes('salt');
    let encryptedPassword = this.encryptText(password, wif);

    let encryptedData = this.encryptText(data, password);

    let offer: server.offerandfile = {
      title: name,
      mimeType: type,
      encryptedData: encryptedData.encryptedData,
      encryptedPassword: encryptedPassword.encryptedData,
      uploader: this.accountService.getAccount().publicKey,
      uploadTime: null,
      decryptedFileHash: encryptedData.decryptedFileHash,
      encryptedFileHash: encryptedData.encryptedFileHash,
      creatorAddressHash: this.accountService.getSharedSecretAddress(),
      encryptedFileUploadId: 10,
      offererAddress: this.accountService.getAccount().address,
      open: true,
      granted: false
    }
    return this.http.put("/api/fileandoffer/open", offer);
  }

  public getTakeOffers() {
    return this.http.get("/api/fileandoffer/take");
  }


  public takeOffer(decryptedFileHash: string) {
    return this.http.post("/api/fileandoffer/take", {
      decryptedFileHash: decryptedFileHash,
      buyerAddressHash: this.accountService.getSharedSecretAddress()
    });
  }

  public getGrantOffers() {
    return this.http.get(`/api/fileandoffer/grant/${this.accountService.getSharedSecretAddress()}`);
  }


  grantOffer(decryptedFileHash: string, passwordSharedSecretEncrypted: string): any {
    let request =  this.http.post("/api/fileandoffer/grant", {
      decryptedFileHash: decryptedFileHash,
      passwordSharedSecretEncrypted: passwordSharedSecretEncrypted
    });

    request.toPromise();
    return request;
  }

  public getYourFiles(): Observable< server.offerandfile > {
    return this.http.get(`/api/yourfiles/${this.accountService.getSharedSecretAddress()}`) as Observable<server.offerandfile>;
  }
}
