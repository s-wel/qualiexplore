import { Injectable } from '@angular/core'
import { Router } from '@angular/router'
import { Apollo, gql } from 'apollo-angular'
import { BehaviorSubject, onErrorResumeNext, Subject, throwError } from 'rxjs'
import { User } from './user.model'
import { catchError, tap } from 'rxjs/operators'

@Injectable({ providedIn: 'root' })
export class AuthService {
  userValidFlag = false
  accessToken: string = null
  refreshToken: string = null
  user = new BehaviorSubject<User>(null)
  usernameServer: string = null
  passwordServer: string = null
  private tokenExpirationTimer: any

  constructor(private apollo: Apollo, private router: Router) {}

  isValidUser(username: string, password: string): any {
    const userQuery = gql`
      query {
        users {
          users {
            username
            password
          }
        }
      }
    `

    return this.apollo.watchQuery({
      query: userQuery,
    }).valueChanges
  }

  login(username: string, password: string) {
    const authTokenQuery = gql`
      mutation auth($username: String!, $password: String!) {
        login(password: $password, username: $username) {
          accessToken
        }
      }
    `

    return this.apollo
      .mutate({
        mutation: authTokenQuery,
        variables: {
          username: username,
          password: password,
        },
      })
      .pipe(catchError(errorRes =>{
        console.log("there:", errorRes);
        let errorMessage = "Error Occured"
        if(!errorRes.error || !errorRes.error.error){
          return throwError(errorMessage);
        }
        return throwError(errorRes);
      }),
        tap((result: any) => {
          const accessTokenExpiration = new Date(
            new Date().getTime() + 600 * 1000,
          )
          const user = new User(
            username,
            result.data.login.accessToken,
            accessTokenExpiration,
          )
          this.user.next(user)
          this.autoLogout(600 * 1000)
          localStorage.setItem('token', result.data.login.accessToken)
          localStorage.setItem('userData', JSON.stringify(user))
        }),
      )
  }

  isAuth(userData: any) {
    if (!userData) {
      return
    }

    const loadedUser = new User(
      userData.username,
      userData._accessToken,
      new Date(userData._accessTokenExpiration),
    ) 

    return loadedUser
  }

  autoLogin() {
    const userData: {
      username: string
      _accessToken: string
      _accessTokenExpiration: string
    } = JSON.parse(localStorage.getItem('userData'))

    const loadedUser = this.isAuth(userData)
    if (loadedUser.token) {
      this.user.next(loadedUser)
      const expirationDuration =
        new Date(userData._accessTokenExpiration).getTime() -
        new Date().getTime()
      this.autoLogout(expirationDuration)
    }
  }

  logout() {
    this.user.next(null)
    this.router.navigate(['./qualiexplore/auth']).then(() => {
      window.location.reload()
    })
    localStorage.removeItem('userData')
    localStorage.removeItem('token')
    sessionStorage.clear()  ///added for another session
    if (this.tokenExpirationTimer) {
      clearTimeout(this.tokenExpirationTimer)
    }
  }

  autoLogout(expirationDuration: number) {
    this.tokenExpirationTimer = setTimeout(() => {
      this.logout()
    }, expirationDuration)
  }

}
