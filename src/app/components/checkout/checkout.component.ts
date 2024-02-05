import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { ItemsService } from '../../services/items.service';
import { Users } from '../../models/users';
import { HeaderComponent } from '../../layout/header/header.component';
import { Orders } from '../../models/orders';

@Component({
  selector: 'app-checkout',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    RouterLink,
    RouterLinkActive,
    HeaderComponent
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

  constructor (public itemsService: ItemsService,private router: Router) {

  }

  ngOnInit(): void {

    
    if(localStorage.getItem('user_id') != null || undefined) {
      document.querySelector(".signIn-container")?.setAttribute("style", "display: none;");
      document.querySelector(".card")?.setAttribute("style", "display: none;");
      document.querySelector(".items-container")?.setAttribute("style", "display: block;margin-top: 20px");
    }else {

    }

    // this.ordersList = this.itemsService.getOrders();

    this.itemsService.getAccessToken().subscribe((token) => {
      this.access_Token = token.access_token;
    });

    this.itemsService.setWebToken(this.access_Token);

    this.itemsService.getAccessToken().subscribe(accessToken => {
      this.accessToken.push(accessToken.access_token);
      // this.itemsService.addNewOrders(name,price,this.quantity,url,description,this.accessToken[0]).subscribe(response => {
      //   // this.results.push(response);
      //   console.log(response);
      // });
    });

    this.itemsService.getAccessToken().subscribe((token) => {
      this.itemsService.getAllOrders(token.access_token).subscribe((items:any) => {
        if(items?.documents.length > 0) {
          for(let i = 0; i < items?.documents.length; i++) {
            if(items?.documents[i].status == "Active") {
              this.ordersList.push(items?.documents[i]);
              this.numberOfOrder = this.numberOfOrder + parseInt(items?.documents[i].quantity);
            }
          }
        }else {
          document.querySelector(".card .text-center")?.setAttribute("style", "margin: 100px auto;width: 500px;display: none;");
        }

      });
    });
  }

  registerName(): void {
    this.usersInfor = this.itemsService.addUsers(this.firstName, this.lastName, this.email, this.password, this.physicaladdress);
    console.log(this.usersInfor);

    this.itemsService.addNewLogin(this.email,this.password).subscribe(data => {
      console.log(data);
    });

    this.itemsService.getAccessToken().subscribe(accessToken => {
      // console.log(accessToken.access_token);
      this.accessToken.push(accessToken.access_token);
      console.log(this.accessToken[0]);
      this.itemsService.addNewUsers(this.firstName,this.lastName,this.email,this.password,this.physicaladdress,accessToken.access_token).subscribe(usersData => {
        if(usersData) {
          document.querySelector(".card")?.setAttribute("style", "display: none;");
          document.querySelector(".items-container")?.setAttribute("style", "display: block;margin-top: 20px");
        }
      });
    });

  }

  viewRegisterForm(): void {
    document.querySelector(".signIn-container")?.setAttribute("style", "display: none;");
    document.querySelector(".card")?.setAttribute("style", "display: block;margin: 100px auto;width: 30rem");
  }

  signIn(): void {

      this.itemsService.getAccessToken().subscribe(accessToken => {
        // console.log(accessToken.access_token);
        this.accessToken.push(accessToken.access_token);
        console.log(this.accessToken[0]);

        this.itemsService.searchUser(this.user_email,this.user_password,accessToken.access_token).subscribe(userResults => {
          this.userResulstsObject.push(userResults);

          if(userResults == undefined) {
            alert("Username does not exist. Please register user");
            document.querySelector(".signIn-container")?.setAttribute("style", "display: none;");
            document.querySelector(".card")?.setAttribute("style", "display: block;margin: 100px auto;width: 30rem");
          }else {
            document.querySelector(".signIn-container")?.setAttribute("style", "display: none;");
            document.querySelector(".items-container")?.setAttribute("style", "display: block;margin-top: 20px");
            console.log(userResults?.document);
            console.log(userResults?.document._id);
            this.loggedInEmail = userResults?.document.email;
            this.loggedInFirstname = userResults?.document.firstlast;
            this.loggedinLastname = userResults?.document.lastname;
            this.loggedInUserId = userResults?.document._id;
            localStorage.setItem('user_id',this.loggedInUserId);
            localStorage.setItem('first name',this.loggedInFirstname);
            localStorage.setItem('last name',this.loggedinLastname);
            localStorage.setItem('email',this.loggedInEmail);
          }
        });
      });
  }

  checkoutItems(): void {

    this.itemsService.getAccessToken().subscribe(accessToken => {
      // console.log(accessToken.access_token);
      this.accessToken.push(accessToken.access_token);
      console.log(this.accessToken[0]);

      this.itemsService.updateOrder(localStorage.getItem('user_id'),accessToken.access_token).subscribe(updateResults => {
        console.log(updateResults);
        if(updateResults) {
          this.router.navigate(['/confirmation']);
        }
      });

    });
    this.itemsService.setCheckout({checkout: "true"});
    // this.router.navigate(['/confirmation']);
  }

}
