import { Component, OnInit, Input } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { FileService } from '../../../services/file.service';
import { AccountService } from '../../../services/account.service';

@Component({
  selector: 'app-offereditem',
  templateUrl: './offereditem.component.html'
})
export class OffereditemComponent implements OnInit {
  @Input() offer: server.offer;
  file: server.encryptedFileUpload = {} as server.encryptedFileUpload;
  isOwn = true;

  constructor(private fileService: FileService, private accountService: AccountService) { }

  ngOnInit() {
    this.fileService.getFilesByDecryptedFileHashh(this.offer.decryptedFileHash)
      .toPromise()
      .then((response: server.encryptedFileUpload) => {
        this.file = response;
        this.isOwn = this.file.uploader == this.accountService.getAccount().publicKey;
      }, (error) => { })
  }

  buy() {
    debugger;
  }
}
