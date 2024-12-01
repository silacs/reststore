import { Component, OnInit } from '@angular/core';
import { ProductsService } from '../../Shared/products.service';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-products',
  templateUrl: './products.component.html',
  styleUrl: './products.component.scss'
})
export class ProductsComponent implements OnInit {
  productsPage!:any;
  loaded = false;
  inputPageNumber!:number
  inputPageSize:number = 10;
  constructor(private products:ProductsService, private route:ActivatedRoute, private router:Router) {
    
  }
  ngOnInit(): void {
    this.route.params.subscribe(
      response => {
        this.loaded = false
        this.products.getAll(response['page'] || 1,  this.inputPageSize || 10).subscribe(
          response => {
            console.log(response)
            this.productsPage = response
            this.loaded = true
            this.calculatePages()
          }
        )
      }
    )
  }
  pages:any = []

  //for reversing the array without modifying the original
  calculatePages() {
    this.pages = [];
    for (let i = 1; i * this.productsPage.limit <= this.productsPage.total; i++) {
      this.pages.push(i);
    }
    if (  (this.inputPageSize == 10 && !(this.productsPage.total % 10 == 0)) ||
          (this.inputPageSize == 5 && !(this.productsPage.total % 5 == 0)) ||
          (this.inputPageSize == 15 && !(this.productsPage.total % 15 == 0)) ) {
            this.pages.push(this.pages[this.pages.length-1] + 1)
    }
    console.log(this.pages)
  }
  navigate() {
    if (this.inputPageNumber > 0) {
      this.router.navigate([`/products/page/${this.inputPageNumber}`])
    }
  } 
  change() {
    this.ngOnInit()
  }
}
