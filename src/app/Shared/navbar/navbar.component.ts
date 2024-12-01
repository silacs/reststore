import { Component } from '@angular/core';
import { AuthService } from '../auth.service';
import { HttpClient, HttpErrorResponse, HttpHeaders } from '@angular/common/http';
import { CartService } from '../cart.service';
import { ProductsService } from '../products.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrl: './navbar.component.scss',
})
export class NavbarComponent {
  showMenu = false;
  showCart = false;
  cartLoaded = false;
  hasCart = false;
  loggedin = false;
  jsonUser: any = localStorage.getItem('user');
  user = JSON.parse(this.jsonUser);
  basket!:any
  cartProducts:any[] = []
  constructor(private auth: AuthService, private cart: CartService, private products: ProductsService, private router:Router) {
    if (auth.userloginCheck()) {
      this.loggedin = true;
      auth.refreshToken();
      auth.getCurrentUser()?.subscribe(
        (response) => {
          localStorage.setItem('user', JSON.stringify(response));
        },
        (e: HttpErrorResponse) => {
          console.log(e);
        }
      )
      auth.refreshToken()
      cart.getCart().subscribe(
        response => {
          this.hasCart = true;
        }, 
        (e: HttpErrorResponse) => {
          if (e.error.errorKeys.includes("errors.user_has_no_cart")) {
            this.hasCart = false;
          } else {
            console.log(e)
          }
        } 
      )
    }
  }
  toggleUser() {
    if (this.showMenu == false) {
      this.showCart = false;
      this.showMenu = true
    } else {
      this.showMenu = false;
    }
  }
  signOut() {
    this.auth.signOut()
  }
  toggleCart() {
    if (this.showCart == false) {
      this.showCart = true
      this.showMenu = false;
      this.cartLoaded = false;
      this.cart.getCart().subscribe(
        (cart:any) => {
          console.log(cart)
          this.basket = cart
          if (cart.products.length > 0) {
            cart.products.forEach((product:any) => {
              this.products.getProductById(product.productId).subscribe(
                (response:any) => {
                  let contains = false
                  this.cartProducts.forEach(product => {
                    if (product._id == response._id) {
                      contains = true
                    }
                  })
                  if (!contains) {
                    this.cartProducts.push(response)
                  }
                  this.cartLoaded = true
                  console.log(this.cartProducts)
                }
              )
            })
          } else {
            this.cartLoaded = true
          }
        },
        (e: HttpErrorResponse) => console.log(e)
      )
    }
  }
  closeCart() {
    setTimeout(() => {
      this.showCart = false;
    }, 100);
  }
  deleteItem(id:string) {
    this.cart.removeItem(id).subscribe(
      response =>  {
        console.log(response)
        for (let i = 0; i < this.cartProducts.length; i++) {
          if (this.cartProducts[i]._id == id) {
            this.cartProducts.splice(i, 1);
          }
        }
        this.showCart = false
        this.toggleCart()
      }
    )
  }
  checkout() {
    this.cart.checkout().subscribe(
      response => {
        console.log(response)
        location.reload()
      },
      (e: HttpErrorResponse) => {console.log(e)}
    )
  }
  keywords!:string;
  search(keyword:string) {
    this.router.navigate(['/search'], {
      queryParams: {keywords: keyword},
      queryParamsHandling: 'merge'
    })
  }
  changeQuantity(id:string, index:number, operation:string) {
    if (operation == 'remove') {
      this.cart.addItem(id, this.basket.products[index].quantity - 1).subscribe(
        (response:any) => {
          console.log(response)
          this.basket.total.price.current = response.total.price.current
        },
        (e: HttpErrorResponse) => {
          console.log(e)
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
        },
        (e: HttpErrorResponse) => {
          console.log(e)
          this.basket.products[index].quantity -= 1
        }
      )
      this.basket.products[index].quantity += 1
    }
  }
  bMenuShown = false
  toggleburger() {
    if(this.bMenuShown) {
      this.bMenuShown = false
    } else {
      this.bMenuShown = true
    }
  }
  roundPrice() {
    return Math.round(this.basket.total.price.current * 100) / 100
  }
}
