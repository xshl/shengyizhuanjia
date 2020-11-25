import { SignupPage } from './signup/signup.page';
import { NgModule } from '@angular/core';

import { PassportRoutingModule } from './passport-routing.module';
import { SharedModule } from 'src/app/shared/shared.module';


@NgModule({
  declarations: [
    SignupPage
  ],
  imports: [
    SharedModule,
    PassportRoutingModule
  ]
})
export class PassportModule { }
