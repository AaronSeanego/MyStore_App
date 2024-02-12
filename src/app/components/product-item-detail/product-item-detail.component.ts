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
  accessToken:any = [];
  results:any = [];
  numberOfOrder:number = 0;

  constructor(public itemsService: ItemsService,public route: ActivatedRoute,private router: Router) {

  }

  ngOnInit(): void {
    this.route.params.subscribe(params => {
      this.id = params['id'];
    });
    console.log(this.id);

    // this.itemsService.getProducts().subscribe(products => {
    //   this.product_Items = products;
    //   this.product_Items.forEach(item => {
    //     if(item['id'] == parseInt(this.id)) {
    //       this.product.push(item);
    //     }
    //   });
    // });

    this.itemsService.getAccessToken().subscribe((token) => {

      this.itemsService.getAllProducts(token.access_token).subscribe(data => {
        console.log(data?.documents);
        this.product_Items = data?.documents;
        this.product_Items.forEach(item => {
          console.log(item);
          // if(item['_id'] == parseInt(this.id)) {
          //   this.product.push(item);
          // }
        });
      });

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

  ngOnDestroy(): void {

  }

  addToCart(name:string,price: BigInteger,url:string,description: string): void {
    const status = "Active";

    this.order = {
      name: name,
      price: price,
      quantity: this.quantity,
      url: url,
      description: description
    };

    console.log(this.order);
    this.itemsService.addItemsToCart(this.order);

    this.itemsService.getAccessToken().subscribe(accessToken => {
      // console.log(accessToken.access_token);
      this.accessToken.push(accessToken.access_token);
      console.log(this.accessToken[0]);
      this.itemsService.addNewOrders(name,price,this.quantity,url,description,this.accessToken[0],status).subscribe(response => {
        // this.results.push(response);
        console.log(response);
        if(response) {
          // this.router.navigate(['/cart']);
        }
      });
    });

    // localStorage.setItem('user_id','Hello, World Man');
    // localStorage.removeItem('user_id');
    this.router.navigate(['/cart']);
  }
}
