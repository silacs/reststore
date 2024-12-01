import { Component } from '@angular/core';
import { AuthService } from '../../Shared/auth.service';
import { HttpErrorResponse } from '@angular/common/http';

@Component({
  selector: 'app-verify-email',
  templateUrl: './verify-email.component.html',
  styleUrl: './verify-email.component.scss'
})
export class VerifyEmailComponent {
  constructor(private auth:AuthService){}
  message = ''
  email = ''
  verify() {
    this.auth.verifyEmail(this.email).subscribe(
      (response:any) => this.message = response.message,
      (e: HttpErrorResponse) => {
        console.log(e)
        if (e.error.errorKeys.includes("errors.already_verified")) {
          this.message = 'You are already verified.'
        }
      }
    )
  }
}
