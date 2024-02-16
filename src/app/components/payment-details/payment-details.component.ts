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
  constructor(private itemService: ItemsService,private router: Router) {

  }

  ngOnInit(): void {
    this.itemService.getAccessToken().subscribe((token) => {
      this.itemService.getAllNewOrders(localStorage.getItem("orderID"),token.access_token).subscribe(data => {
        for(let i = 0;i < data?.documents.length;i++) {
          if(data?.documents[i]._id == localStorage.getItem("orderID") && data?.documents[i].status == "Complete") {
            this.checkedValue = 'true';
          }else {
            this.checkedValue = 'false';
          }
        }

        if(this.checkedValue == "true") {
          this.itemService.getAllOrders(token.access_token).subscribe((items:any) => {
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

  newPayments(): void {
    document.querySelector(".d-flex")?.setAttribute("style", "background-color: rgba(0,0,0,0.3);display: none;position: absolute;width: 100%;height: 100%;z-index: 999;");
    document.querySelector(".spinner-border")?.setAttribute("style", "margin-top: 300px;");

    this.itemService.getAccessToken().subscribe((token) => {
      this.itemService.makePayments(localStorage.getItem("orderID"),localStorage.getItem("user_id"),this.totalPrice,this.numberOfItems,token.access_token).subscribe(paymentResponse => {
        if(paymentResponse) {
          document.querySelector(".d-flex")?.setAttribute("style", "background-color: rgba(0,0,0,0);display: none;position: absolute;width: 0%;height: 0%;z-index: 0;");
          document.querySelector(".spinner-border")?.setAttribute("style", "display: none;background-color: rgba(0,0,0,0)");
          document.querySelector(".sr-only")?.setAttribute("style","display: none");
          alert("Payment of $" + this.totalPrice + " was made successfully.");
          this.router.navigate(['/confirmation']);
        }
      });
    });
    
  }
}
