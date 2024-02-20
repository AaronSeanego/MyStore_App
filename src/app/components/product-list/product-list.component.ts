import { Component, Inject, Input} from '@angular/core';
import { CommonModule, DOCUMENT } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HeaderComponent } from '../../layout/header/header.component';
import { RouterLink,RouterLinkActive, RouterModule } from '@angular/router';
import { Router } from '@angular/router';
import { ItemsService } from '../../services/items.service';
import { Route } from '@angular/router';
import { Product } from '../../models/products';
import { Orders } from '../../models/orders';
import { Users } from '../../models/users';
import { SideMenuComponent } from '../../layout/side-menu/side-menu.component';

@Component({
  selector: 'app-product-list',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    HeaderComponent,
    RouterModule,
    RouterLinkActive,
    RouterLink,
    SideMenuComponent
  ],
  templateUrl: './product-list.component.html',
  styleUrl: './product-list.component.css'
})
export class ProductListComponent {

  
  productList:Product[] = [];
  searchTerm:Product[] = [];
  numberOfOrder:number = 0;
  orders:Orders[] = [];
  listOfUsers: Users[] = [];
  access_Token:any = [];
  checkedValue:string = '';
  listOfIDs:any = [];

  orders_ID:any;
  users_ID:any;
  d_flex_element:any;
  spinner_border_element:any;
  sr_only_element:any;
  card_element:any;

  constructor (@Inject(DOCUMENT) private document: Document,public itemsService: ItemsService,private router: Router) {

  }

  ngOnInit():void {

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

    this.itemsService.getProducts().subscribe(products => {
      this.productList = products;
      
      if(this.productList.length > 0) {
        
        this.d_flex_element?.setAttribute("style", "background-color: rgba(0,0,0,0);display: none;position: absolute;width: 100%;height: 100%;z-index: 0;");
        this.spinner_border_element?.setAttribute("style", "display: none;background-color: rgba(0,0,0,0)");
        this.sr_only_element?.setAttribute("style","display: none");
      }
    })

    this.itemsService.getAccessToken().subscribe((token) => {
      this.itemsService.getAllItems(token.access_token).subscribe(itemList => {
        // console.log(itemList?.documents);
        // this.productList = itemList?.documents;
        for(let i = 0; i < itemList?.documents.length; i++) {
          // this.productList.push(itemList?.documents[i]._id);
          this.listOfIDs.push(itemList?.documents[i]._id);
        }
        // document.querySelector(".d-flex")?.setAttribute("style", "background-color: rgba(0,0,0,0);display: none;position: absolute;width: 100%;height: 100%;z-index: 0;");
        // document.querySelector(".spinner-border")?.setAttribute("style", "display: none;background-color: rgba(0,0,0,0)");
        // document.querySelector(".sr-only")?.setAttribute("style","display: none");
        // console.log(this.productList);
      });

      if(this.orders_ID == null || undefined) {
        
      }else {
        this.itemsService.getAllOrders(token.access_token).subscribe((items:any) => {
          if(items?.documents.length > 0) {
            for(let i = 0; i < items?.documents.length; i++) {
              if(items?.documents[i].order_id == this.orders_ID) {
                this.numberOfOrder = this.numberOfOrder + parseInt(items?.documents[i].quantity);
              }
            }
          }else {
            this.card_element?.setAttribute("style", "margin: 100px auto;width: 500px;display: none;");
          }
  
        });
      }

      this.itemsService.getAllCategories(token.access_token).subscribe(data => {
        // console.log(data?.documents);
        // this.productList = data?.documents;
      });
    });
    
  }

  ngOnDestroy():void {
    
  }

  searchItems(itermName:string):void {
    console.log(itermName);
    this.itemsService.getProducts().subscribe(products => {
      this.productList = products;
      this.productList.forEach(elements => {

        if(elements['name'] == itermName) {
          this.searchTerm.push(elements);
          this.itemsService.setSearchResults(elements);
          // this.router.navigate(['/product-item']);
        }
      });
    });

    // console.log(this.searchTerm);
    // this.itemsService.setSearchResults(this.searchTerm);
    this.router.navigate(['/product-item']);
  }
}
