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
      "collection": "Orders"
  });

    return this.http.post('https://data.mongodb-api.com/app/data-bzfbr/endpoint/data/v1/action/find',body,
     {headers: headers});
  }

  addNewOrders(name:string,price:BigInteger,quantity:string,url:string,description:string,token:string,status:string): Observable<any> {

    // console.log(name),
    // console.log(price),
    // console.log(quantity),
    // console.log(description),
    // console.log(url)

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
      "collection": "Orders",
      "document": {
        "name": name,
        "price": price,
        "quantity": quantity,
        "url": url,
        "description": description,
        "status": status,
        "user_id": user_id
      }
  });

    return this.http.post('https://data.mongodb-api.com/app/data-bzfbr/endpoint/data/v1/action/insertOne',body,
     {headers: headers});
  }

  updateOrder(id:any,token:string): Observable<any> {
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
      "filter": {"user_id": id.toString()},
    //   "update": { "$set": { "status": "Complete" } }
      "update": { "$set": { "status": "Complete" } }
    });

    
    return this.http.post('https://data.mongodb-api.com/app/data-bzfbr/endpoint/data/v1/action/updateMany',body,
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
