import { HttpClient, HttpErrorResponse, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class CartService {
  authToken!:any
  authHeader!:HttpHeaders
  url = 'https://api.everrest.educata.dev/shop/cart'
  constructor(private http:HttpClient) {
    this.authToken = localStorage.getItem('access_token')
    this.authHeader = new HttpHeaders().set('Authorization', `Bearer ${this.authToken}`)
  }
  getCart() {
    return this.http.get(this.url, {
      headers: this.authHeader
    })
  }
  createCart(id:string, quantity = 1) {
    return this.http.post(`${this.url}/product`, {id: id, quantity: quantity}, {
      headers: this.authHeader
    })
  }
  addItem(id:string, quantity = 1) {
    return this.http.patch(`${this.url}/product`, {id: id, quantity: quantity}, {
      headers: this.authHeader
    })
  }
  removeItem(id:string) {
    return this.http.delete(`${this.url}/product`, {
      headers: this.authHeader,
      body: {id: id}
    })
  }
  deleteCart() {
    return this.http.delete(`${this.url}`, {
      headers: this.authHeader
    })
  }
  checkout() {
    return this.http.post(`${this.url}/checkout`, {}, {
      headers: this.authHeader
    })
  }
}
