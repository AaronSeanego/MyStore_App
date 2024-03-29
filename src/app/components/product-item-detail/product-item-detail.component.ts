import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HeaderComponent } from '../../layout/header/header.component';
import { ActivatedRoute, RouterLink,RouterLinkActive } from '@angular/router';
import { RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { ItemsService } from '../../services/items.service';
import { Router } from '@angular/router';
import { Product } from '../../models/products';
import { response } from 'express';

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
  
  d_flex_element:any;
  spinner_border_element:any;
  sr_only_element:any;
  card_element:any;

  orders_ID:any;
  users_ID:any;
  constructor(public itemsService: ItemsService,public route: ActivatedRoute,private router: Router) {

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
    }
  
    this.route.params.subscribe(params => {
      this.id = params['id'];
      localStorage.setItem("productId",this.id);
    });
    console.log(this.id);

    this.itemsService.getProducts().subscribe(products => {
      this.product_Items = products;
      this.product_Items.forEach(item => {
        if(item['id'] == parseInt(this.id)) {
          this.product.push(item);
          if(this.product.length > 0) {
            this.d_flex_element?.setAttribute("style", "background-color: rgba(0,0,0,0);display: none;position: absolute;width: 100%;height: 100%;z-index: 0;");
            this.spinner_border_element?.setAttribute("style", "display: none;background-color: rgba(0,0,0,0)");
            this.sr_only_element?.setAttribute("style","display: none");
          }else {
            
          }
        }
      });
    });

    this.itemsService.getAccessToken().subscribe((token) => {

      // this.itemsService.getAllProducts(token.access_token).subscribe(data => {
      //   console.log(data?.documents);
      //   this.product_Items = data?.documents;
      //   this.product_Items.forEach(item => {
      //     console.log(item);
      //     // if(item['_id'] == parseInt(this.id)) {
      //     //   this.product.push(item);
      //     // }
      //   });
      // });
      if(localStorage.getItem('orderID') == null || undefined) {
        
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

      // this.itemsService.getAllOrders(token.access_token).subscribe((items:any) => {
      //   if(items?.documents.length > 0) {
      //     for(let i = 0; i < items?.documents.length; i++) {
      //       if(items?.documents[i].status == "Active") {
      //         this.numberOfOrder = this.numberOfOrder + parseInt(items?.documents[i].quantity);
      //       }
      //     }
      //   }else {
      //     document.querySelector(".card .text-center")?.setAttribute("style", "margin: 100px auto;width: 500px;display: none;");
      //   }

      // });
    });

  }

  ngOnDestroy(): void {

  }

  addToCart(name:string,price: BigInteger,url:string,description: string): void {
    const status = "Active";

    this.itemsService.getAccessToken().subscribe(accessToken => {
      this.accessToken.push(accessToken.access_token);

      if(this.orders_ID == null || undefined) {
        this.d_flex_element?.setAttribute("style", "background-color: rgba(0,0,0,0.3);display: none;position: absolute;width: 100%;height: 100%;z-index: 999;");
        this.spinner_border_element?.setAttribute("style", "margin-top: 300px;");
        this.sr_only_element?.setAttribute("style","display: flex");
        this.itemsService.createNewOrder(this.users_ID,accessToken.access_token).subscribe(tokenData => {
          console.log(tokenData?.insertedId);
          localStorage.setItem("orderID",tokenData?.insertedId);
          if(response) {
            this.itemsService.addNewOrders(name,price,this.quantity,url,description,this.accessToken[0],status,this.orders_ID,localStorage.getItem("productId")).subscribe(response => {
              // this.results.push(response);
              console.log(response);
              if(response) {
                // this.router.navigate(['/cart']);
                this.d_flex_element?.setAttribute("style", "background-color: rgba(0,0,0,0);display: none;position: absolute;width: 100%;height: 100%;z-index: 0;");
                this.spinner_border_element?.setAttribute("style", "display: none;background-color: rgba(0,0,0,0)");
                this.sr_only_element?.setAttribute("style","display: none");
                alert("New item was successfully added to cart. Please navigate to the cart to checkout.");
                this.router.navigate(['/cart']);
              }
            });
          }
        });

      }else {
        this.d_flex_element?.setAttribute("style", "background-color: rgba(0,0,0,0.3);display: none;position: absolute;width: 100%;height: 100%;z-index: 999;");
        this.spinner_border_element?.setAttribute("style", "margin-top: 300px;");
        this.sr_only_element?.setAttribute("style","display: flex");
        this.itemsService.searchOrder(this.orders_ID,accessToken.access_token).subscribe(orderData => {
          // console.log(orderData?.insertedId);
          this.itemsService.addNewOrders(name,price,this.quantity,url,description,this.accessToken[0],status,this.orders_ID,localStorage.getItem("productId")).subscribe(response => {
            // this.results.push(response);
            console.log(response);
            if(response) {
              this.d_flex_element?.setAttribute("style", "background-color: rgba(0,0,0,0);display: none;position: absolute;width: 100%;height: 100%;z-index: 0;");
              this.spinner_border_element?.setAttribute("style", "display: none;background-color: rgba(0,0,0,0)");
              this.sr_only_element?.setAttribute("style","display: none");
              alert("New order with order number " + orderData?.insertedId + " was created successfully. Please navigate to the cart to checkout.");
              this.router.navigate(['/cart']);
            }
          });
        });
      }

      // this.itemsService.addNewOrders(name,price,this.quantity,url,description,this.accessToken[0],status,localStorage.getItem("orderID"),localStorage.getItem("productId")).subscribe(response => {
      //   // this.results.push(response);
      //   console.log(response);
      //   if(response) {
      //     // this.router.navigate(['/cart']);
      //   }
      // });

    });

  }
}
