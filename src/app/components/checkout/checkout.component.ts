import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { ItemsService } from '../../services/items.service';
import { Users } from '../../models/users';
import { HeaderComponent } from '../../layout/header/header.component';
import { Orders } from '../../models/orders';
import { PaymentDetailsComponent } from '../payment-details/payment-details.component';

@Component({
  selector: 'app-checkout',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    RouterLink,
    RouterLinkActive,
    HeaderComponent,
    PaymentDetailsComponent
  ],
  templateUrl: './checkout.component.html',
  styleUrl: './checkout.component.css'
})
export class CheckoutComponent {
  email: string = '';
  password: string = '';
  firstName: string = '';
  lastName: string = '';
  physicaladdress: string = '';

  user_email:string = '';
  user_password:string = '';

  usersInfor:any = [];
  ordersList:Orders[] = [];
  access_Token:string = '';
  newOrders:any = {};
  accessToken:any = [];
  userResulstsObject:any = [];

  loggedInEmail:string = '';
  loggedInFirstname:string = '';
  loggedinLastname:string = '';
  loggedInUserId:string = '';
  numberOfOrder:number = 0;
  checkedValue:string = '';
  totalPrice:number = 0;

  d_flex_element:any;
  spinner_border_element:any;
  sr_only_element:any;
  card_element:any;

  signIn_element:any;
  items_element:any;

  orders_ID:any;
  users_ID:any;
  constructor (public itemsService: ItemsService,private router: Router) {

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
      this.signIn_element = document.querySelector(".signIn-container");
      this.items_element = document.querySelector(".items-container");
  }

    if(this.orders_ID == null || undefined) {
      this.router.navigate(['/']);
    }

    if(this.users_ID != null || undefined) {
      this.signIn_element?.setAttribute("style", "display: none;");
      this.card_element?.setAttribute("style", "display: none;");
      this.items_element?.setAttribute("style", "display: block;margin-top: 20px");
    }else {

    }


    this.itemsService.getAccessToken().subscribe((token) => {
      this.access_Token = token.access_token;
    });

    this.itemsService.getAccessToken().subscribe((token) => {
      // console.log(token.access_token);
      this.itemsService.getAllNewOrders(this.orders_ID,token.access_token).subscribe(data => {
        for(let i = 0;i < data?.documents.length;i++) {
          console.log(data?.documents[i]._id);
          if(data?.documents[i]._id == this.orders_ID && data?.documents[i].status == "Active") {
            this.checkedValue = 'true';
          }else {
            this.checkedValue = 'false';
          }
        }

        if(this.checkedValue == "true") {
          this.itemsService.getAllOrders(token.access_token).subscribe((items:any) => {
            
            if(items?.documents.length > 0) {
              for(let i = 0; i < items?.documents.length; i++) {
                if(items?.documents[i].order_id == this.orders_ID) {
                  this.ordersList.push(items?.documents[i]);
                  // this.numberOfOrder = this.numberOfOrder + parseInt(items?.documents[i].quantity);
                  // this.totalPrice = this.totalPrice + items?.documents[i].price;
                  // this.totalPrice = this.totalPrice + (items?.documents[i].price * parseInt(items?.documents[i].quantity));
                  this.totalPrice = parseFloat(this.totalPrice + (items?.documents[i].price * parseInt(items?.documents[i].quantity)).toFixed(4));
                }
              }
              this.d_flex_element?.setAttribute("style", "background-color: rgba(0,0,0,0);display: none;position: absolute;width: 0%;height: 0%;z-index: 0;");
              this.spinner_border_element?.setAttribute("style", "display: none;background-color: rgba(0,0,0,0);z-index: 0;");
              this.sr_only_element?.setAttribute("style","display: none;z-index: 0;");
            }else {
              this.d_flex_element?.setAttribute("style", "background-color: rgba(0,0,0,0);display: none;position: absolute;width: 0%;height: 0%;z-index: 0;");
              this.spinner_border_element?.setAttribute("style", "display: none;background-color: rgba(0,0,0,0);z-index: 0;");
              this.sr_only_element?.setAttribute("style","display: none;z-index: 0;");
              this.card_element?.setAttribute("style", "margin: 100px auto;width: 500px;display: none;");
            }
            this.totalPrice = parseFloat((this.totalPrice * this.numberOfOrder).toFixed(4));
            this.itemsService.updateNewOrderInfo(this.orders_ID,this.totalPrice,this.numberOfOrder,token.access_token).subscribe(data => {
              console.log(data);
            });
          });
        }else {
          this.card_element?.setAttribute("style", "margin: 100px auto;width: 500px;display: none;");
        }
      });

    });
  }

  registerName(): void {
    this.d_flex_element?.setAttribute("style", "background-color: rgba(0,0,0,0.3);display: none;position: absolute;width: 100%;height: 100%;z-index: 999;");
    this.spinner_border_element?.setAttribute("style", "margin-top: 300px;");
    this.usersInfor = this.itemsService.addUsers(this.firstName, this.lastName, this.email, this.password, this.physicaladdress);

    this.itemsService.addNewLogin(this.email,this.password).subscribe(data => {
      console.log(data);
    });

    this.itemsService.getAccessToken().subscribe(accessToken => {
      this.accessToken.push(accessToken.access_token);
      this.itemsService.addNewUsers(this.firstName,this.lastName,this.email,this.password,this.physicaladdress,accessToken.access_token).subscribe(usersData => {
        // console.log(usersData);
        if(usersData) {

          this.card_element?.setAttribute("style", "display: none;");
          this.items_element?.setAttribute("style", "display: block;margin-top: 20px");
          this.itemsService.updateOrder(this.orders_ID,usersData?.documents._id,accessToken.access_token).subscribe(updateResults => {
            console.log(updateResults);
          });
          this.d_flex_element?.setAttribute("style", "background-color: rgba(0,0,0,0);display: none;position: absolute;width: 0%;height: 0%;z-index: 0;");
          this.spinner_border_element?.setAttribute("style", "display: none;background-color: rgba(0,0,0,0);z-index: 0;");
          this.sr_only_element?.setAttribute("style","display: none;z-index: 0;");
          alert("Create account was created sucessfully.");
        }
      });
    });

  }

  viewRegisterForm(): void {
    this.signIn_element?.setAttribute("style", "display: none;");
    this.card_element?.setAttribute("style", "display: block;margin: 100px auto;width: 30rem");
  }

  signIn(): void {

      this.itemsService.getAccessToken().subscribe(accessToken => {
        this.d_flex_element?.setAttribute("style", "background-color: rgba(0,0,0,0.3);display: none;position: absolute;width: 100%;height: 100%;z-index: 999;");
        this.spinner_border_element?.setAttribute("style", "margin-top: 300px;");
        // console.log(accessToken.access_token);
        this.accessToken.push(accessToken.access_token);
        console.log(this.accessToken[0]);

        this.itemsService.searchUser(this.user_email,this.user_password,accessToken.access_token).subscribe(userResults => {
          this.userResulstsObject.push(userResults);

          if(userResults == undefined) {
            alert("Username does not exist. Please register user");
            this.spinner_border_element?.setAttribute("style", "display: none;");
            this.card_element?.setAttribute("style", "display: block;margin: 100px auto;width: 30rem");
          }else {
            this.signIn_element?.setAttribute("style", "display: none;");
            this.items_element?.setAttribute("style", "display: block;margin-top: 20px");
            // console.log(userResults?.document);
            // console.log(userResults?.document._id);
            this.loggedInEmail = userResults?.document.email;
            this.loggedInFirstname = userResults?.document.firstlast;
            this.loggedinLastname = userResults?.document.lastname;
            this.loggedInUserId = userResults?.document._id;
            localStorage.setItem('user_id',this.loggedInUserId);
            localStorage.setItem('first name',this.loggedInFirstname);
            localStorage.setItem('last name',this.loggedinLastname);
            localStorage.setItem('email',this.loggedInEmail);

            this.itemsService.updateOrder(this.orders_ID,this.users_ID,accessToken.access_token).subscribe(updateResults => {
              console.log(updateResults);
            });
            this.d_flex_element?.setAttribute("style", "background-color: rgba(0,0,0,0);display: none;position: absolute;width: 0%;height: 0%;z-index: 0;");
            this.spinner_border_element?.setAttribute("style", "display: none;background-color: rgba(0,0,0,0);z-index: 0;");
            this.sr_only_element?.setAttribute("style","display: none;z-index: 0;");
            alert("User logged in sucessfully.");
          }
        });
      });
  }

  checkoutItems(): void {
    // this.router.navigate(['/payment-details']);
    this.itemsService.getAccessToken().subscribe(accessToken => {
      this.d_flex_element?.setAttribute("style", "background-color: rgba(0,0,0,0.3);display: none;position: absolute;width: 100%;height: 100%;z-index: 999;");
      this.spinner_border_element?.setAttribute("style", "margin-top: 300px;");
      this.accessToken.push(accessToken.access_token);

      this.itemsService.updateNewOrderStatus(this.orders_ID,accessToken.access_token).subscribe(response => {
        if(response) {
          this.d_flex_element?.setAttribute("style", "background-color: rgba(0,0,0,0);display: none;position: absolute;width: 0%;height: 0%;z-index: 0;");
          this.spinner_border_element?.setAttribute("style", "display: none;background-color: rgba(0,0,0,0);z-index: 0;");
          this.sr_only_element?.setAttribute("style","display: none;z-index: 0;");
          this.router.navigate(['/payment-details']);
        }
      });
      
    });
  }

  onChange(event:any): void {
    console.log(event);
    console.log("Entered data change");
  }

}
