import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { FormControl } from '@angular/forms';
import { FormsModule } from '@angular/forms';
import { ItemsService } from '../../services/items.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-payment-details',
  standalone: true,
  imports: [
    CommonModule,
    RouterLink,
    RouterLinkActive,
    FormsModule
  ],
  templateUrl: './payment-details.component.html',
  styleUrl: './payment-details.component.css'
})
export class PaymentDetailsComponent {
  card_number:string = '';
  exp_date:string = '';
  cvc_number:string = '';
  account_holder:string = '';

  checkedOutOrder:any = [];
  totalPrice: number = 0;
  numberOfItems:number = 0;
  checkedValue:string = '';
  clearOrder:any = "";

  d_flex_element:any;
  spinner_border_element:any;
  sr_only_element:any;
  card_element:any;

  orders_ID:any;
  users_ID:any;
  constructor(private itemService: ItemsService,private router: Router) {

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

    this.itemService.getAccessToken().subscribe((token) => {
      this.itemService.getAllNewOrders(this.orders_ID,token.access_token).subscribe(data => {
        for(let i = 0;i < data?.documents.length;i++) {
          if(data?.documents[i]._id == this.orders_ID && data?.documents[i].status == "Complete") {
            this.checkedValue = 'true';
          }else {
            this.checkedValue = 'false';
          }
        }

        if(this.checkedValue == "true") {
          this.itemService.getAllOrders(token.access_token).subscribe((items:any) => {
            if(items?.documents.length > 0) {
              for(let i = 0; i < items?.documents.length; i++) {
                if(items?.documents[i].order_id == this.orders_ID) {
                  // this.numberOfItems = this.numberOfItems + parseInt(items?.documents[i].quantity);
                  // this.totalPrice = this.totalPrice + items?.documents[i].price;
                  // this.totalPrice = this.totalPrice + (items?.documents[i].price * parseInt(items?.documents[i].quantity));
                  this.totalPrice = parseFloat(this.totalPrice + (items?.documents[i].price * parseInt(items?.documents[i].quantity)).toFixed(4));
                }
              }
              this.d_flex_element?.setAttribute("style", "background-color: rgba(0,0,0,0);display: none;position: absolute;width: 0%;height: 0%;z-index: 0;");
              this.spinner_border_element?.setAttribute("style", "display: none;background-color: rgba(0,0,0,0)");
              this.sr_only_element?.setAttribute("style","display: none");
            }else {
              this.d_flex_element?.setAttribute("style", "background-color: rgba(0,0,0,0);display: none;position: absolute;width: 0%;height: 0%;z-index: 0;");
              this.spinner_border_element?.setAttribute("style", "display: none;background-color: rgba(0,0,0,0)");
              this.sr_only_element?.setAttribute("style","display: none");
              this.card_element?.setAttribute("style", "margin: 100px auto;width: 500px;display: none;");
            }
            // this.totalPrice = parseFloat((this.totalPrice * this.numberOfItems).toFixed(4));
          });
        }else {
          
        }
      });
    });
  }

  newPayments(): void {
    this.d_flex_element?.setAttribute("style", "background-color: rgba(0,0,0,0.3);display: none;position: absolute;width: 100%;height: 100%;z-index: 999;");
    this.spinner_border_element?.setAttribute("style", "margin-top: 300px;");

    this.itemService.getAccessToken().subscribe((token) => {
      this.itemService.makePayments(this.orders_ID,this.users_ID,this.totalPrice,this.numberOfItems,token.access_token).subscribe(paymentResponse => {
        if(paymentResponse) {
          this.d_flex_element?.setAttribute("style", "background-color: rgba(0,0,0,0);display: none;position: absolute;width: 0%;height: 0%;z-index: 0;");
          this.spinner_border_element?.setAttribute("style", "display: none;background-color: rgba(0,0,0,0)");
          this.sr_only_element?.setAttribute("style","display: none");
          alert("Payment of $" + this.totalPrice + " was made successfully.");
          this.router.navigate(['/confirmation']);
        }
      });
    });
    
  }


  onChange(event:any): void {
    console.log(event);
    console.log("Entered data change");
  }
}
