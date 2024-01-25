import { Routes } from '@angular/router';
import { ProductListComponent } from './components/product-list/product-list.component';
import { ProductItemDetailComponent } from './components/product-item-detail/product-item-detail.component';
import { ProductItemComponent } from './components/product-item/product-item.component';
import { ConfirmationComponent } from './components/confirmation/confirmation.component';
import { CartComponent } from './components/cart/cart.component';
import { CheckoutComponent } from './components/checkout/checkout.component';

export const routes: Routes = [
    {path: '', component: ProductListComponent},
    {path: 'product-item-details/:id', component: ProductItemDetailComponent},
    {path: 'product-item', component: ProductItemComponent},
    {path: 'confirmation', component: ConfirmationComponent},
    {path: 'cart', component: CartComponent},
    {path: 'checkout', component: CheckoutComponent}
];
