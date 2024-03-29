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
  checkedValue:string = '';

  d_flex_element:any;
  spinner_border_element:any;
  sr_only_element:any;
  card_element:any;

  orders_ID:any;
  users_ID:any;
  constructor(public itemsService: ItemsService) {

  }

  ngOnInit(): void {

    if (typeof window !== 'undefined') {
      this.orders_ID = localStorage.getItem('orderID');
      this.users_ID = localStorage.getItem('user_id');
    }

    if (typeof document !== 'undefined') {
      this.d_flex_element = document.querySelector('.d-flex');
      this.spinner_border_element = document.querySelector(".spinner-border");
      this.sr_only_element = document.querySelector(".sr-only");
      this.card_element = document.querySelector(".card .text-center");
    }

    this.madeOrders = [];
    // this.madeOrders.forEach((item:any) => {
    //   this.totalPrice =+ item['price'] * parseInt(item['quantity']);
    // });

    // if(this.madeOrders.length == 0) {
    //   document.querySelector(".text-center")?.setAttribute("style", "margin: 100px auto;width: 500px;display: block;");
    //   document.querySelector(".d-flex")?.setAttribute("style", "background-color: rgba(0,0,0,0);display: none;position: absolute;width: 0%;height: 0%;z-index: 0;");
    //   document.querySelector(".spinner-border")?.setAttribute("style", "display: none;background-color: rgba(0,0,0,0)");
    //   document.querySelector(".sr-only")?.setAttribute("style","display: none");
    // }

    if(this.orders_ID == null || undefined) {

      this.card_element?.setAttribute("style", "margin: 100px auto;width: 500px;display: block;");
      this.d_flex_element?.setAttribute("style", "background-color: rgba(0,0,0,0);display: none;position: absolute;width: 0%;height: 0%;z-index: 0;");
      this.spinner_border_element?.setAttribute("style", "display: none;background-color: rgba(0,0,0,0)");
      this.sr_only_element?.setAttribute("style","display: none");
    }else {
      this.itemsService.getAccessToken().subscribe((token) => {
        this.card_element?.setAttribute("style", "margin: 100px auto;width: 500px;display: none;");
        this.d_flex_element?.setAttribute("style", "background-color: rgba(0,0,0,0.3);display: none;position: absolute;width: 100%;height: 100%;z-index: 999;");
        this.spinner_border_element?.setAttribute("style", "margin-top: 300px;");
        this.itemsService.getAllNewOrders(this.orders_ID,token.access_token).subscribe(data => {
          
          for(let i = 0;i < data?.documents.length;i++) {
            if(data?.documents[i]._id == this.orders_ID && data?.documents[i].status == "Active") {
              this.checkedValue = 'true';
            }else {
              this.checkedValue = 'false';
            }
          }
  
          if(this.checkedValue == "true") {
            this.itemsService.getAllOrders(token.access_token).subscribe((items:any) => {
              if(items?.documents.length > 0) {
                this.card_element?.setAttribute("style", "margin: 100px auto;width: 500px;display: none;");
                this.d_flex_element?.setAttribute("style", "background-color: rgba(0,0,0,0);display: none;position: absolute;width: 0%;height: 0%;z-index: 0;");
                this.spinner_border_element?.setAttribute("style", "display: none;background-color: rgba(0,0,0,0.5);z-index: 0;");
                this.sr_only_element?.setAttribute("style","display: none;z-index: 0;");
                for(let i = 0; i < items?.documents.length; i++) {
                  if(items?.documents[i].order_id == this.orders_ID) {
                    this.madeOrders.push(items?.documents[i]);
                    // this.numberOfOrder = this.numberOfOrder + parseInt(items?.documents[i].quantity);
                    this.numberOfOrder = this.numberOfOrder + parseInt(items?.documents[i].quantity);
                    // this.totalPrice = this.totalPrice + items?.documents[i].price;
                    this.totalPrice = parseFloat(this.totalPrice + (items?.documents[i].price * parseInt(items?.documents[i].quantity)).toFixed(4));
                  }
                }

              }else {
                this.card_element?.setAttribute("style", "margin: 100px auto;width: 500px;display: block;");
                this.d_flex_element?.setAttribute("style", "background-color: rgba(0,0,0,0);display: none;position: absolute;width: 0%;height: 0%;z-index: 0;");
                this.spinner_border_element?.setAttribute("style", "display: none;background-color: rgba(0,0,0,0)");
                this.sr_only_element?.setAttribute("style","display: none");
                
              }
              // this.totalPrice = parseFloat((this.totalPrice * this.numberOfOrder).toFixed(4));
              this.itemsService.updateNewOrderInfo(this.orders_ID,this.totalPrice,this.numberOfOrder,token.access_token).subscribe(data => {
                console.log(data);
              });
            });
          }else {
            this.card_element?.setAttribute("style", "margin: 100px auto;width: 500px;display: block;");
          }
        });
  
      });
    }

    //  console.log(this.madeOrders);
  }

  deleteItem(itemID:string): void {
    this.d_flex_element?.setAttribute("style", "background-color: rgba(0,0,0,0.3);display: none;position: absolute;width: 100%;height: 100%;z-index: 999;");
    this.spinner_border_element?.setAttribute("style", "margin-top: 300px;");
    this.itemsService.getAccessToken().subscribe((token) => {
      this.itemsService.deleteItem(itemID,token.access_token).subscribe((response) => {
        // console.log(response);
        if(response) {
          this.ngOnInit();
          this.d_flex_element?.setAttribute("style", "background-color: rgba(0,0,0,0);display: none;position: absolute;width: 0%;height: 0%;z-index: 0;");
          this.spinner_border_element?.setAttribute("style", "display: none;background-color: rgba(0,0,0,0.5);z-index: 0;");
          this.sr_only_element?.setAttribute("style","display: none;z-index: 0;");
          alert("Item removed successfully from the list");
        }
      });
    });
    
  }
}
