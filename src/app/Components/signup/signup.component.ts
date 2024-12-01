import { Component } from '@angular/core';
import { User } from '../../Shared/user.model';
import { AuthService } from '../../Shared/auth.service';
import { HttpErrorResponse } from '@angular/common/http';
import { Router } from '@angular/router';
@Component({
  selector: 'app-signup',
  templateUrl: './signup.component.html',
  styleUrl: './signup.component.scss'
})
export class SignupComponent {
  constructor(private auth:AuthService, private router:Router){}
  user:User = new User()
  errors:string[] = []
  submit() {
    this.errors = [];
    console.log(this.user)
    let form = document.querySelector('form')
    if (form?.checkValidity()) {
      this.auth.signUp(this.user).subscribe(
        (response) => {
          if (response != undefined) {
            console.log(response)
            alert('Sucessfully Signed Up');
            localStorage.setItem('user', JSON.stringify(response));
            this.router.navigate(['/signin'])
          }
        },
        (e: HttpErrorResponse) => {
          console.log(e);
          console.log(e.error.errorKeys);
          if (e.error.errorKeys.includes('errors.invalid_email')) {
            this.errors.push('Invalid Email')
          }
          if (e.error.errorKeys.includes('errors.invalid_phone_number')) {
            this.errors.push('Invalid Phone Number (Must start with a + and country code)')
          }
          if (e.error.errorKeys.includes('errors.password_too_short')) {
            this.errors.push('Password is too short')
          }
          if (e.error.errorKeys.includes('errors.password_too_long')) {
            this.errors.push('Password is too long')
          }
          if (e.error.errorKeys.includes('errors.invalid_avatar')) {
            this.errors.push('Invalid link for the avatar')
          }
          if (e.error.errorKeys.includes("errors.email_in_use")) {
            this.errors.push('Email is already in use')
          }
          scrollTo(0, 0)
        }
      );
    } else {
      form?.reportValidity()
    }
  }
}
