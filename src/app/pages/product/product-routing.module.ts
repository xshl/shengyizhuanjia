import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

const routes: Routes = [
  {
    path: '',
    redirectTo: 'list',
    pathMatch: 'full'
  },
  {
    path: 'list',
    loadChildren: () => import('./category/category-list/category-list.module').then( m => m.CategoryListPageModule)
  },
  {
    path: 'add',
    loadChildren: () => import('./category/category-add/category-add.module').then( m => m.CategoryAddPageModule)
  },
  {
    path: 'edit',
    loadChildren: () => import('./category/category-edit/category-edit.module').then( m => m.CategoryEditPageModule)
  },
  {
    path: 'edit-name',
    loadChildren: () => import('./category/category-name-edit/category-name-edit.module').then( m => m.CategoryNameEditPageModule)
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ProductRoutingModule { }
