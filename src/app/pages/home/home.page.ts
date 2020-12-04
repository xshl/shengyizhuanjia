import { Component, OnInit } from '@angular/core';
import { SaleService } from 'src/app/shared/services/sale.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.page.html',
  styleUrls: ['./home.page.scss'],
})
export class HomePage implements OnInit {

  constructor(private sale: SaleService) { }

  sales: Array<{ title: string, content: string, previous: number, current: number }>;
  quicks = [
    [
      { href: '/product-add', name: 'add_sales', text: '新增商品', disable: false },
      { href: '/home', name: 'add_user', text: '新增会员', disable: false },
      { href: '/home', name: 'sales_account', text: '收银记账', disable: false },
      { href: '/home', name: 'a_note', text: '支出管理', disable: false }
    ],
    [
      { href: '/category-list', name: 'sales_management', text: '商品分类', disable: false },
      { href: '/home', name: 'user_management', text: '会员管理', disable: false },
      { href: '/home', name: 'shop_management', text: '查询销售', disable: false },
      { href: '/home', name: 'analysis', text: '智能分析', disable: false }
    ],
    [
      { href: '/home', name: 'gongying_more', text: '供应商管理', disable: false },
      { href: '/home', name: 'guandan_more', text: '挂单', disable: false },
      { href: '/home', name: 'image_addsales', text: '高级功能', disable: false },
      { disable: true }
    ]
  ];

  ngOnInit() {
    this.sales = [
      { title: '今日', content: '比昨日', previous: this.sale.getSales(100), current: this.sale.getSales(100) },
      { title: '七日', content: '比同期', previous: this.sale.getSales(1000), current: this.sale.getSales(1000) },
      { title: '本月', content: '比同期', previous: this.sale.getSales(10000), current: this.sale.getSales(10000) },
    ];
  }

  /*
   * 销售增减情况
   * @param {number} current  当前销售数据
   * @param {number} previous 前期销售数据
   * @return {*}  {number}  1 增长 0 持平 -1 减少
   * @memberof HomePage
   */
  minus(current: number, previous: number): number {
    const result = current - previous;
    if (result > 0) {
      return 1;
    } else if (result === 0) {
      return 0;
    } else {
      return -1;
    }
  }

}
