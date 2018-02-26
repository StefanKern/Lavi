import { Injectable } from '@angular/core';
import * as Neon from '@cityofzion/neon-js';
import { X25519 } from '../plugins/js-x25519-master/lib/x25519';
import { JSHexi } from '../plugins/js-x25519-master/lib/jshexi';

@Injectable()
export class AccountService {
  private account: Neon.wallet.Account;
  private _loggedIn = false;
  x25519 = new X25519();
  jsHexi = new JSHexi();

  public get loggedIn(): boolean {
    return this._loggedIn;
  }

  constructor() {
    let sAccount = localStorage.getItem('account');
    if (sAccount) {
      this.account = new Neon.wallet.Account(sAccount);

      this._loggedIn = true;
    }
  }

  login(wif: string, remeberme: boolean): Neon.wallet.Account {
    this.account = new Neon.wallet.Account(wif);
    if (remeberme) {
      localStorage.setItem('account', this.account.WIF);
    }
    this._loggedIn = true;
    return this.account;
  }

  logout(): void {
    this.account = null;
    localStorage.removeItem('account');
    this._loggedIn = false;
  }

  getAccount(): Neon.wallet.Account {
    return this.account;
  }

  getSharedSecretAddress(): string {
    let secretSender = this.account.WIF.slice(0, 44);
    let pubSender = this.x25519.getPublic(this.jsHexi.fromBase64(secretSender));
    return this.jsHexi.toBase16(pubSender);
  }
}
