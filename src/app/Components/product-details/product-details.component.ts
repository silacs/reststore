import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ProductsService } from '../../Shared/products.service';
import { CartService } from '../../Shared/cart.service';
import { HttpErrorResponse } from '@angular/common/http';
import { AuthService } from '../../Shared/auth.service';

@Component({
  selector: 'app-product-details',
  templateUrl: './product-details.component.html',
  styleUrl: './product-details.component.scss'
})
export class ProductDetailsComponent implements OnInit {
  product!:any
  loaded = false
  imageIndex = 0;
  cartExists = false;
  quantity = 1;
  constructor(private route:ActivatedRoute, protected products:ProductsService, protected cart:CartService, protected auth:AuthService, protected router:Router) {}
  ngOnInit(): void {
    this.route.params.subscribe(
      data => {
        this.loaded = false;
        this.products.getProductById(data['id']).subscribe(
          response => {
            this.product = response;
            console.log(this.product)
            this.cart.getCart().subscribe(
              response => {
                this.cartExists = true
                this.loaded = true
                if(this.auth.userloginCheck()) {
                  this.auth.getCurrentUser()?.subscribe(
                    (response:any) => {
                      this.product.ratings.forEach((rating:any) => {
                        if (rating.userId == response._id) {
                          this.getCheckedStars(rating.value - 1)
                        }
                      })
                    }
                  )
                }
              },
              (e: HttpErrorResponse) => {
                this.loaded = true
                if(this.auth.userloginCheck()) {
                  this.auth.getCurrentUser()?.subscribe(
                    (response:any) => {
                      this.product.ratings.forEach((rating:any) => {
                        if (rating.userId == response._id) {
                          this.getCheckedStars(rating.value - 1)
                        }
                      })
                    }
                  )
                }
                if (e.error.errorKeys.includes("errors.user_has_no_cart")) {
                  this.cartExists = false;
                }
              }
            )
          }
        )
      }
    )
  }
  imageLoader(index:any) {
    this.imageIndex = index
  }
  createCart(id:string, quantity = 1) {
    this.cart.createCart(id, quantity).subscribe(
      response => {
        console.log(response)
        this.cartExists = true;
        location.reload()
      },
      (e: HttpErrorResponse) => {
        console.log(e)
        if (e.error.errorKeys.includes("errors.user_cart_already_exists")) {
          this.cartExists = true
          this.addItem(id, quantity)
        }
      }
    )
  }
  addItem(id:string, quantity = 1) {
    this.cart.addItem(id, quantity).subscribe(
      response => {
        console.log(response)
      },
      (e: HttpErrorResponse) => {
        console.log(e)
      }
    )
  }
  prevLink:any = '/products'
  getPrevLink() {
    if (sessionStorage.getItem('prev') == null) {
      return false
    } else {
      this.prevLink = sessionStorage.getItem('prev')
      return true
    }
  }
  
  getCheckedStars(index:number) {
    let stars:any = document.querySelectorAll('input.fa-regular.fa-star')
    stars.forEach((star:any) => {
      star.checked = false;
    })
    for (let i = 0; i <= index; i++) {
      stars[i].checked = true
    }
  }
  rateProduct(rating:number) {
    this.products.rateProduct(rating, this.product._id)?.subscribe(
      response => {
        console.log(response)
        setTimeout(() => {
          location.reload()
        }, 300);
      },
      (e: HttpErrorResponse) => {
        console.log(e)
      }
    )
  }
  getDate(issueDate:string) {
    let date = new Date(issueDate)
    return `${date.getDate()}/${date.getMonth()}/${date.getFullYear()}`
  }
}
