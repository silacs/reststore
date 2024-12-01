import { Component } from '@angular/core';
import { AuthService } from '../../Shared/auth.service';
import { HttpErrorResponse } from '@angular/common/http';

@Component({
  selector: 'app-recovery',
  templateUrl: './recovery.component.html',
  styleUrl: './recovery.component.scss'
})
export class RecoveryComponent {
  constructor(private auth:AuthService) {}
  message = ''
  email = ''
  recover() {
    this.auth.recoverPassword(this.email).subscribe(
      (response:any) => this.message = response.message,
      (e: HttpErrorResponse) => console.log(e)
    )
  }
}
