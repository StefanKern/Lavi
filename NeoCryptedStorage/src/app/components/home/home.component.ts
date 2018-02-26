import { Component, OnInit } from '@angular/core';
import { FileService } from '../../services/file.service';
import { AccountService } from '../../services/account.service';
import { Observable } from 'rxjs/Observable';
import { OfferService } from '../../services/offer.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html'
})
export class HomeComponent implements OnInit {
  files: Observable<server.encryptedFileUpload[]>;
  offers: Observable<server.offer[]>;
  isCollapsed = true;
  isUngrantedOffersCollapsed: true;

  constructor(private fileService: FileService, private offerService: OfferService, private accountService: AccountService) { }

  ngOnInit() {
    if (this.accountService.loggedIn) {
      this.files = this.fileService.getFilesByUploader(this.accountService.getAccount().publicKey);

      this.offers = this.offerService.getOpenOffers();
    }
  }
}
