import { Component, OnInit, ViewChild } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-azureblobstorageconnetion',
  templateUrl: './azureblobstorageconnetion.component.html'
})
export class AzureblobstorageconnetionComponent implements OnInit {
  @ViewChild('fileInput') fileInput;

  constructor(private http: HttpClient) { }

  ngOnInit() {
  }

  filelist: Observable<Object> = undefined;
  uploadresult: Observable<Object> = undefined;
  getlist() {
    this.filelist = this.http.get("/api/AzureBlobStorageAPI");
  }

  public files : any;

  upload() {

    let fileBrowser = this.fileInput.nativeElement;
    if (fileBrowser.files && fileBrowser.files[0]) {
      const formData = new FormData();
      formData.append("files", fileBrowser.files[0]);

      this.uploadresult = this.http.put("/api/AzureBlobStorageAPI", formData);
    }
  }
}
