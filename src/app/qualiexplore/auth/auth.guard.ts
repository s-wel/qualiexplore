import { Injectable } from '@angular/core'
import { ActivatedRouteSnapshot, Router, RouterStateSnapshot } from '@angular/router'
import { Observable } from 'rxjs'
import { map, tap } from 'rxjs/operators'
import { promise } from 'selenium-webdriver'
import { AuthService } from './auth.service'
import { User } from './user.model'

@Injectable({ providedIn: 'root' })
export class AuthGuard  {
  constructor(private authService: AuthService, private router: Router) {}
  canActivate(
    route: ActivatedRouteSnapshot,
    router: RouterStateSnapshot,
  ): boolean | Promise<boolean> | Observable<boolean> {

    const userData = localStorage.getItem('userData')

    if (this.authService.isAuth(userData)) {
      return true; // Allow access if user is authenticated
    } else {
      this.router.navigate(['./qualiexplore/auth']); // Redirect to login page if not authenticated
      return false;
    }

    // return this.authService.user.pipe(
    //   map((user) => {
    //     console.log(user)
    //     return !!user
    //   }),
    //   tap((isAuth) => {
    //     if (!isAuth) {
    //       this.router.navigate(['./qualiexplore/auth'])
    //     }
    //   }),
    // )
  }
}
