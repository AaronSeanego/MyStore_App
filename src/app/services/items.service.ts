import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpClient} from '@angular/common/http';
import { writeJsonFile } from 'write-json-file';
// import fs from 'fs-extra';
import fs from 'fs';
import { writeFileSync } from 'fs-extra';

@Injectable({
  providedIn: 'root'
})
export class ItemsService {

  orders:any = [];
  users:any = [];
  searchTerm:any = [];
  checkoutArray:any = [];
  usersList:any = [];
  checkoutValue:any = [];

  constructor(private http: HttpClient) {

  }

  getProducts(): Observable<any> {
    return this.http.get('../assets/data.json');
  }

  addUsers(firsname:string,lastname:string,email:string,password:string,address:string): any {
    this.usersList = {
      firstname: firsname,
      lastname: lastname,
      email: email,
      password: password,
      address: address
    };

    return this.usersList;
  }

  getUsers():any {
    return this.usersList;
  }

  addItemsToCart(order:any):void {
    const jsonString = JSON.stringify(order);
    // console.log(jsonString);
    this.orders.push(order);
    console.log(this.orders);
  }

  getOrders(): any {
    return this.orders;
  }

  setSearchResults(results:any): void {
    // const searchStuff = JSON.stringify(results);
    // console.log(results);
    this.searchTerm.push(results);
    // console.log(this.searchTerm);
  }

  getSearchResults(): any {
    return this.searchTerm;
  }

  setCheckout(checkout:any):void {
    this.checkoutValue.push(checkout);
  }

  getCheckout(): any {
    return this.checkoutValue;
  }
}
