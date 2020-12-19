import { Supplier } from './supplier';
export class Product {
    id: string;             // 商品id
    name: string;           // 商品名字
    categoryId: number;     // 分类id
    categoryName: string;   // 分类名称
    category: any;          // 
    barcode: string;        // 条形码
    images: string[];       // 商品图片
    price: number;          // 售价
    importPrice: number;    // 进价
    StorageNum: number;     // 库存
    supplier: Supplier;       // 供货商
    standard: string;       // 规格
    remark: string;         // 备注
}
