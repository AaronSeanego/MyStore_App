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

  usersInfor:any = [];
  ordersList:Orders[] = [];
  constructor (public itemsService: ItemsService,private router: Router) {

  }

  ngOnInit(): void {
    // this.itemsService.getOrders();
    this.ordersList = this.itemsService.getOrders();
  }

  registerName(): void {
    this.usersInfor = this.itemsService.addUsers(this.firstName, this.lastName, this.email, this.password, this.physicaladdress);
    console.log(this.usersInfor);
    if(this.usersInfor != null) {
      document.querySelector(".card")?.setAttribute("style", "display: none;");
      document.querySelector(".items-container")?.setAttribute("style", "display: block;margin-top: 20px");
    }
  }

  checkoutItems(): void {
    this.itemsService.setCheckout({checkout: "true"});
    this.router.navigate(['/confirmation']);
  }

}
