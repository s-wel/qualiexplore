import { Component, OnInit } from '@angular/core'
import { NgForm } from '@angular/forms'
import { Router } from '@angular/router'
import { Observable } from 'rxjs'
import { AuthService } from './auth.service'
import { User } from './user.model'

@Component({
  selector: 'app-auth',
  templateUrl: './auth.component.html',
  styleUrls: ['./auth.component.css'],
})
export class AuthComponent implements OnInit {
  constructor(private authService: AuthService, private router: Router) {}

  isValidUserFlag = false
  isLoading = false
  invalid = false
  errorMessage: string;
  result: any
  usernameServer: any[] = null
  passwordServer: string = null

  ngOnInit() {
    const userData: {
      username: string
      _accessToken: string
      _accessTokenExpiration: string
    } = JSON.parse(localStorage.getItem('userData'))

    const loadedUser = this.authService.isAuth(userData)

    if (loadedUser?.token) {
      this.router.navigate(['./qualiexplore/filters'])
    }
  }

  onSubmit(form: NgForm) {
    this.isLoading = true
    const username = form.value.username
    const password = form.value.password
    let authObs: Observable<any>
    let validUserObs: Observable<any>

    validUserObs = this.authService.isValidUser(username, password)

    authObs = this.authService.login(username, password)

    validUserObs.subscribe(
      (result: any) => {
        console.log(result)
        this.usernameServer = result.data.users[0].users
        this.usernameServer.forEach((user) => {
          if (user.username == username && user.password == password ) {
              authObs.subscribe(
                (resData) => {
                  this.router.navigate(['./qualiexplore/filters'])
                  this.isLoading = false
                },
                (error) => {  
                },
              )
          }
          else{
            this.invalid = true
            this.isLoading = false
            this.errorMessage="Invalid Username or Password!"
            
          }
        })
      },
      (error) => {
        console.log(error)
      },
    )

    form.reset()
  }
}
