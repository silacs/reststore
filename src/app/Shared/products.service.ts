import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class ProductsService {
  url = 'https://api.everrest.educata.dev/shop/products'
  constructor(private http:HttpClient) { }
  getAll(pageIndex = 1, pageSize = 10) {
    return this.http.get(`${this.url}/all?page_index=${pageIndex}&page_size=${pageSize}`)
  }
  getProductById(id:string) {
    return this.http.get(`${this.url}/id/${id}`)
  }
  search(queryParams:any) {
    console.log(`${this.url}/search${queryParams}`)
    return this.http.get(`${this.url}/search${queryParams}`)
  }
  getBrands(){
    return this.http.get(`${this.url}/brands`)
  }
  rateProduct(rating:number, productId:string) {
    if (rating > 0 && rating < 6) {
      return this.http.post(`${this.url}/rate`, {
        productId: productId,
        rate: rating
      }, {
        headers: new HttpHeaders().set('Authorization', `Bearer ${localStorage.getItem('access_token')}`)
      })
    } else {
      alert('Rating must be between 1 and 5')
    }
  }
}
