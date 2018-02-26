/// <reference path="../../../models/encryptedfileupload.cs.d.ts" />
import { Component, OnInit, ViewChild } from '@angular/core';
import { NgForm } from '@angular/forms';
import { NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { AccountService } from '../../services/account.service';
import { AddfileComponent } from '../modals/addfile/addfile.component';
import { FileService } from '../../services/file.service';
import { Observable } from 'rxjs/Observable';
import { OfferService } from '../../services/offer.service';
import { LaviSamartcontractService } from '../../services/lavi.samartcontract.service';
import * as aesjs from 'aes-js';
import * as sha256 from "fast-sha256";
import { OfferandfileService } from '../../services/offerandfile.service';

@Component({
  selector: 'app-openoffer',
  templateUrl: './openoffer.component.html'
})
export class OpenOfferComponent implements OnInit {
  @ViewChild('fileInput') fileInput;
  valid = true;
  uploading = false;
  uploadresult = null;
  password = "";
  smartcontractresultSuccess = false;
  smartcontractresult = "";

  constructor(private fileService: FileService,
    private offerService: OfferService,
    private accountService: AccountService,
    private laviSamartcontractService: LaviSamartcontractService,
    private offerandfileService: OfferandfileService) { }

  ngOnInit() {
  }

  openAddFileModal(content) {
  }

  onFileSelectionChange(file) {
  }

  createOffer(form: any, valid: boolean) {
    if (valid) {
      var reader = new FileReader();
      let files: File[] = this.fileInput.nativeElement.files;
      if (files.length == 0) {
        this.valid = false;
        return;
      }

      let file: File = files[0];
      reader.readAsDataURL(file);
      reader.onload = () => {
        let sfile = reader.result;

        if (sfile.length > 102400) {
          this.valid = true;
          return;
        }
        this.uploading = true;

        let fileBytes = aesjs.utils.utf8.toBytes(file);
        let salt = aesjs.utils.utf8.toBytes(Date.now);  // the key should be unique, therefor we take the datetime now.
                                                        // the encrypted und crypted hashinformation is stored anyway
        let ukey = sha256.pbkdf2(fileBytes, salt, 1, 30);
        let key = aesjs.utils.hex.fromBytes(ukey);

        this.laviSamartcontractService.openOffer(key).then((result) => {
          this.smartcontractresult = result;

          this.uploadresult = this.offerandfileService.openOffer(file.name, file.type, sfile, this.password);
        }, (error) => {
          this.smartcontractresult = error;

          this.uploadresult = this.offerandfileService.openOffer(file.name, file.type, sfile, this.password);
        })
      }
    }
  }
}
