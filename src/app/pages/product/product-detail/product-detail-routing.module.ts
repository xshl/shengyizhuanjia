import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { ProductDetailPage } from './product-detail.page';

const routes: Routes = [
  {
    path: '',
    component: ProductDetailPage
  },
  {
    path: 'popover',
    loadChildren: () => import('./popover/popover.module').then( m => m.PopoverPageModule)
  },
  {
    path: 'change-product-storage',
    loadChildren: () => import('./change-product-storage/change-product-storage.module').then( m => m.ChangeProductStoragePageModule)
  },
  {
    path: 'storage-log',
    loadChildren: () => import('./storage-log/storage-log.module').then( m => m.StorageLogPageModule)
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ProductDetailPageRoutingModule {}
