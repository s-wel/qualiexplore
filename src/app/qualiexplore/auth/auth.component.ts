import { Component, OnInit, OnDestroy , AfterViewInit, ViewChild, AfterContentChecked} from '@angular/core'
import { NgForm } from '@angular/forms'
import { Router } from '@angular/router'
import { Observable, Subscription } from 'rxjs'
import { AuthService } from './auth.service'
import { User } from './user.model'



@Component({
  selector: 'app-auth',
  templateUrl: './auth.component.html',
  styleUrls: ['./auth.component.css'],
})


export class AuthComponent implements OnInit, OnDestroy, AfterViewInit, AfterContentChecked{
  constructor(private authService: AuthService, private router: Router) {}

  @ViewChild('authForm', {static:true}) authForm:NgForm

  isValidUserFlag = false
  isLoading = false
  invalid = false
  errorMessage: string = null
  error:string = null
  result: any
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
      this.router.navigate(['./qualiexplore/filters'])
    }
  }

  ngOnDestroy(){
      
      // this.subscription.unsubscribe();
  }
  ngAfterContentChecked(){
    // this.errorMessage = null
  }

  ngAfterViewInit(){
    this.errorMessage=null;
    // console.log("After View!!");
  }

  onSubmit(form: NgForm) {
    this.isLoading = true
    let username = form.value.username
    let password = form.value.password
    let authObs: Observable<any>
    let validUserObs: Observable<any>

    validUserObs = this.authService.isValidUser(username, password)

    authObs = this.authService.login(username, password)

 validUserObs.subscribe(
      (result: any) => {
        //console.log("valid user :",result)
        this.usernameServer = result.data.users[0].users
        // console.log("Users:",this.usernameServer);
        for( let elem of this.usernameServer){
          if(elem.username === username){
            if(elem.password === password){
              authObs.subscribe(
                (resData) => {
                  this.isLoading = false
                  this.router.navigate(['./qualiexplore/filters'])
                },
                (error) => {
                  this.isLoading = false
                  // this.errorMessage = "Error";
                  console.log("error", error);
                },
              )
            }
            else{
              this.errorMessage = "Invalid Credentials"
              this.isLoading = false
            }
          }
           
          else{
            // this.errorMessage = "invalid"
            this.isLoading = false
          }  
        
        }
        
  },
  (error) => {
    console.log(error)
    this.isLoading = false;
  },
  )
       
    form.reset()
  
  }
}
