import { Injectable } from '@angular/core';
import * as aesjs from 'aes-js';
import * as sha256 from "fast-sha256";
import { HttpClient } from '@angular/common/http';
import { AccountService } from './account.service';
import { Observable } from 'rxjs/Observable';

@Injectable()
export class FileService {

  constructor(private accountService: AccountService, private http: HttpClient) { }

  getFiles(): Observable<server.encryptedFileUpload[]> {
    return this.http.get<server.encryptedFileUpload[]>("/api/fileapi");
  }

  getFilesByUploader(uploader: string): Observable<server.encryptedFileUpload[]> {
    return this.http.get<server.encryptedFileUpload[]>(`/api/fileapi/${uploader}`);
  }

  getFilesByDecryptedFileHashh(decryptedfilehash: string): Observable<server.encryptedFileUpload> {
    return this.http.get<server.encryptedFileUpload>(`/api/fileapi/bydecryptedfilehash/${decryptedfilehash}`);
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
    result.encryptedData =  aesjs.utils.hex.fromBytes(encryptedBytes) as string;

    return result;
  }

  addFile(name: string, type: string, data: string, password: string) {
    let wif = this.accountService.getAccount().WIF;

    // https://github.com/dchest/fast-sha256-js
    let bytePW = aesjs.utils.utf8.toBytes(password);
    let salt = aesjs.utils.utf8.toBytes('salt');
    let encryptedPassword = this.encryptText(password, wif);

    let encryptedData = this.encryptText(data, password);

    let upload: server.encryptedFileUpload = {
      title: name,
      mimeType: type,
      encryptedData: encryptedData.encryptedData,
      encryptedPassword: encryptedPassword.encryptedData,
      uploader: this.accountService.getAccount().publicKey,
      uploadTime: null,
      decryptedFileHash: encryptedData.decryptedFileHash,
      encryptedFileHash: encryptedData.encryptedFileHash
    }
    return this.http.put("/api/fileapi", upload);
  }
}
