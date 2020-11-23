<<<<<<< HEAD
import { LocalStorageService } from './services/local-storage.service';
import { IonicModule } from '@ionic/angular';
import { FormsModule } from '@angular/forms';
=======
>>>>>>> bdf8a335c2cc683d342f14bf2e4bedd6e015aabc
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';



@NgModule({
  declarations: [],
  imports: [
<<<<<<< HEAD
    CommonModule,
    FormsModule,
    IonicModule,
  ],
  providers: [
    LocalStorageService
  ],
  exports: [
    CommonModule,
    FormsModule,
    IonicModule
=======
    CommonModule
>>>>>>> bdf8a335c2cc683d342f14bf2e4bedd6e015aabc
  ]
})
export class SharedModule { }
