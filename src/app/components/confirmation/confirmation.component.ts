import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { ItemsService } from '../../services/items.service';

@Component({
  selector: 'app-confirmation',
  standalone: true,
  imports: [
    CommonModule,
    RouterLink,
    RouterLinkActive
  ],
  templateUrl: './confirmation.component.html',
  styleUrl: './confirmation.component.css'
})
export class ConfirmationComponent {

  checkedOutOrder:any = [];
  totalPrice: number = 0;
  numberOfItems:number = 0;
  clearOrder:any = "";
  constructor (public productService: ItemsService) {
  }

  ngOnInit():void {
    this.checkedOutOrder = this.productService.getOrders();

    this.checkedOutOrder.forEach((item:any) => {
      this.numberOfItems =+ parseInt(item['quantity']);
      this.totalPrice =+ parseInt(item['price']) * parseInt(item['quantity']);
    });

    console.log(this.productService.getCheckout());
    this.productService.getCheckout().forEach((el:any) => {

    });
  }

  competeOrder():void {
  }
}
