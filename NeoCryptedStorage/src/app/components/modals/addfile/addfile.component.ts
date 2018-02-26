/// <reference path="../../../../models/encryptedfileupload.cs.d.ts" />
import { Component, OnInit, ViewChild } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { Observable } from 'rxjs/Observable';
import { FileService } from '../../../services/file.service';

@Component({
  selector: 'app-addfile',
  templateUrl: './addfile.component.html'
})
export class AddfileComponent implements OnInit {
  @ViewChild('fileInput') fileInput;

  constructor(public activeModal: NgbActiveModal, private fileService: FileService) { }
  password: string = "";
  errorFile = false;
  errorPassword = false;
  uploading = false;
  uploadresult: any;

  ngOnInit() {
  }

  save(form: any, valid: boolean) {
    if (valid) {
      var reader = new FileReader();
      let files: File[] = this.fileInput.nativeElement.files;
      if (files.length == 0) {
        this.errorFile = true;
        return;
      }

      let file: File = files[0];
      reader.readAsDataURL(file);
      reader.onload = () => {
        let sfile = reader.result;

        if (sfile.length > 102400) {
          this.errorFile = true;
          return;
        }
        this.uploading = true;

        this.uploadresult = this.fileService.addFile(file.name, file.type, sfile, this.password);
      }
    } else {
      this.errorPassword = true;
    }
  }
}
