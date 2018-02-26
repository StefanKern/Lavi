import { Component } from '@angular/core';
import * as Neon from '@cityofzion/neon-js';

@Component({
  selector: 'balanceandsending',
  templateUrl: './balanceandsending.component.html'
})
export class BalanceAndSendingComponent {
  net: string = 'TestNet';
  address: string = 'Aen3HvJixg5EAnrkvZt43WTpReFBdB59yu';
  privatekey: string = "6PYX3ESQVNPATnmfmBdvZcQD2CnUcHGB8RQEyQhFNZuFXTVhHAyeQfwdwX";
  password: string = 'WalletWithMoney';
  balance?: Neon.wallet.Balance = undefined;
  balnce = {
    Neo: undefined,
    Gas: undefined
  }

  balanceLocalNet?: Neon.wallet.Balance = undefined;
  balanceLocalNetGas?: Neon.u.Fixed8 = undefined;

  sendNeo?: number = undefined;
  sendGas?: number = undefined;
  targetaddress = 'AVZDnsC6VT36Ju7w5o3f9bv9HHEZ8hP9Ke';
  sendresult: any = undefined;
  sendresultDetails: any = undefined;

  showGetBalanceDetails = true;
  showSendContractDetails = true;

  public constructor() {
    this.getbalance();
  }

  getbalance() {
    this.balance = undefined;
    this.balnce.Gas = undefined;
    this.balnce.Neo = undefined;

    Neon.api.neonDB.getBalance(this.net, this.address).then((_balance: Neon.wallet.Balance) => {
      this.balance = _balance;
      this.balnce.Gas = _balance.assets.GAS.balance;
      this.balnce.Neo = _balance.assets.NEO.balance;
    });
  }

  // source: http://cityofzion.io/neon-js/transactions/index.html#transaction
  // source 2: http://cityofzion.io/neon-js/tutorial/basic-sendasset.html?highlight=sendasset
  public sendAssets() {
    this.sendresult = "";
    this.sendresultDetails = undefined;
    let wallet = new Neon.wallet.Account(this.privatekey);
    wallet.decrypt(this.password);
    let privateKey = wallet.privateKey;

    let assets: Neon.api.AssetAmounts = {};
    if (this.sendNeo)
      assets.NEO = this.sendNeo;
    if (this.sendGas)
      assets.GAS = this.sendGas;

    // We want to send 1 NEO and 1 GAS to ALq7AWrhAueN6mJNqk6FHJjnsEoPRytLdW
    const intent = Neon.api.makeIntent(assets, this.targetaddress)
    console.log(intent) // This is an array of 2 Intent objects, one for each asset

    const config = {
      net: this.net,
      address: wallet.address,
      privateKey: wallet.WIF,
      intents: intent
    }

    let sendAssetPromise: any = Neon.api.sendAsset(config);

    sendAssetPromise
      .then((_success: any) => {
        this.sendresult = "Success";
        this.sendresultDetails = _success;
      })
      .catch((_error: any) => {
        this.sendresult = "Error";
        this.sendresultDetails = _error;
      });
  }
}
