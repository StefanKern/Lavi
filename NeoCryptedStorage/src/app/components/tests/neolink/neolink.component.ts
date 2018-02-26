import { Component } from '@angular/core';

@Component({
  selector: 'neolink',
  templateUrl: './neolink.component.html'
})
export class NeoLinkComponent {
  invocationObject: neo.invocationObject = {
  } as neo.invocationObject;
  statusRequestSent = false;
  neoLinkStatus = "Neolink Status: Not Installed";
  neonLinkAdress?: string;

  onSubmit() {
    window.postMessage({ type: "FROM_PAGE", text: this.invocationObject }, "*");
  }


  constructor() {
    if (typeof window !== 'undefined') {
      window.addEventListener("message", (msg) => {
        if (msg.data.extensionInstalled) {
          if (msg.data.loggedIn)
            this.neoLinkStatus = 'NeoLink Status: Wallet is Open'
          else
            this.neoLinkStatus = 'NeoLink Status: Open a Wallet'
        }
        if (msg.data.address) {
          this.neonLinkAdress = msg.data.address;
        }
      }, false);
    }
  }

  setTestContract() {
    this.invocationObject = {
      'scriptHash': 'b3a14d99a3fb6646c78bf2f4e2f25a7964d2956a',
      'operation': 'putvalue',
      'arg1': 'test',
      'arg2': '00ff00',
      'assetType': 'GAS',
      'assetAmount': '.00025'
    }

  }
}
