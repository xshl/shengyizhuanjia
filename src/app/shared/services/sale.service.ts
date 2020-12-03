import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class SaleService {

  constructor() { }

  getSales(i: number): number {
    return Math.floor((Math.random() * i));
  }
}
