import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { ItemsService } from '../../services/items.service';
import { HeaderComponent } from '../../layout/header/header.component';

@Component({
  selector: 'app-cart',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    RouterLink,
    RouterLinkActive,
    HeaderComponent
  ],
  templateUrl: './cart.component.html',
  styleUrl: './cart.component.css'
})
export class CartComponent {
  madeOrders:any = {};
  totalPrice:number = 0;

  constructor(public itemsService: ItemsService) {

  }

  ngOnInit(): void {
    // this.itemsService.getOrders();
    this.madeOrders = this.itemsService.getOrders();
    console.log(this.madeOrders);

    this.madeOrders.forEach((item:any) => {
      console.log(item);
      this.totalPrice =+ item['price'] * parseInt(item['quantity']);
    });
  }
}
