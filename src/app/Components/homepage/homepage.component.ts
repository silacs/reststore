import { Component } from '@angular/core';
import { AuthService } from '../../Shared/auth.service';
import { HttpErrorResponse } from '@angular/common/http';

@Component({
  selector: 'app-homepage',
  templateUrl: './homepage.component.html',
  styleUrl: './homepage.component.scss'
})
export class HomepageComponent {
  constructor(private auth:AuthService) {  }
  getUser() {
    this.auth.getCurrentUser()?.subscribe(
      response => console.log(response),
      (e: HttpErrorResponse) => console.log(e)
    )
  }
  refresh() {
    this.auth.refreshToken()
  }
  signout() {
    this.auth.signOut()
  }
}
