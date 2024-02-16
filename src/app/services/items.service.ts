import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpClient} from '@angular/common/http';
import { writeJsonFile } from 'write-json-file';
// import fs from 'fs-extra';
import fs, { chownSync } from 'fs';
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
  webToken: any = [];

  constructor(private http: HttpClient) {
    this.webToken = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJiYWFzX2RldmljZV9pZCI6IjAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMCIsImJhYXNfZG9tYWluX2lkIjoiNjViYjViZTg4MzllOGNiYTBmOGZjMmNmIiwiZXhwIjoxNzA2ODcxNjU2LCJpYXQiOjE3MDY4Njk4NTYsImlzcyI6IjY1YmNjNDYwMGZjNDdhYmJkMzFlMWVjZCIsInN0aXRjaF9kZXZJZCI6IjAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMCIsInN0aXRjaF9kb21haW5JZCI6IjY1YmI1YmU4ODM5ZThjYmEwZjhmYzJjZiIsInN1YiI6IjY1YmI3N2FlN2NjMGI5OWMwYWVhNzY4ZSIsInR5cCI6ImFjY2VzcyJ9.M8yJFG-lCBJykB8XM9j44sA69JA2MdzTqrMLtzL_Wyg';
  }

  getProducts(): Observable<any> {
    return this.http.get('../assets/data.json');
  }

  setWebToken(token: string): void {
    this.webToken = token;
    // console.log(this.webToken);
  }

  getAllCategories(token:string): Observable<any> {
    const headers = {
      'content-type': 'application/json',
      'access-control-request-headers': '*',
      // 'api-key': 'kH03wCLH2g9ExTFTtJkLAQHvhdjEmQ2qotDWxliIB437S9inFLLvpjlJcqrq3cAX',
      'authorization': 'Bearer ' + token,
      'accept': 'application/json'
    }

    const body = JSON.stringify({
      "dataSource": "MyStoreCluster",
      "database": "MyStoreApp-Db",
      "collection": "Categories"
    });

    return this.http.post('https://data.mongodb-api.com/app/data-bzfbr/endpoint/data/v1/action/find',body,
     {headers: headers});
  }

  getAllProducts(token:string): Observable<any> {
    const headers = {
      'content-type': 'application/json',
      'access-control-request-headers': '*',
      // 'api-key': 'kH03wCLH2g9ExTFTtJkLAQHvhdjEmQ2qotDWxliIB437S9inFLLvpjlJcqrq3cAX',
      'authorization': 'Bearer ' + token,
      'accept': 'application/json'
    }

    const body = JSON.stringify({
      "dataSource": "MyStoreCluster",
      "database": "MyStoreApp-Db",
      "collection": "Products"
    });

    return this.http.post('https://data.mongodb-api.com/app/data-bzfbr/endpoint/data/v1/action/find',body,
     {headers: headers});
  }

  getAccessToken(): Observable<any> {
    
    const headers = {
      'content-type': 'application/json'
    }

    const body = JSON.stringify({
      "username": "Man",
      "password": "man@12345"
    });

    return this.http.post('https://realm.mongodb.com/api/client/v2.0/app/data-bzfbr/auth/providers/local-userpass/login',body,
    {headers: headers});
  }

  addNewLogin(email:string,password:string) : Observable<any> {

    console.log(email);
    console.log(password);

    const headers = {
      'content-type': 'application/json'
    }

    const body = JSON.stringify({
      "username": email,
      "password": password
    });

    return this.http.post('https://realm.mongodb.com/api/client/v2.0/app/data-bzfbr/auth/providers/local-userpass/login',body,
    {headers: headers});
  }


  getAllUser(): Observable<any> {

    const headers = {
      'content-type': 'application/json',
      'access-control-request-headers': '*',
      // 'api-key': 'kH03wCLH2g9ExTFTtJkLAQHvhdjEmQ2qotDWxliIB437S9inFLLvpjlJcqrq3cAX',
      'authorization': 'Bearer ' + this.webToken,
      'accept': 'application/json'
    }

    const body = JSON.stringify({
      "dataSource": "MyStoreCluster",
      "database": "MyStoreApp-Db",
      "collection": "Users"
  });

    return this.http.post('https://data.mongodb-api.com/app/data-bzfbr/endpoint/data/v1/action/find',body,
     {headers: headers});
  }

  addNewUsers(firstname:string,lastname:string,email:string,password:string,address:string,token:string): Observable<any> {
    const headers = {
      'content-type': 'application/json',
      'access-control-request-headers': '*',
      // 'api-key': 'kH03wCLH2g9ExTFTtJkLAQHvhdjEmQ2qotDWxliIB437S9inFLLvpjlJcqrq3cAX',
      'authorization': 'Bearer ' + token,
      'accept': 'application/json'
    }

    const body = JSON.stringify({
      "dataSource": "MyStoreCluster",
      "database": "MyStoreApp-Db",
      "collection": "Users",
      "document": {
        "firstname": firstname,
        "lastname": lastname,
        "email": email,
        "password": password,
        "address": address
      }
  });

    return this.http.post('https://data.mongodb-api.com/app/data-bzfbr/endpoint/data/v1/action/insertOne',body,
    {headers: headers});
  }

  searchOrder(orderID:any,token:string): Observable<any> {

    const headers = {
      'content-type': 'application/json',
      'access-control-request-headers': '*',
      // 'api-key': 'kH03wCLH2g9ExTFTtJkLAQHvhdjEmQ2qotDWxliIB437S9inFLLvpjlJcqrq3cAX',
      'authorization': 'Bearer ' + token,
      'accept': 'application/json'
    }

    const body = JSON.stringify({
      "dataSource": "MyStoreCluster",
      "database": "MyStoreApp-Db",
      "collection": "Orders",
      "filter": { "_id": "ObjectId('" + orderID + "')"}
    });

    return this.http.post('https://data.mongodb-api.com/app/data-bzfbr/endpoint/data/v1/action/findOne',body,
    {headers: headers});
  }
  
  searchUser(email:string,password:string,token:string): Observable<any> {

    console.log(email);
    console.log(password);

    const headers = {
      'content-type': 'application/json',
      'access-control-request-headers': '*',
      // 'api-key': 'kH03wCLH2g9ExTFTtJkLAQHvhdjEmQ2qotDWxliIB437S9inFLLvpjlJcqrq3cAX',
      'authorization': 'Bearer ' + token,
      'accept': 'application/json'
    }

    const body = JSON.stringify({
      "dataSource": "MyStoreCluster",
      "database": "MyStoreApp-Db",
      "collection": "Users",
      "filter": { "email": email.toString(),"password": password.toString()}
    });

    return this.http.post('https://data.mongodb-api.com/app/data-bzfbr/endpoint/data/v1/action/findOne',body,
    {headers: headers});
  }
  
  getAllOrders(token:string): Observable<any> {
    const headers = {
      'content-type': 'application/json',
      'access-control-request-headers': '*',
      // 'api-key': 'kH03wCLH2g9ExTFTtJkLAQHvhdjEmQ2qotDWxliIB437S9inFLLvpjlJcqrq3cAX',
      'authorization': 'Bearer ' + token,
      'accept': 'application/json'
    }

    const body = JSON.stringify({
      "dataSource": "MyStoreCluster",
      "database": "MyStoreApp-Db",
      "collection": "OrderedProducts"
  });

    return this.http.post('https://data.mongodb-api.com/app/data-bzfbr/endpoint/data/v1/action/find',body,
     {headers: headers});
  }

  getAllNewOrders(orderId:any,token:string): Observable<any> {
    const headers = {
      'content-type': 'application/json',
      'access-control-request-headers': '*',
      // 'api-key': 'kH03wCLH2g9ExTFTtJkLAQHvhdjEmQ2qotDWxliIB437S9inFLLvpjlJcqrq3cAX',
      'authorization': 'Bearer ' + token,
      'accept': 'application/json'
    }

    const body = JSON.stringify({
      "dataSource": "MyStoreCluster",
      "database": "MyStoreApp-Db",
      "collection": "Orders"
    });

    return this.http.post('https://data.mongodb-api.com/app/data-bzfbr/endpoint/data/v1/action/find',body,
    {headers: headers});
  }

  getAllItems(token:string): Observable<any> {
    const headers = {
      'content-type': 'application/json',
      'access-control-request-headers': '*',
      // 'api-key': 'kH03wCLH2g9ExTFTtJkLAQHvhdjEmQ2qotDWxliIB437S9inFLLvpjlJcqrq3cAX',
      'authorization': 'Bearer ' + token,
      'accept': 'application/json'
    }

    const body = JSON.stringify({
      "dataSource": "MyStoreCluster",
      "database": "MyStoreApp-Db",
      "collection": "Products"
    });

    return this.http.post('https://data.mongodb-api.com/app/data-bzfbr/endpoint/data/v1/action/find',body,
    {headers: headers});
  }

  createNewOrder(user_id:any,token: string): Observable<any> {
    const headers = {
      'content-type': 'application/json',
      'access-control-request-headers': '*',
      // 'api-key': 'kH03wCLH2g9ExTFTtJkLAQHvhdjEmQ2qotDWxliIB437S9inFLLvpjlJcqrq3cAX',
      'authorization': 'Bearer ' + token,
      'accept': 'application/json'
    }

    const body = JSON.stringify({
      "dataSource": "MyStoreCluster",
      "database": "MyStoreApp-Db",
      "collection": "Orders",
      "document": {
        "status": "Active",
        "user_id": user_id,
        "total_quantity": 0,
        "total_price": 0
      }
  });

    return this.http.post('https://data.mongodb-api.com/app/data-bzfbr/endpoint/data/v1/action/insertOne',body,
    {headers: headers});
  }

  updateNewOrderInfo(orderID:any,totalPrice:number,totalProducts:number,token:string): Observable<any> {
    const headers = {
      'content-type': 'application/json',
      'access-control-request-headers': '*',
      // 'api-key': 'kH03wCLH2g9ExTFTtJkLAQHvhdjEmQ2qotDWxliIB437S9inFLLvpjlJcqrq3cAX',
      'authorization': 'Bearer ' + token,
      'accept': 'application/json'
    }

    const body = JSON.stringify({
      "dataSource": "MyStoreCluster",
      "database": "MyStoreApp-Db",
      "collection": "Orders",
      "filter": {"_id": {"$oid": orderID.toString() }},
    //   "update": { "$set": { "status": "Complete" } }
      "update": { "$set": { "total_quantity": totalProducts , "total_price": totalPrice },}
    });

    return this.http.post('https://data.mongodb-api.com/app/data-bzfbr/endpoint/data/v1/action/updateOne',body,
    {headers: headers});
  }

  updateNewOrderStatus(orderID:any,token:string): Observable<any> {
    const headers = {
      'content-type': 'application/json',
      'access-control-request-headers': '*',
      // 'api-key': 'kH03wCLH2g9ExTFTtJkLAQHvhdjEmQ2qotDWxliIB437S9inFLLvpjlJcqrq3cAX',
      'authorization': 'Bearer ' + token,
      'accept': 'application/json'
    }

    const body = JSON.stringify({
      "dataSource": "MyStoreCluster",
      "database": "MyStoreApp-Db",
      "collection": "Orders",
      "filter": {"_id": {"$oid": orderID }},
    //   "update": { "$set": { "status": "Complete" } }
      "update": { "$set": { "status": "Complete" } }
    });

    return this.http.post('https://data.mongodb-api.com/app/data-bzfbr/endpoint/data/v1/action/updateOne',body,
    {headers: headers});
  }

  addNewOrders(name:string,price:BigInteger,quantity:string,url:string,description:string,token:string,status:string,orderId:any,product_id:any): Observable<any> {

    let user_id:any;
    if(localStorage.getItem('user_id')) {
      user_id = localStorage.getItem('user_id');
    }else {
      user_id = "";
    }

    const headers = {
      'content-type': 'application/json',
      'access-control-request-headers': '*',
      // 'api-key': 'kH03wCLH2g9ExTFTtJkLAQHvhdjEmQ2qotDWxliIB437S9inFLLvpjlJcqrq3cAX',
      'authorization': 'Bearer ' + token,
      'accept': 'application/json'
    }

    const body = JSON.stringify({
      "dataSource": "MyStoreCluster",
      "database": "MyStoreApp-Db",
      "collection": "OrderedProducts",
      "document": {
        "name": name,
        "price": price,
        "quantity": quantity,
        "url": url,
        "description": description,
        "order_id": orderId,
        "product_id": product_id
      }
  });

    return this.http.post('https://data.mongodb-api.com/app/data-bzfbr/endpoint/data/v1/action/insertOne',body,
     {headers: headers});
  }

  updateOrder(order_id:any,user_id:any,token:string): Observable<any> {
    const headers = {
      'content-type': 'application/json',
      'access-control-request-headers': '*',
      // 'api-key': 'kH03wCLH2g9ExTFTtJkLAQHvhdjEmQ2qotDWxliIB437S9inFLLvpjlJcqrq3cAX',
      'authorization': 'Bearer ' + token,
      'accept': 'application/json'
    }

    const body = JSON.stringify({
      "dataSource": "MyStoreCluster",
      "database": "MyStoreApp-Db",
      "collection": "Orders",
      "filter": {"_id": {"$oid": order_id }},
    //   "update": { "$set": { "status": "Complete" } }
      "update": { "$set": { "user_id": user_id } }
    });

    
    return this.http.post('https://data.mongodb-api.com/app/data-bzfbr/endpoint/data/v1/action/updateOne',body,
     {headers: headers});
  }

  deleteItem(itemID:string,token:string): Observable<any> {
    const headers = {
      'content-type': 'application/json',
      'access-control-request-headers': '*',
      // 'api-key': 'kH03wCLH2g9ExTFTtJkLAQHvhdjEmQ2qotDWxliIB437S9inFLLvpjlJcqrq3cAX',
      'authorization': 'Bearer ' + token,
      'accept': 'application/json'
    }

    const body = JSON.stringify({
      "dataSource": "MyStoreCluster",
      "database": "MyStoreApp-Db",
      "collection": "OrderedProducts",
      "filter": {"_id": {"$oid": itemID }}
    });

    return this.http.post('https://data.mongodb-api.com/app/data-bzfbr/endpoint/data/v1/action/deleteOne',body,
    {headers: headers});
  }


  makePayments(order_id:any,user_id:any,total_price:number,number_of_items:number,token:string): Observable<any> {
    const headers = {
      'content-type': 'application/json',
      'access-control-request-headers': '*',
      // 'api-key': 'kH03wCLH2g9ExTFTtJkLAQHvhdjEmQ2qotDWxliIB437S9inFLLvpjlJcqrq3cAX',
      'authorization': 'Bearer ' + token,
      'accept': 'application/json'
    }

    const body = JSON.stringify({
      "dataSource": "MyStoreCluster",
      "database": "MyStoreApp-Db",
      "collection": "Payments",
      "document": {
        "order_id": order_id,
        "user_id": user_id,
        "number_of_items": number_of_items,
        "total_price": total_price,
        "status": "Pending"
      }
  });

    return this.http.post('https://data.mongodb-api.com/app/data-bzfbr/endpoint/data/v1/action/insertOne',body,
     {headers: headers});
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
    // console.log(this.orders);
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
