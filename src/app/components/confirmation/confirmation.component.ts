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
  checkedValue:string = '';
  clearOrder:any = "";
  constructor (public productService: ItemsService,private router: Router) {
  }

  ngOnInit():void {

    if(localStorage.getItem("orderID") == null || undefined) {
      this.router.navigate(['/']);
    }
    
    this.checkedOutOrder = this.productService.getOrders();

    this.checkedOutOrder.forEach((item:any) => {
      this.numberOfItems =+ parseInt(item['quantity']);
      this.totalPrice =+ parseInt(item['price']) * parseInt(item['quantity']);
    });

    this.productService.getCheckout().forEach((el:any) => {

    });

    this.productService.getAccessToken().subscribe((token) => {
      this.productService.getAllNewOrders(localStorage.getItem("orderID"),token.access_token).subscribe(data => {
        for(let i = 0;i < data?.documents.length;i++) {
          if(data?.documents[i]._id == localStorage.getItem("orderID") && data?.documents[i].status == "Complete") {
            this.checkedValue = 'true';
          }else {
            this.checkedValue = 'false';
          }
        }

        if(this.checkedValue == "true") {
          this.productService.getAllOrders(token.access_token).subscribe((items:any) => {
            if(items?.documents.length > 0) {
              for(let i = 0; i < items?.documents.length; i++) {
                if(items?.documents[i].order_id == localStorage.getItem("orderID")) {
                  this.numberOfItems = this.numberOfItems + parseInt(items?.documents[i].quantity);
                  this.totalPrice = this.totalPrice + items?.documents[i].price;
                }
              }
              document.querySelector(".d-flex")?.setAttribute("style", "background-color: rgba(0,0,0,0);display: none;position: absolute;width: 0%;height: 0%;z-index: 0;");
              document.querySelector(".spinner-border")?.setAttribute("style", "display: none;background-color: rgba(0,0,0,0)");
              document.querySelector(".sr-only")?.setAttribute("style","display: none");
            }else {
              document.querySelector(".d-flex")?.setAttribute("style", "background-color: rgba(0,0,0,0);display: none;position: absolute;width: 0%;height: 0%;z-index: 0;");
              document.querySelector(".spinner-border")?.setAttribute("style", "display: none;background-color: rgba(0,0,0,0)");
              document.querySelector(".sr-only")?.setAttribute("style","display: none");
              document.querySelector(".card .text-center")?.setAttribute("style", "margin: 100px auto;width: 500px;display: none;");
            }
            this.totalPrice = parseFloat((this.totalPrice * this.numberOfItems).toFixed(4));
          });
        }else {
          
        }
      });
    });
  }

  competeOrder():void {
    localStorage.removeItem("orderID");
    localStorage.removeItem("user_id");
  }
}
