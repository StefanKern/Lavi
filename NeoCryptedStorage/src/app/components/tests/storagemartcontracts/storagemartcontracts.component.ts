import { Component } from '@angular/core';
import * as Neon from '@cityofzion/neon-js';

@Component({
  selector: 'storagemartcontracts',
  templateUrl: './storagemartcontracts.component.html'
})
export class StorageSmartContractsComponent {
  // http://cityofzion.io/neon-js/smart_contracts/index.html?highlight=scriptbuilder
  SMARTCONTRACTSCRIPTHASH = '435628ccc26b184494f1479c03c6c145feda4394';
  PRIVATEKEY: string = "6PYKN6jd6wGE4dR2FPz7BehZfZ7qZoSHDYzwF6QCMAGAAD2q6B5XjnvNVm";
  PASSWORD: string = 'passpharse';

  setKey: string = "Stefan";
  setValue: string = "Test";
  hideSetDetails = true;
  setRequestResult: any = undefined;
  setRequestResultDetails: any = undefined;
  public addStorageRequest() {
    let net = 'http://neo-privnet:5000';
    let account = new Neon.wallet.Account(this.PRIVATEKEY);
    account.decrypt(this.PASSWORD);
    let fromAddrScriptHash = Neon.wallet.getScriptHashFromAddress(account.address)
    Neon.api.neonDB.getBalance(net, account.address)
      .then((balance: Neon.wallet.Balance) => {
      const intents: Neon.tx.TransactionOutput[] = [{
        assetId: Neon.CONST.ASSET_ID.GAS,
        value: new Neon.u.Fixed8(0.00000001),
        scriptHash: account.scriptHash
      }];

      let invoke: Neon.sc.scriptParams = {
        scriptHash: this.SMARTCONTRACTSCRIPTHASH,
        operation: 'addStorageRequest',
        args: [
          Neon.sc.ContractParam.string(this.setKey),
          Neon.sc.ContractParam.string(this.setValue)
        ]
      }
      // Returns a hexstring
      const sb = new Neon.sc.ScriptBuilder();
      sb.emitAppCall(invoke.scriptHash, invoke.operation, invoke.args, false);
      const script = sb.str;
      let unsignedTx = Neon.tx.Transaction.createInvocationTx(balance, intents, script, 3, { version: 1 });
      let signedTx = Neon.tx.signTransaction(unsignedTx, '1dd37fba80fec4e6a6f13fd708d8dcb3b29def768017052f6c930fa1c5d90bbb');
      let hexTx = Neon.tx.serializeTransaction(signedTx);
      return Neon.rpc.queryRPC('http://neo-privnet:30333', {
        method: 'sendrawtransaction',
        params: [hexTx],
        id: 1
      });
    });



    //return Promise.all([rpcEndpointPromise, balancePromise])
    //  .then((values) => {
    //    debugger;
    //    endpt = values[0];
    //    let balances = values[1];
    //    let intents: any = [
    //      { assetId: Neon.CONST.ASSET_ID.GAS, value: 0.00000001, scriptHash: fromAddrScriptHash }
    //    ]
    //    const invoke = {
    //      scriptHash: this.SMARTCONTRACTSCRIPTHASH,
    //      operation: 'addStorageRequest',
    //      args: [
    //        Neon.sc.ContractParam.string(this.setKey),
    //        Neon.sc.ContractParam.string(this.setValue)
    //      ]
    //    }
    //    const unsignedTx = Neon.tx.Transaction.createInvocationTx(balances, intents, invoke, 0, { version: 1 })
    //    return Neon.tx.signTransaction(unsignedTx, account.privateKey)
    //  })
    //  .then((signedResult) => {
    //    debugger;
    //    signedTx = signedResult
    //    return Neon.rpc.Query.sendRawTransaction(signedTx).execute(endpt)
    //  })
    //  .then((res) => {
    //    debugger;
    //    if (res.result === true) {
    //      res.txid = signedTx.hash
    //    }
    //    return res
    //  })    
  }  

  getKey: string = "Stefan";
  hideGetDetails = true;
  getRequestResult: any = undefined;
  getRequestResultDetails: any = undefined;
  public getPendingRequest() {
    const props: Neon.sc.scriptParams = {
      scriptHash: this.SMARTCONTRACTSCRIPTHASH,
      operation: 'getPendingRequest',
      args: [
        Neon.sc.ContractParam.string(this.getKey),
      ],
      useTailCall: true
    }
    // Returns a hexstring
    const vmScript = Neon.sc.createScript(props);


    //// Returns name, symbol
    Neon.rpc.Query.invokeScript(vmScript)
      .execute('http://neo-privnet:30333')
      .then((res: any) => {
        this.getRequestResultDetails = res;
        if (res.result.state === "HALT, BREAK" &&
          !!res.result.stack["0"]) {

          let hexValue = res.result.stack["0"].value;
          let result = "";
          for (var i = 0; i < hexValue.length; i += 2) {
            result += String.fromCharCode(parseInt(hexValue.substr(i, 2), 16));
          }

          this.getRequestResult = result;
        }
      }, (errpr) => {
        debugger;
      });
  }
}
