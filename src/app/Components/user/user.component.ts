import { Component } from '@angular/core';
import { AuthService } from '../../Shared/auth.service';
import { HttpErrorResponse, HttpHeaders } from '@angular/common/http';
import { User, UserInfo } from '../../Shared/user.model';
import { Router } from '@angular/router';

@Component({
  selector: 'app-user',
  templateUrl: './user.component.html',
  styleUrl: './user.component.scss'
})
export class UserComponent {
  userstr:any = localStorage.getItem('user')
  user = JSON.parse(this.userstr)
  passerrors:string[] = []
  infoerrors:string[] = []
  passwordReset = {
    oldPassword: '',
    newPassword: ''
  }
  constructor(private auth:AuthService, private router:Router) {
    if (auth.userloginCheck()) {
      auth.getCurrentUser()?.subscribe(
        response => localStorage.setItem('user', JSON.stringify(response)),
        (e: HttpErrorResponse) => console.log(e),
      )
    } else {
      router.navigate(['/signin'])
    }
  }
  submit() {
   this.infoerrors = []
   let form = document.querySelector('form')
   if (form?.checkValidity()) {
    this.auth.updateInfo(this.user).subscribe(
      response => {
        console.log(response)
        localStorage.setItem('user', JSON.stringify(response))
        this.auth.getCurrentUser()
        this.auth.getCurrentUser()
        alert('Successfully updated details.')
        this.router.navigate(['/'])
        setTimeout(() => {
          location.reload()
        }, 1000);
      },
      (e: HttpErrorResponse) => {
        console.log(e)
        if (e.error.errorKeys.includes('errors.invalid_email')) {
          this.infoerrors.push('Invalid Email')
        }
        if (e.error.errorKeys.includes('errors.invalid_phone_number')) {
          this.infoerrors.push('Invalid Phone Number (Must start with a + and country code)')
        }
        if (e.error.errorKeys.includes('errors.password_too_short')) {
          this.infoerrors.push('Password is too short')
        }
        if (e.error.errorKeys.includes('errors.password_too_long')) {
          this.infoerrors.push('Password is too long')
        }
        if (e.error.errorKeys.includes('errors.invalid_avatar')) {
          this.infoerrors.push('Invalid link for the avatar')
        }
        if (e.error.errorKeys.includes("errors.email_in_use")) {
          this.infoerrors.push('Email is already in use')
        }
        scrollTo(0, 0)
      }
    )
   } else {
    form?.reportValidity()
   }
   
  }
  changePass() {
    this.passerrors = []
    let form: any = document.querySelector('#changePass')
    if(form.checkValidity()) {
      this.auth.updatePassword(this.passwordReset).subscribe(
        (response:any) => {
          console.log(response)
          localStorage.setItem('access_token', response.access_token)
          localStorage.setItem('refresh_token', response.refresh_token)
        },
        (e: HttpErrorResponse) => {
          console.log(e)
          if (e.error.errorKeys.includes("errors.old_password_incorrect")) {
            this.passerrors.push('Old Password is Incorrect.')
          }
          if (e.error.errorKeys.includes("errors.password_too_short")) {
            this.passerrors.push('New Password is too short.')
          }
          if (e.error.errorKeys.includes("errors.password_too_long")) {
            this.passerrors.push('New Password is too long.')
          }
          if (e.error.errorKeys.includes("errors.new_password_matches_old")) {
            this.passerrors.push('New password cannot be the same as the old one')
          }
        }
      )
    } else {
      form.reportValidity()
    }
  }
  deleteAccount() {
    let choice = prompt('Are you sure you want to delete your account?')
    if (choice?.toLowerCase().replaceAll(' ', '') == 'yes') {
      this.auth.deleteAccount().subscribe(
        (response:any) => {
          if (response.acknowledged === true) {
            alert('Sucessfully deleted account.')
            this.auth.signOut()
          } else {
            alert('Something went wrong')
          }
        },
        (e: HttpErrorResponse) => console.log(e)
      )
    } else if (choice?.toLowerCase().replaceAll(' ', '') == 'no' || choice === null) {

    } else {
      alert('Your answer must be "Yes" or "No"')
    }
  }
}
