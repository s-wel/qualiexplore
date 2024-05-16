import { Component, OnInit, OnDestroy , AfterViewInit, ViewChild, AfterContentChecked} from '@angular/core'
import { NgForm } from '@angular/forms'
import { Router } from '@angular/router'
import { Observable, Subscription } from 'rxjs'
import { AuthService } from './auth.service'
import * as bcrypt from 'bcryptjs';



@Component({
  selector: 'app-auth',
  templateUrl: './auth.component.html',
  styleUrls: ['./auth.component.css'],
})


export class AuthComponent implements OnInit, OnDestroy, AfterViewInit{
  constructor(private authService: AuthService, private router: Router) {}

  @ViewChild('authForm', {static:true}) authForm:NgForm

  isValidUserFlag = false
  isLoading = false
  invalid = false
  errorMessage: string = null
  error:string = null
  result: any
  adminCheck: boolean = false
  usernameServer: any[] = null
  passwordServer: string = null
  subscription : Subscription

  ngOnInit() {

    
    
    const userData: {
      username: string
      _accessToken: string
      _accessTokenExpiration: string
    } = JSON.parse(localStorage.getItem('userData'))

    const loadedUser = this.authService.isAuth(userData)

    if (loadedUser?.token) {
      this.router.navigate(['./qualiexplore/start'])
    }
  }

  ngOnDestroy(){
      // console.log("OnDestroy Called")
  }


  ngAfterViewInit(){
    this.errorMessage=null;
    // console.log("After View!!");
  }


  onSubmit(form: NgForm) {
    this.isLoading = true
    let username = form.value.username
    this.usernameServer = username
    let password = form.value.password
    this.adminCheck = form.value.adminCheck
    let authObs: Observable<any>
    let validUserObs: Observable<any>

    if(this.adminCheck !== true){

      authObs = this.authService.loginRest(username, password);
      authObs.subscribe(
        (resData) => {
          const { accessToken, refreshToken, username, isAdmin } = resData;
          // Store tokens and user data in localStorage
          localStorage.setItem('accessToken', accessToken);
          localStorage.setItem('refreshToken', refreshToken);
          localStorage.setItem('userData', JSON.stringify({ username, isAdmin }));

          this.isLoading = false;
          this.errorMessage = null;
          this.router.navigate(['./qualiexplore/start']);
          this.authService.scheduleRefresh();
        },
        (error) => {
          this.isLoading = false;
          const errorMsg = error.error.error
          if(errorMsg){
            this.errorMessage = error.error.error
          }else{
            this.errorMessage = "DB Connection Error"
          }
         
          // console.log('Login Error:', error);
    
        }
      );

    } else {

      validUserObs = this.authService.isValidUser(username, password)

      authObs = this.authService.login(username, password)
  
      validUserObs.subscribe(
        (result: any) => {
          const users = result.data.users[0].users;
          // console.log("Result", result);
          // console.log("Users", users);
  
          const user = users.find((u: any) => u.username === username);
          if (user) {
            bcrypt.compare(password, user.password, (err, res) => {
              if (res) {
                authObs = this.authService.login(username, password);
                authObs.subscribe(
                  (resData) => {
                    // console.log("response:",resData);
                    
                    this.isLoading = false;
                    this.errorMessage = null;
                    // const accessToken = resData.data.login.accessToken;
                    // const refreshToken = resData.data.login.refreshToken;
                    // localStorage.setItem('accessToken', accessToken);
                    // localStorage.setItem('refreshToken', refreshToken);
                    this.router.navigate(['./qualiexplore/start']);
                    this.authService.scheduleRefresh();
                    // this.sessionService.setUserFromToken(accessToken);
                  },
                  (error) => {
                    this.isLoading = false;
                    this.errorMessage = 'DB Connection Error'
                    console.log('error', error);
                  }
                );
              } else {
                this.errorMessage = 'Invalid Credentials';
                this.isLoading = false;
              }
            });
          } else {
            this.errorMessage = 'Invalid Credentials';
            this.isLoading = false;
          }
        },
        (error) => {
          this.errorMessage = 'DB Connection Error';
          this.isLoading = false;
          console.log(error);
        }
      );


    }

   


    this.errorMessage = null;
    form.reset();
  }
}