import { CategoryService } from 'src/app/shared/services/category.service';
import { Category } from './../../../../shared/class/category';
import { ActivatedRoute, Router } from '@angular/router';
import { Component, OnInit } from '@angular/core';
import { CategoryNameEditPage } from '../category-name-edit/category-name-edit.page';
import { IonItemSliding, ModalController, AlertController } from '@ionic/angular';

@Component({
  selector: 'app-category-edit',
  templateUrl: './category-edit.page.html',
  styleUrls: ['./category-edit.page.scss'],
})
export class CategoryEditPage implements OnInit {

  category: Category;
  constructor(private activatedRoute: ActivatedRoute,
    private categoryService: CategoryService,
    private modalController: ModalController,
    private alertController: AlertController,
    private router: Router) {
    activatedRoute.queryParams.subscribe(queryParams => {
      this.category = categoryService.getCategory(queryParams.id);
    });
  }

  ngOnInit() {
  }

  private async presentModal(name: string, id: number, childId: number) {
    const modal = await this.modalController.create({
      component: CategoryNameEditPage,
      componentProps: { value: name, id: id, childId: childId }
    });
    await modal.present();
    return modal.onWillDismiss();
  }

  async onEditCategoryName(item: IonItemSliding) {
    item.close();
    const { data } = await this.presentModal(this.category.name, this.category.id, 0);
    console.log(data);
    if (data) {
      this.category.name = data;
    }
  }

  async onEditSubCategoryName(item: IonItemSliding, subCategory: Category) {
    item.close();
    const { data } = await this.presentModal(subCategory.name, this.category.id, subCategory.id);
    if (data) {
      subCategory.name = data;
    }
  }

  async onDelete(item: IonItemSliding, subId?: number) {
    // 其他代码省略
    const alert = await this.alertController.create({
      header: '你确认要删除吗!',
      cssClass: 'twoBtn',
      message: '请先删除该类别下的所有商品记录',
      buttons: [
        {
          text: '取消',
          role: 'cancel',
          cssClass: 'secondary',
          handler: (blah) => {
            console.log('Confirm Cancel: blah');
          }
        }, {
          text: '确认',
          handler: () => {
            console.log('Confirm Okay');
            // 其他代码省略
            if (subId == null) {
              item.close();
              this.categoryService.deleteCategory(this.category.id);
              this.router.navigate(['/product/category/list'],{
                queryParams: {
                  id: 0
                }
              })
            } else {
              item.close();
              this.categoryService.delteteChild(this.category, subId);
              this.category = this.categoryService.getCategory(this.category.id);
            }
          }
        }
      ]
    });
    await alert.present();
  }

}
