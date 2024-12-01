import { Component, OnInit, input } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ProductsService } from '../../Shared/products.service';
import { HttpErrorResponse } from '@angular/common/http';
import { merge } from 'rxjs';

@Component({
  selector: 'app-search',
  templateUrl: './search.component.html',
  styleUrl: './search.component.scss'
})
export class SearchComponent implements OnInit {
  loaded = false;
  productsPage!:any
  inputPageSize = 10;
  inputPageNumber = 1;

  //Advanced Search Parameters
  keywords = ''
  brand = ''
  categoryId = ''
  price_min = 1
  price_max = 9999
  sort_by = 'price'
  sort_direction = 'asc'
  constructor(private route:ActivatedRoute, protected products:ProductsService, private router:Router) {}
  ngOnInit(): void {
    this.route.queryParams.subscribe(
      response => {
        this.loaded = false
        this.keywords = response['keywords']
        let page_size = response['page_size'] || 10
        let page = response['page'] || 1

        this.categoryId = response['category'] || ''
        this.brand = response['brand'] || ''
        this.price_min = response['price_min'] || 1
        this.price_max = response['price_max'] || 99999
        this.sort_by = response['sort_by'] || 'price'
        this.sort_direction = response['sort_dir'] || 'asc'

        console.log(response)
        this.products.search(`?keywords=${this.keywords}&page_size=${page_size}&page_index=${page}&category_id=${this.categoryId}&brand=${this.brand}&price_min=${this.price_min}&price_max=${this.price_max}&sort_by=${this.sort_by}&sort_direction=${this.sort_direction}`).subscribe(
          (response:any) => {
            this.productsPage = response
            console.log(this.productsPage)
            this.calculatePages()
            this.loaded = true
          },
          (e: HttpErrorResponse) => {
            console.log(e)
            this.loaded = true
          }
        )
      }
    )
    this.getBrands()
  }

  pages:any = []

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
  }
  navigate() {
    if (this.inputPageNumber > 0) {
      this.router.navigate([`/search`], {
        queryParams: {page: this.inputPageNumber},
        queryParamsHandling: 'merge'
      })
    }
  } 
  change() {
    this.router.navigate(['/search'], {
      queryParams: {
        page_size: this.inputPageSize,
        category: this.categoryId,
        brand: this.brand,
        price_min: this.price_min,
        price_max: this.price_max,
        sort_by: this.sort_by,
        sort_dir: this.sort_direction
      },
      queryParamsHandling: 'merge'
    })
  }

  brands!:any
  brandsLoaded = false

  getBrands() {
    this.brandsLoaded = false
    this.products.getBrands().subscribe(
      response => {
        console.log(response)
        this.brandsLoaded = true
        this.brands = response
      },
      (e: HttpErrorResponse) => {
        console.log(e)
      }
    )
  }
  advancedShown = false;
  toggleAdvanced() {
    if (this.advancedShown) {
      this.advancedShown = false;
    } else {
      this.advancedShown = true;
    }
  }
  
  resetDisabled = true;
  resetOptions() {
    this.router.navigate(['/search'], {
      queryParams: {
        keywords: this.keywords
      }
    })
  }
}
