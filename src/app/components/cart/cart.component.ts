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
  madeOrders:any = [];
  totalPrice:number = 0;
  newOrders:any = [];
  orders:any = {};
  access_Token:any = [];
  data:any = [];
  numberOfOrder:number = 0;

  constructor(public itemsService: ItemsService) {

  }

  ngOnInit(): void {
    // this.itemsService.getOrders();
    // this.madeOrders = this.itemsService.getOrders();
    // console.log(this.madeOrders);

    this.madeOrders.forEach((item:any) => {
      // console.log(item);
      this.totalPrice =+ item['price'] * parseInt(item['quantity']);
    });

    this.itemsService.getAccessToken().subscribe((token) => {
      // console.log(token.access_token);
      // this.access_Token.push(token);
      this.itemsService.getAllOrders(token.access_token).subscribe((items:any) => {
        console.log(items);
        // console.log(items?.documents);
        // this.madeOrders.push(items?.documents);
        if(items?.documents.length > 0) {
          for(let i = 0; i < items?.documents.length; i++) {
            // console.log(items?.documents[i].status);
            if(items?.documents[i].status == "Active") {
              this.madeOrders.push(items?.documents[i]);
              this.numberOfOrder = this.numberOfOrder + parseInt(items?.documents[i].quantity);
            }
          }
        }else {
          document.querySelector(".card .text-center")?.setAttribute("style", "margin: 100px auto;width: 500px;display: none;");
        }

        // this.newOrders.push(items);
        // console.log(this.newOrders);
        // this.newOrders.forEach((item:any) => {
        //   this.data.push(item);
        //   // console.log(this.data);
        // });
      });
    });

    console.log(this.madeOrders);

    // console.log(this.access_Token);
    // this.itemsService.setWebToken(this.access_Token);

    this.itemsService.getOrders().forEach((elm:any) => {
      // this.numberOfOrder = this.numberOfOrder + parseInt(elm['quantity']);
      // console.log(elm['quantity']);
      // console.log(elm);
      // console.log(parseInt(elm['quantity']));
    });

  }
}
