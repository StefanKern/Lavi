import { Component, OnInit } from '@angular/core';
import * as Neon from '@cityofzion/neon-js';

@Component({
  selector: 'app-lavi-neon-js',
  templateUrl: './lavi-neon-js.component.html'
})
export class LaviNeonJsComponent implements OnInit {

  SMARTCONTRACTSCRIPTHASH = '4cb9e1941c687975fed8251756cd2cac6718ee2d';
  WIFOFFER: string = "L3upeZZzo1rMSWtYGc4NtU9zQgd6KQgYnpMrSWAZLiaNieukrzoA";
  WIFTAKER: string = "L4NYRisb56caTVuRfu3kjxdqqKbtDu3tr66Vwm5YN9nDqvArbR7A";
  NET = 'http://neo-privnet:5000';
  RPCNET = 'http://neo-privnet:30333';

  key = "12345";
  pubOfferer = "456"

  openOfferResult: any;
  validateOpenOfferResultAll: any;
  validateOpenOfferResult: any;

  constructor() { }

  ngOnInit() {
  }


  openOffer() {
    this.openOfferResult = null;
    let account = new Neon.wallet.Account(this.WIFOFFER);
    let fromAddrScriptHash = Neon.wallet.getScriptHashFromAddress(account.address)
    Neon.api.neonDB.getBalance(this.NET, account.address)
      .then((balance: Neon.wallet.Balance) => {
        const intents: Neon.tx.TransactionOutput[] = [{
          assetId: Neon.CONST.ASSET_ID.GAS,
          value: new Neon.u.Fixed8(0.00000001),
          scriptHash: account.scriptHash
        }];


        let invoke: Neon.sc.scriptParams = {
          scriptHash: this.SMARTCONTRACTSCRIPTHASH,
          operation: 'OpenOffer',
          args: [
            Neon.sc.ContractParam.string(this.key),
            Neon.sc.ContractParam.string(this.pubOfferer),
            Neon.sc.ContractParam.string(account.address)
          ]
        }

        // Returns a hexstring
        const sb = new Neon.sc.ScriptBuilder();
        sb.emitAppCall(invoke.scriptHash, invoke.operation, invoke.args, false);
        const script = sb.str;
        let unsignedTx = Neon.tx.Transaction.createInvocationTx(balance, intents, script, 3, { version: 1 });
        let signedTx = Neon.tx.signTransaction(unsignedTx, account.privateKey);
        let hexTx = Neon.tx.serializeTransaction(signedTx)

        Neon.rpc.queryRPC(this.RPCNET, {
          method: 'sendrawtransaction',
          params: [hexTx],
          id: 1
        }).then((result) => {
          this.openOfferResult = result;
        });
      });
  }


  public validateOpenOffer() {
    
    const props: Neon.sc.scriptParams = {
      scriptHash: this.SMARTCONTRACTSCRIPTHASH,
      operation: 'GetOpenOffer',
      args: [
        Neon.sc.ContractParam.byteArray(Neon.u.str2hexstring(this.key), "")
      ],
      useTailCall: true
    }
    // Returns a hexstring
    const vmScript = Neon.sc.createScript(props);

    //// Returns name, symbol
    Neon.rpc.Query.invokeScript(vmScript)
      .execute(this.RPCNET)
      .then((res: any) => {
        this.validateOpenOfferResultAll = res;
        if (res.result.state === "HALT, BREAK" &&
          !!res.result.stack["0"]) {
          let hexValue = res.result.stack["0"].value;
          let result = "";
          for (var i = 0; i < hexValue.length; i += 2) {
            result += String.fromCharCode(parseInt(hexValue.substr(i, 2), 16));
          }

          this.validateOpenOfferResult = result;
        }
      }, (errpr) => {
      });
  }

  takeOfferResult: any;
  validateTakeOfferResultAll: any;
  validateTakenOfferResult: any;
  pubSender = "456"

  takeOffer() {
    this.openOfferResult = null;
    let account = new Neon.wallet.Account(this.WIFOFFER);
    let fromAddrScriptHash = Neon.wallet.getScriptHashFromAddress(account.address)
    Neon.api.neonDB.getBalance(this.NET, account.address)
      .then((balance: Neon.wallet.Balance) => {
        const intents: Neon.tx.TransactionOutput[] = [{
          assetId: Neon.CONST.ASSET_ID.GAS,
          value: new Neon.u.Fixed8(0.00000001),
          scriptHash: account.scriptHash
        }];


        let invoke: Neon.sc.scriptParams = {
          scriptHash: this.SMARTCONTRACTSCRIPTHASH,
          operation: 'TakeOffer',
          args: [
            Neon.sc.ContractParam.string(this.key),
            Neon.sc.ContractParam.string(this.pubSender)
          ]
        }

        // Returns a hexstring
        const sb = new Neon.sc.ScriptBuilder();
        sb.emitAppCall(invoke.scriptHash, invoke.operation, invoke.args, false);
        const script = sb.str;
        let unsignedTx = Neon.tx.Transaction.createInvocationTx(balance, intents, script, 3, { version: 1 });
        let signedTx = Neon.tx.signTransaction(unsignedTx, account.privateKey);
        let hexTx = Neon.tx.serializeTransaction(signedTx)

        Neon.rpc.queryRPC(this.RPCNET, {
          method: 'sendrawtransaction',
          params: [hexTx],
          id: 1
        }).then((result) => {
          this.takeOfferResult = result;
        });
      });
  }


  public validateTakeOffer() {
    const props: Neon.sc.scriptParams = {
      scriptHash: this.SMARTCONTRACTSCRIPTHASH,
      operation: 'GetTakeOffer',
      args: [
        Neon.sc.ContractParam.string(this.key),
      ],
      useTailCall: true
    }
    // Returns a hexstring
    const vmScript = Neon.sc.createScript(props);

    //// Returns name, symbol
    Neon.rpc.Query.invokeScript(vmScript)
      .execute(this.RPCNET)
      .then((res: any) => {
        this.validateTakeOfferResultAll = res;
        if (res.result.state === "HALT, BREAK" &&
          !!res.result.stack["0"]) {
          let hexValue = res.result.stack["0"].value;
          let result = "";
          for (var i = 0; i < hexValue.length; i += 2) {
            result += String.fromCharCode(parseInt(hexValue.substr(i, 2), 16));
          }

          this.validateTakenOfferResult = result;
        }
      }, (errpr) => {
        debugger;
      });
  }
}
