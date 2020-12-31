import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { ChangeProductStoragePage } from './change-product-storage.page';

const routes: Routes = [
  {
    path: '',
    component: ChangeProductStoragePage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ChangeProductStoragePageRoutingModule {}
