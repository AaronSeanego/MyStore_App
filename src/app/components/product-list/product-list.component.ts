import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HeaderComponent } from '../../layout/header/header.component';
import { RouterLink,RouterLinkActive, RouterModule } from '@angular/router';
import { Router } from '@angular/router';
import { ItemsService } from '../../services/items.service';
import { Route } from '@angular/router';
import { Product } from '../../models/products';

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
  constructor (public itemsService: ItemsService,private router: Router) {

  }

  ngOnInit():void {
    this.itemsService.getProducts().subscribe(products => {
      this.productList = products;
    })

    this.productList.forEach((items) => {
      console.log(items);
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
