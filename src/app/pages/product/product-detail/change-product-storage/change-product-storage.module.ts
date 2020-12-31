import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { ChangeProductStoragePageRoutingModule } from './change-product-storage-routing.module';

import { ChangeProductStoragePage } from './change-product-storage.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ChangeProductStoragePageRoutingModule
  ],
  declarations: [ChangeProductStoragePage]
})
export class ChangeProductStoragePageModule {}
