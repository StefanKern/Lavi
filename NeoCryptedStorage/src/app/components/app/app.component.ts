import { Component } from '@angular/core';
import { NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { AccountService } from '../../services/account.service';
import { NgForm } from '@angular/forms';
import { Router } from '@angular/router';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html'
})
export class AppComponent {
  title = 'app';
  navbarCollapsed = true;

  wif = "";
  rememberme = false;

  loggedIn = false;
  account = {} as Neon.wallet.Account;
  modalReference: NgbModalRef;

  constructor(private modalService: NgbModal, private router: Router, private accountService: AccountService) {
    this.loggedIn = this.accountService.loggedIn;
    if (this.loggedIn) {
      this.account = this.accountService.getAccount();
    }
  }

  open(content) {
    this.modalReference = this.modalService.open(content);
  }

  login(creationForm: NgForm, modal) {
    if (creationForm.valid) {
      try {
        this.account = this.accountService.login(this.wif, this.rememberme);
        this.loggedIn = this.accountService.loggedIn;
        this.modalReference.close();
        creationForm.reset();
        this.router.navigate(['home'])

      } catch (e) {
      }
    }
  }

  logout() {
    this.accountService.logout();
    this.loggedIn = this.accountService.loggedIn;
    this.account = {} as Neon.wallet.Account;
    this.router.navigate(['home'])
  }
}
