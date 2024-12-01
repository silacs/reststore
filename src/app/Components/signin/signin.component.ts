import { Component } from '@angular/core';
import { AuthService } from '../../Shared/auth.service';
import { HttpErrorResponse } from '@angular/common/http';
import { Router } from '@angular/router';

@Component({
  selector: 'app-signin',
  templateUrl: './signin.component.html',
  styleUrl: './signin.component.scss'
})
export class SigninComponent {
  constructor(private auth:AuthService, private router:Router) {
    if (auth.userloginCheck()) {
      router.navigate(['/'])
    }
  }
  user = {
    email: '',
    password: ''
  }
  error = ''
  submit() {
    let form = document.querySelector('form')
    if (form?.checkValidity()) {
      this.auth.signIn(this.user).subscribe(
        (response) => {
          console.log(response);
          localStorage.setItem('access_token', response.access_token);
          localStorage.setItem('refresh_token', response.refresh_token);
          this.auth.getCurrentUser()?.subscribe(
            response => {
              localStorage.setItem('user', JSON.stringify(response))
              this.router.navigate(['/'])
              location.reload()
            },
            (e: HttpErrorResponse) => {
              console.log(e)
              if (e.error.errorKeys.includes("errors.user_email_not_verified")) {
                localStorage.removeItem('access_token')
                localStorage.removeItem('refresh_token')
                localStorage.removeItem('user')
                this.error = 'Your email is not verified.'
              }
            }
          )
          
        },
        (e: HttpErrorResponse) => {
          console.log(e);
          if (e.error.errorKeys.includes('errors.incorrect_email_or_password')) {
            this.error = 'Your email or password is incorrect.'
          } else if (e.error.errorKeys.includes('errors.user_email_not_verified')) {
            this.error = 'Your email is not verified.'
          }
        }
      );
    } else {
      form?.reportValidity()
    }
  }
}
