import { Router, ActivatedRoute } from '@angular/router';
import { Component, OnInit } from '@angular/core';
import { Category } from 'src/app/shared/class/category';
import { ActionSheetController, IonRouterOutlet } from '@ionic/angular';
import { CategoryService } from 'src/app/shared/services/category.service';
import { title } from 'process';
import { Location } from '@angular/common';
import { ActiveCategory } from 'src/app/shared/class/active-category';

@Component({
  selector: 'app-category-list',
  templateUrl: './category-list.page.html',
  styleUrls: ['./category-list.page.scss'],
})
export class CategoryListPage implements OnInit {

  categories: Array<Category>; // 所有的商品类别数据含大类和小类
  activeCategory: Category; // 当前被选中的商品大类别
  activeSubCategories: Array<Category>; // 当前被选中的商品大类别下的所有小类别,用activeCategory.children代替
  activeSubCategory: Category;  // 当前被选中的商品小类别
  id = 0;

  constructor(private categoryService: CategoryService,
              private actionSheetController: ActionSheetController,
              private router: Router,
              private activatedRoute: ActivatedRoute,
              private location: Location,
              private outlet: IonRouterOutlet) {
    this.loadData();
    activatedRoute.queryParams.subscribe(queryParams => {
      this.id = queryParams.id;
    });
  }

  ngOnInit() {
  }

  ionViewWillEnter(){
    this.loadData();
  }

  /*
   * 加载数据
   * @memberof CategoryListPage
   */
  loadData() {
    this.categoryService.getAll().then((data) => {
      this.categories = data.result;
      if (this.categories) {
        if (this.id == 0) {
          this.activeCategory = this.categories[this.id];
        } else {
          this.activeCategory = this.categories[this.id - 1];
        }
        this.activeSubCategories = this.activeCategory.children;
        // console.log(this.activeCategory);
        this.activeSubCategory = this.activeSubCategories[0];
      }
    });
  }

  /*
   * 选择大分类时，改变activeCategory的值，并找到该类别下的小类。
   * @param {number} id 选择的大类的id
   * @memberof CategoryListPage
   */
  selectCategory(id: number) {
    console.log(id);
    this.activeCategory = this.categories[id - 1];
    this.activeSubCategories = this.activeCategory.children;
  }

  /*
   * 选择小分类时，改变activeSubCategory的值，跳转回之前的页面。
   * @param {number} id 选择的小类的id
   * @memberof CategoryListPage
   */
  selectSubCategory(category: Category) {
    this.activeSubCategory = category;
    const activeCategory: ActiveCategory ={
      id: this.activeSubCategory.id,
      name: this.activeSubCategory.name,
    };
    this.categoryService.setActiveCategory(activeCategory);
    // this.location.back();
    this.outlet.pop(1);
  }

  onSelect(){
    const activeCategory: ActiveCategory ={
      id: this.activeCategory.id,
      name: this.activeCategory.name,
    };
    this.categoryService.setActiveCategory(activeCategory);
    // this.location.back();
    this.outlet.pop(1);
  }

  /*
   * 显示一个操作表，让用户选择编辑分类还是新增小分类。
   * @memberof CategoryListPage
   */
  async onPresentActionSheet() {
    const actionSheet = await this.actionSheetController.create({
      header: '选择您的操作',
      cssClass: 'ascCss',
      buttons: [
        {
          text: '新增小分类',
          role: 'destructive',
          handler: () => {
            console.log('Destructive clicked');
            this.gotoAddCategory();
          }
        }, {
          text: '编辑分类',
          handler: () => {
            console.log('Archive clicked');
            this.router.navigate(['/product/category/edit'],{
              queryParams: {
                id: this.activeCategory.id,
              }
            })
          }
        }, {
          text: '取消',
          role: 'cancel',
          handler: () => {
            console.log('Cancel clicked');
          }
        }
      ]
    });
    await actionSheet.present();
  }

  /*
   * 页面跳转到新增小分类页面。
   * @memberof CategoryListPage
   */
  gotoAddCategory() {
    this.router.navigate(['/product/category/add'],{
      queryParams: {
        id: this.activeCategory.id,
        name: this.activeCategory.name
      }
    })
  }

  /*
   * 根据id判断是否是被选中的大类别，是返回''，否则返回'light'。
   * @param {number} id 选中的大类id
   * @return {*}  {string}  颜色
   * @memberof CategoryListPage
   */
  getItemColor(id: number): string {
    if (id === this.activeCategory.id) {
      return '';
    } else {
      return 'light';
    }
  }
  
}
