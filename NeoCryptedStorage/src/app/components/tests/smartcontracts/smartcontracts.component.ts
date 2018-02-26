import { Component } from '@angular/core';
import * as Neon from '@cityofzion/neon-js';

@Component({
  selector: 'smartcontracts',
  templateUrl: './smartcontracts.component.html'
})
export class SmartContractsComponent {
  // http://cityofzion.io/neon-js/smart_contracts/index.html?highlight=scriptbuilder

  hideIntSCDetails = true;
  intSCResult?: number;
  intSCDetails: any = undefined;
  public invokeIntSC() {
    const props: Neon.sc.scriptParams = {
      scriptHash: '815c02eb2fbbb14931474c35f136a0492c78f4b0',
      operation: 'none',
      args: []
    }
    // Returns a hexstring
    const vmScript = Neon.sc.createScript(props);

    //// Returns name, symbol
    Neon.rpc.Query.invokeScript(vmScript)
      .execute('http://neo-privnet:30333')
      .then((res: any) => {
        this.intSCDetails = res;
        if (res.result.state === "HALT, BREAK" &&
          !!res.result.stack["0"]) {
          let hexValue = res.result.stack["0"].value;

          this.intSCResult = parseInt(hexValue, 16);    
        }
      }, (errpr) => {
        debugger;
      });
  }

  hideStringSCDetails = true;
  stringSCResult?: string;
  stringSCDetails: any = undefined;
  public invokeStringSC() {
    const props: Neon.sc.scriptParams = {
      scriptHash: '2b5293561c37272d41b860a8905172508dedb489',
      operation: 'none',
      args: []
    }
    // Returns a hexstring
    const vmScript = Neon.sc.createScript(props);

    //// Returns name, symbol
    Neon.rpc.Query.invokeScript(vmScript)
      .execute('http://neo-privnet:30333')
      .then((res: any) => {
        this.stringSCDetails = res;
        if (res.result.state === "HALT, BREAK" &&
          !!res.result.stack["0"]) {
          let hexValue = res.result.stack["0"].value;
          let result = "";
          for (var i = 0; i < hexValue.length; i += 2) {
            result += String.fromCharCode(parseInt(hexValue.substr(i, 2), 16));
          }

          this.stringSCResult = result;
        }
      }, (errpr) => {
        debugger;
      });
  }

  hideParamSCDetails = false;
  paramSCResult?: string;
  paramSCDetails: any = undefined;
  paramSCparameter: string = "Stefan";
  public invokeParamSC() {
    let args = [];
    if (this.paramSCparameter) {
      let cpString = Neon.sc.ContractParam.string(this.paramSCparameter);
      args.push(cpString);
    }
    const props: Neon.sc.scriptParams = {
      scriptHash: 'c1d379069404539f43cadc803f1bd42e9cbd52c9',
      operation: 'none',
      args: args
    }
    // Returns a hexstring
    const vmScript = Neon.sc.createScript(props);

    //// Returns name, symbol
    Neon.rpc.Query.invokeScript(vmScript)
      .execute('http://neo-privnet:30333')
      .then((res: any) => {
        this.paramSCDetails = res;
        if (res.result.state === "HALT, BREAK" &&
          !!res.result.stack["0"]) {
          let hexValue = res.result.stack["0"].value;
          let result = "";
          for (var i = 0; i < hexValue.length; i += 2) {
            result += String.fromCharCode(parseInt(hexValue.substr(i, 2), 16));
          }

          this.paramSCResult = result;
        }
      }, (errpr) => {
        debugger;
      });
  }
}
