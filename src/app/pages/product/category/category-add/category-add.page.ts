import { ToastController, IonRouterOutlet } from '@ionic/angular';
import { CategoryService } from 'src/app/shared/services/category.service';
import { Category } from './../../../../shared/class/category';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-category-add',
  templateUrl: './category-add.page.html',
  styleUrls: ['./category-add.page.scss'],
})
export class CategoryAddPage implements OnInit {

  id = 0;
  name = '';
  title = '';

  category: Category;
  constructor(private activatedRoute: ActivatedRoute,
              private categoryService: CategoryService,
              private toastController: ToastController,
              private outlet: IonRouterOutlet,
              private router: Router) {
    activatedRoute.queryParams.subscribe(queryParams => {
      this.id = queryParams.id;
      this.name = queryParams.name;
    });

  }

  /*
   * 初始化
   * @memberof CategoryAddPage
   */
  ngOnInit() {
    if (this.id == 0) {
      this.title = '新增分类';
    } else {
      this.title = '新增小分类';
    }
    console.log(this.id);
    this.category = this.categoryService.initCategory(this.id, this.name);
  }

  /*
   * 增加小分类
   * @memberof CategoryAddPage
   */
  onAddSubCategory() {
    const categorychild = new Category();
    console.log(this.category);
    const lastChildId = this.category.children[this.category.children.length - 1].id;
    categorychild.id = lastChildId + 1;
    categorychild.name = '';
    categorychild.children = [];
    this.category.children.push(categorychild);
  }

  /*
   * 保存修改
   * @memberof CategoryAddPage
   */
  async onSave() {
    const toast = await this.toastController.create({
      duration: 3000,
    });
    this.categoryService.isUniqueName(this.category, this.id).then((res) => {
      console.log(res);
      if(res.success) {
        if (this.id == 0) {
          this.categoryService.insertCategory(this.category); 
          this.outlet.pop(1);
          
        } else {
          this.categoryService.insertSubCategory(this.category);
          this.outlet.pop(1);
        }
        this.router.navigate(['/product/category/list'],{
          queryParams: {
            id: this.category.id
          }
        })
      } else {
        toast.message = res.error.message;
        toast.present();
      }
    })
    
  }

}
