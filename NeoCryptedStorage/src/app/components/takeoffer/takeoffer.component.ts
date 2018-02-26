import { Component} from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { OfferandfileService } from '../../services/offerandfile.service';
import { AccountService } from '../../services/account.service';

@Component({
  selector: 'app-takeoffer',
  templateUrl: './takeoffer.component.html'
})
export class TakeOfferComponent{
  constructor(private offerandfileService: OfferandfileService, private accountService: AccountService) { }
  takeoffers: Observable<any>;
  sharedSecretAddress = ""


  ngOnInit() {
    this.takeoffers = this.offerandfileService.getTakeOffers();
    this.sharedSecretAddress = this.accountService.getSharedSecretAddress();
  }

  take(offer) {
    offer.requested = true;
    this.offerandfileService.takeOffer(offer.decryptedFileHash)
      .toPromise()
      .then(() => { });
  }
}
