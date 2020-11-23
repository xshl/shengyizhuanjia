import { SignupPage } from './signup/signup.page';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { PassportRoutingModule } from './passport-routing.module';
import { SharedModule } from 'src/app/shared/shared.module';


@NgModule({
  declarations: [
    SignupPage
  ],
  imports: [
    SharedModule,
    // CommonModule,
    PassportRoutingModule
  ]
})
export class PassportModule { }
