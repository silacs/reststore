import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { AuthService } from '../../Shared/auth.service';

@Component({
  selector: 'app-user-details',
  templateUrl: './user-details.component.html',
  styleUrl: './user-details.component.scss'
})
export class UserDetailsComponent implements OnInit {
  user!:any
  loaded = false
  constructor(private route:ActivatedRoute, private auth:AuthService) {
    
  }
  ngOnInit(): void {
    this.route.params.subscribe(
      data => {
        this.auth.getUserById(data['id']).subscribe(
          response => {
            this.loaded = true
            this.user = response
            console.log(this.user)
          }
        )
      }
    )
  }
}
