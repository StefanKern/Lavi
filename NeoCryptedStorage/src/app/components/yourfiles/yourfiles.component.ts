import { Component, OnInit } from '@angular/core';
import { OfferandfileService } from '../../services/offerandfile.service';
import { Observable } from 'rxjs/Observable';

@Component({
  selector: 'app-yourfiles',
  templateUrl: './yourfiles.component.html'
})
export class YourfilesComponent implements OnInit {
  yourfiles: Observable<server.offerandfile>;


  constructor(private offerandfileService: OfferandfileService) { }

  ngOnInit() {
    this.yourfiles = this.offerandfileService.getYourFiles();
  }
}
