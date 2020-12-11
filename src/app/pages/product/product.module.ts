import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ProductRoutingModule } from './product-routing.module';
import { CategoryListPage } from './category/category-list/category-list.page';
import { CategoryAddPage } from './category/category-add/category-add.page';
import { CategoryEditPage } from './category/category-edit/category-edit.page';
import { CategoryNameEditPage } from './category/category-name-edit/category-name-edit.page';
import { SharedModule } from 'src/app/shared/shared.module';


@NgModule({
  declarations: [
  ], 
  imports: [
    CommonModule,
    SharedModule,
    ProductRoutingModule
  ]
})
export class ProductModule { }
