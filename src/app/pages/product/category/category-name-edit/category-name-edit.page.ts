import { CategoryService } from 'src/app/shared/services/category.service';
import { Component, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { ModalController, NavParams, ToastController } from '@ionic/angular';
import { BrowserStack } from 'protractor/built/driverProviders';

@Component({
  selector: 'app-category-name-edit',
  templateUrl: './category-name-edit.page.html',
  styleUrls: ['./category-name-edit.page.scss'],
})
export class CategoryNameEditPage implements OnInit {

  categoryName: string;
  categoryId: number;
  childrenId: number;
  constructor(private modalController: ModalController,
              private navParams: NavParams,
              private categoryService: CategoryService,
              private toastController: ToastController) { 
    this.categoryName = this.navParams.data.value; 
    this.categoryId = this.navParams.data.id;
    this.childrenId = this.navParams.data.childId;
  }

  ngOnInit() {
  }

  dismiss(name?: string) {
    this.modalController.dismiss(name);
  }
  async onSave() {
    const toast = await this.toastController.create({
      duration: 3000,
    });
    const category = this.categoryService.getCategory(this.categoryId);
    if (this.childrenId == 0) { //修改大类名称
      category.name = this.categoryName;
      this.categoryService.isUniqueCategoryName(category).then((res) => {
        if (res.success) {
          this.dismiss(this.categoryName);
          this.categoryService.updateName(category);
        } else {
          toast.message = res.error.message;
          toast.present();
        }
      });
    } else {  //修改小类名称
      let i: number;
      for (i = 0; i < category.children.length; i++) {
        if (category.children[i].id == this.childrenId) {
          category.children[i].name = this.categoryName;
          break;
        }
      }
      console.log(i);
      this.categoryService.isUniqueChildName(category, i).then((res) => {
        if (res.success) {
          this.dismiss(this.categoryName);
          this.categoryService.updateName(category);
        } else {
          toast.message = res.error.message;
          toast.present();
        }
      });
    }
    
    
  }

}
