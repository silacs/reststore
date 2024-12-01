import { Component } from '@angular/core';
import { AuthService } from './Shared/auth.service';
import { HttpErrorResponse } from '@angular/common/http';
import { interval } from 'rxjs';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent {
  title = 'Singularity';
  needsVerification = false
  constructor(private auth:AuthService) {
    if (auth.userloginCheck()) {
      auth.refreshToken()
      auth.getCurrentUser()?.subscribe(
        response => {
          localStorage.setItem('user', JSON.stringify(response))
        },
        (e: HttpErrorResponse) => {
          if (e.error.errorKeys.includes("errors.user_email_not_verified")) {
            this.needsVerification = true
          }
        }
      )
    }
    interval(3600000).subscribe(
      refresh => {
        console.log('hello')
        this.auth.refreshToken() 
      }
    )
  }

}
