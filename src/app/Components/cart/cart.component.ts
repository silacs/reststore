import { Component, OnInit } from '@angular/core';
import { CartService } from '../../Shared/cart.service';
import { ProductsService } from '../../Shared/products.service';
import { HttpErrorResponse } from '@angular/common/http';
import { AuthService } from '../../Shared/auth.service';

@Component({
  selector: 'app-cart',
  templateUrl: './cart.component.html',
  styleUrl: './cart.component.scss'
})
export class CartComponent implements OnInit {
  basket!:any
  loaded = false
  cartExists = false
  cartProducts:any[] = []
  constructor(private cart:CartService, private products:ProductsService, private auth:AuthService ) {}
  ngOnInit(): void {
    if (this.auth.userloginCheck()) {
      this.cart.getCart().subscribe(
        (response:any) => {
          this.cartExists = true
          this.basket = response
          console.log(this.basket)
          if (response.products.length == 0) {
            this.loaded = true
          } else {
            response.products.forEach((product:any, i: number) => {
              console.log(i)
              this.products.getProductById(product.productId).subscribe((response:any) => {
                response.price.current = (this.basket.products[i].pricePerQuantity * this.basket.products[i].quantity)
                this.cartProducts.push(response)
                this.loaded = true
                console.log(response)
              },
              (e: HttpErrorResponse) => {
                console.log(e)
                this.loaded = true
              }
            )
            })  
          }
        },
        (e: HttpErrorResponse) => {
          this.loaded = true
          console.log (e)
        }
      )
    }
  }
  checkout() {
    this.cart.checkout().subscribe(
      response => {
        console.log(response)
        location.reload()
      },
      (e: HttpErrorResponse) => console.log(e)
    )
  }
  changeQuantity(id:string, index:number, operation:string) {
    let oldprice = this.cartProducts[index].price.current
    if (operation == 'remove') {
      this.cart.addItem(id, this.basket.products[index].quantity - 1).subscribe(
        (response:any) => {
          console.log(response)
          this.basket.total.price.current = response.total.price.current
          this.cartProducts[index].price.current = (this.basket.products[index].pricePerQuantity * this.basket.products[index].quantity)
        },
        (e: HttpErrorResponse) => {
          console.log(e)
          this.cartProducts[index].price.current = oldprice
          this.basket.products[index].quantity += 1
        }
      )
      this.basket.products[index].quantity -= 1
    }
    if (operation == 'add') {
      this.cart.addItem(id, this.basket.products[index].quantity + 1).subscribe(
        (response:any) => {
          console.log(response)
          this.basket.total.price.current = response.total.price.current
          this.cartProducts[index].price.current = (this.basket.products[index].pricePerQuantity * this.basket.products[index].quantity)
        },
        (e: HttpErrorResponse) => {
          console.log(e)
          this.cartProducts[index].price.current = oldprice
          this.basket.products[index].quantity -= 1
        }
      )
      this.basket.products[index].quantity += 1
    }
  }
  deleteItem(i:number) {
    this.cart.removeItem(this.basket.products[i].productId).subscribe(
      response => {
        this.basket = response
      },
      (e: HttpErrorResponse) => {
        console.log(e)
      }
    )
  }
}
