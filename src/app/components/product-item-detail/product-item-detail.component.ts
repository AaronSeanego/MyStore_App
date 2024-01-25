import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HeaderComponent } from '../../layout/header/header.component';
import { ActivatedRoute, RouterLink,RouterLinkActive } from '@angular/router';
import { RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { ItemsService } from '../../services/items.service';
import { Router } from '@angular/router';
import { Product } from '../../models/products';

@Component({
  selector: 'app-product-item-detail',
  standalone: true,
  imports: [
    CommonModule,
    HeaderComponent,
    RouterLink,
    RouterLinkActive,
    FormsModule
  ],
  templateUrl: './product-item-detail.component.html',
  styleUrl: './product-item-detail.component.css'
})
export class ProductItemDetailComponent {
  id:string = '';
  product_Items:Product[] = [];
  product:Product[] = [];
  quantity:string = '1';
  order:any = {};

  constructor(public itemsService: ItemsService,public route: ActivatedRoute,private router: Router) {

  }

  ngOnInit(): void {
    this.route.params.subscribe(params => {
      this.id = params['id'];
    });
    console.log(this.id);

    this.itemsService.getProducts().subscribe(products => {
      this.product_Items = products;
      this.product_Items.forEach(item => {
        if(item['id'] == parseInt(this.id)) {
          this.product.push(item);
        }
      });
    });

  }

  ngOnDestroy(): void {

  }

  addToCart(name:string,price: BigInteger,url:string,description: string): void {
    this.order = {
      name: name,
      price: price,
      quantity: this.quantity,
      url: url,
      description: description
    };

    console.log(this.order);
    this.itemsService.addItemsToCart(this.order);
    this.router.navigate(['/cart']);
  }
}
