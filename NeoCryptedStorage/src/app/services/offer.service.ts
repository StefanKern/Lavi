import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { AccountService } from './account.service';
import { Observable } from 'rxjs/Observable';

@Injectable()
export class OfferService {

  constructor(private accountService: AccountService, private http: HttpClient) { }

  getOffers(): Observable<server.offer[]> {
    return this.http.get<server.offer[]>("/api/offer");
  }
  getOpenOffers(): Observable<server.offer[]> {
    return this.http.get<server.offer[]>("/api/offer/open");
  }
  getTakenOffers(): Observable<server.offer[]> {
    return this.http.get<server.offer[]>("/api/offer/taken");
  }
  getGrantedOffers(): Observable<server.offer[]> {
    return this.http.get<server.offer[]>("/api/offer/granted");
  }

  getFilesByDecryptedFileHash(decryptedfilehash: string): Observable<server.offer[]> {
    return this.http.get<server.offer[]>(`/api/offer/bydecryptedfilehash/{decryptedfilehash}`);
  }

  addBuyerToOffer(buyer: string) {
    return this.http.put(`/api/offer`, {
      buyer: buyer
    });
  }


  takeOffer(decryptedfilehash: string): Observable<any> {
    let data = {
      decryptedfilehash: decryptedfilehash,
      buyer: this.accountService.getSharedSecretAddress()
    };
    return this.http.post("/api/offer", data);
  }

  grantOffer(offer: server.offer): any {
  }
}
