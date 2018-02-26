import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';

import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpModule } from '@angular/http';
import { HttpClientModule } from '@angular/common/http';
import { RouterModule } from '@angular/router';
import { AppComponent } from './components/app/app.component';
import { AestestComponent } from './components/tests/aestest/aestest.component';
import { AzureblobstorageconnetionComponent } from './components/tests/azureblobstorageconnetion/azureblobstorageconnetion.component';
import { BalanceAndSendingComponent } from './components/tests/balanceandsending/balanceandsending.component';
import { NeoLinkComponent } from './components/tests/neolink/neolink.component';
import { SharedSecretComponent } from './components/tests/sharedsecret/sharedsecret.component';
import { SmartContractsComponent } from './components/tests/smartcontracts/smartcontracts.component';
import { StorageSmartContractsComponent } from './components/tests/storagemartcontracts/storagemartcontracts.component';
import { LaviNeonJsComponent } from './components/tests/lavi-neon-js/lavi-neon-js.component';

import { AccountService } from './services/account.service';
import { AddfileComponent } from './components/modals/addfile/addfile.component';
import { FileService } from './services/file.service';
import { HomeComponent } from './components/home/home.component';
import { OfferService } from './services/offer.service';
import { OffereditemComponent } from './components/parts/offereditem/offereditem.component';
import { TakeOfferComponent } from './components/takeoffer/takeoffer.component';
import { GrantofferComponent } from './components/grantoffer/grantoffer.component';
import { OfferandfileService } from './services/offerandfile.service';
import { LaviSamartcontractService } from './services/lavi.samartcontract.service';
import { OpenOfferComponent } from './components/openoffer/openoffer.component';
import { YourfilesComponent } from './components/yourfiles/yourfiles.component';


@NgModule({
  declarations: [
    AppComponent,
    AestestComponent,
    AzureblobstorageconnetionComponent,
    BalanceAndSendingComponent,
    NeoLinkComponent,
    SharedSecretComponent,
    SmartContractsComponent,
    StorageSmartContractsComponent,
    OpenOfferComponent,
    AddfileComponent,
    HomeComponent,
    OffereditemComponent,
    TakeOfferComponent,
    GrantofferComponent,
    LaviNeonJsComponent,
    YourfilesComponent
  ],
  imports: [
    BrowserModule,
    NgbModule.forRoot(),
    CommonModule,
    HttpModule,
    HttpClientModule,
    FormsModule,
    RouterModule.forRoot([
      { path: '', redirectTo: 'home', pathMatch: 'full' },
      { path: 'openoffer', component: OpenOfferComponent },
      { path: 'takeoffer', component: TakeOfferComponent },
      { path: 'grantoffer', component: GrantofferComponent },
      { path: 'yourfiles', component: YourfilesComponent },
      { path: 'home', component: HomeComponent },
    // tests
      { path: 'tests/aestest', component: AestestComponent },
      { path: 'tests/azureblobstorageconnetion', component: AzureblobstorageconnetionComponent },
      { path: 'tests/balanceandsending', component: BalanceAndSendingComponent },
      { path: 'tests/neolink', component: NeoLinkComponent },
      { path: 'tests/sharedsecret', component: SharedSecretComponent },
      { path: 'tests/smartcontracts', component: SmartContractsComponent },
      { path: 'tests/storagemartcontracts', component: StorageSmartContractsComponent },
      { path: 'tests/lavi-neon-js', component: LaviNeonJsComponent },
      { path: '**', redirectTo: 'home' }
    ])
  ],
  entryComponents: [AddfileComponent],
  providers: [AccountService, FileService, OfferService, OfferandfileService, LaviSamartcontractService],
  bootstrap: [AppComponent]
})
export class AppModule { }
