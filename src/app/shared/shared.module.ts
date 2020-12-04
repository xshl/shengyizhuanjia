import { CopyrightComponent } from './components/copyright/copyright.component';
import { LocalStorageService } from './services/local-storage.service';
import { IonicModule } from '@ionic/angular';
import { FormsModule } from '@angular/forms';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ConfirmDirective } from './directives/confirm.directive';
import { PhonePatternDirective } from './directives/phone-pattern.directive';
import { PasswordPatternDirective } from './directives/password-pattern.directive';



@NgModule({
  declarations: [
    CopyrightComponent,
    ConfirmDirective,
    PhonePatternDirective,
    PasswordPatternDirective,
  ],
  imports: [
    CommonModule,
    FormsModule,
    IonicModule
  ],
  providers: [
    LocalStorageService
  ],
  exports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ConfirmDirective,
    PhonePatternDirective,
    PasswordPatternDirective,
    CopyrightComponent,
  ]
})
export class SharedModule { }
