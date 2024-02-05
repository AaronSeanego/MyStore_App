import { Component, Input} from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HeaderComponent } from '../../layout/header/header.component';
import { RouterLink,RouterLinkActive, RouterModule } from '@angular/router';
import { Router } from '@angular/router';
import { ItemsService } from '../../services/items.service';
import { Route } from '@angular/router';
import { Product } from '../../models/products';
import { Orders } from '../../models/orders';
import { Users } from '../../models/users';

@Component({
  selector: 'app-product-list',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    HeaderComponent,
    RouterModule,
    RouterLinkActive,
    RouterLink
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

  constructor (public itemsService: ItemsService,private router: Router) {

  }

  ngOnInit():void {
    this.itemsService.getProducts().subscribe(products => {
      this.productList = products;
    })

    this.itemsService.getAccessToken().subscribe((token) => {
      this.itemsService.getAllOrders(token.access_token).subscribe((items:any) => {
        if(items?.documents.length > 0) {
          for(let i = 0; i < items?.documents.length; i++) {
            if(items?.documents[i].status == "Active") {
              this.numberOfOrder = this.numberOfOrder + parseInt(items?.documents[i].quantity);
            }
          }
        }else {
          document.querySelector(".card .text-center")?.setAttribute("style", "margin: 100px auto;width: 500px;display: none;");
        }

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
          // console.log(elements);
          this.itemsService.setSearchResults(elements);
          // this.router.navigate(['/product-item']);
        }
      });
    });

    console.log(this.searchTerm);
    // this.itemsService.setSearchResults(this.searchTerm);
    this.router.navigate(['/product-item']);
  }
}
