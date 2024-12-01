import { Component, OnInit, input } from '@angular/core';
import { AuthService } from '../../Shared/auth.service';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-users',
  templateUrl: './users.component.html',
  styleUrl: './users.component.scss'
})
export class UsersComponent implements OnInit {
  userPage!:any;
  loaded = false;
  inputPageNumber!:number
  inputPageSize:number = 10;
  constructor(protected auth:AuthService, private router:Router, private route:ActivatedRoute) {
    
  }
  ngOnInit(): void {
    this.route.params.subscribe(
      response => {
        this.loaded = false
        this.auth.getAllUsers(response['page'] || 1,  this.inputPageSize || 10).subscribe(
          response => {
            console.log(response)
            this.userPage = response
            this.loaded = true
            this.calculatePages()
          }
        )
      }
    )
    if (!this.auth.userloginCheck()) {
      this.router.navigate(['/'])
    } 
    
  }
  pages:any = []

  calculatePages() {
    this.pages = [];
    for (let i = 1; i * this.userPage.limit <= this.userPage.total; i++) {
      this.pages.push(i);
    }
    this.pages.push(this.pages[this.pages.length-1] + 1)
    console.log(this.pages)
  }
  navigate() {
    if (this.inputPageNumber > 0) {
      this.router.navigate([`/users/page/${this.inputPageNumber}`])
    }
  } 
  change() {
    this.ngOnInit()
  }
}
