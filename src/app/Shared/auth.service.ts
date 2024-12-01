import { HttpClient, HttpErrorResponse, HttpHeaderResponse, HttpHeaders, HttpResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
@Injectable({
  providedIn: 'root',
})
export class AuthService {
  url = 'https://api.everrest.educata.dev/auth';
  constructor(private http: HttpClient, private router:Router) {}
  signUp(user: any) {
    return this.http.post<any>(this.url + '/sign_up', user)
  }

  signIn(user: any) {
    return this.http.post<any>(this.url + '/sign_in', user);
  }

  signOut() {
    localStorage.removeItem('access_token');
    localStorage.removeItem('refresh_token');
    localStorage.removeItem('user')
    location.reload()
  }

  // Deprecated as the service now uses localstorage instead of cookies
  getCookie(cookieName: string) {
    let cookies = document.cookie.split(';').map((cookie) => cookie.trim());
    let returned: any = false;
    for (let cookie of cookies) {
      if (cookie.startsWith(cookieName + '=')) {
        returned = cookie.split('=')[1];
      }
    }
    return !returned ? false : returned;
  }

  userloginCheck() {
    if (localStorage.getItem('refresh_token') == null) {
      return false;
    } else {
      return true
    }
  }
  
  getCurrentUser() {
    if (this.userloginCheck()) {
      return this.http.get(this.url, {
          headers: new HttpHeaders().set('Authorization', `Bearer ${localStorage.getItem('access_token')}`)
        })
    }
  }

  refreshToken() {
    if(this.userloginCheck()) {
      let refreshToken:any = localStorage.getItem('refresh_token')
      this.http.post<any>(this.url + '/refresh', '', {
        headers: new HttpHeaders().set('refresh_token', refreshToken),
        withCredentials: true
      }).subscribe(
        response => {
          localStorage.setItem('access_token', response.access_token)
        },
        (e: HttpErrorResponse) => {console.log(e)}
      )
    }
  }
  verifyEmail(email:string) {
    return this.http.post(`${this.url}/verify_email`, {email: email})
  }
  recoverPassword(email:string) {
    return this.http.post(`${this.url}/recovery`, {email: email})
  }
  updateInfo(user:any) {
    return this.http.patch(`${this.url}/update`, user, {
      headers: new HttpHeaders().set('Authorization', `Bearer ${localStorage.getItem('access_token')}`)
    })
  }
  updatePassword(passwords:any) {
    return this.http.patch(`${this.url}/change_password`, passwords, {
      headers: new HttpHeaders().set('Authorization', `Bearer ${localStorage.getItem('access_token')}`)
    })
  }
  deleteAccount() {
    return this.http.delete(`${this.url}/delete`, {
      headers: new HttpHeaders().set('Authorization', `Bearer ${localStorage.getItem('access_token')}`)
    })
  }
  getAllUsers(page_index:number = 1, page_size:number = 10) {
    return this.http.get<any>(`${this.url}/all?page_index=${page_index}&page_size=${page_size}`, {
      headers: new HttpHeaders().set('Authorization', `Bearer ${localStorage.getItem('access_token')}`)
    })
  }
  getUserById(userId:string) {
    return this.http.get<any>(`${this.url}/id/${userId}`, {
      headers: new HttpHeaders().set('Authorization', `Bearer ${localStorage.getItem('access_token')}`)
    })
  }
}