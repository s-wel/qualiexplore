import { Component, OnDestroy, OnInit } from '@angular/core'
import { NgForm } from '@angular/forms'
import { Subscription } from 'rxjs'
import { AuthService } from '../auth/auth.service'

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css'],
})
export class HeaderComponent implements OnInit {
  isAuthenticated = false
  user: string = null
  updateButton = false

  constructor(private authService: AuthService) {}

  ngOnInit() {
    this.authService.user.subscribe((user) => {
      this.isAuthenticated = !!user
    })

    const userData = JSON.parse(localStorage.getItem('userData'))
    this.user = userData?.username
    if (this.user.toLowerCase().includes("admin") && this.isAuthenticated) {
      this.updateButton = true
    } else {
      this.updateButton = false
    }
  }

  onLogout() {
    this.authService.logout()
  }
}
