import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HeaderComponent } from '../../layout/header/header.component';
import { FormsModule } from '@angular/forms';
import { Router,RouterLink,RouterLinkActive } from '@angular/router';
import { Routes } from '@angular/router';
import { ItemsService } from '../../services/items.service';
import { Product } from '../../models/products';

@Component({
  selector: 'app-product-item',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    HeaderComponent,
    RouterLink,
    RouterLinkActive
  ],
  templateUrl: './product-item.component.html',
  styleUrl: './product-item.component.css'
})
export class ProductItemComponent {

  item:Product[] = [];
  searchedItem:Product[] = [];

  constructor(public itemService: ItemsService) {

  }

  ngOnInit(): void {
    // this.item = this.itemService.getSearchResults();
    this.item = this.itemService.getSearchResults();
    console.log(this.itemService.getSearchResults());
    // this.searchedItem = this.itemService.getSearchResults();
    // console.log(this.searchedItem);
  }
}
