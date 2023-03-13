import { Injectable } from '@angular/core'
import {
  ActivatedRouteSnapshot,
  CanActivate,
  Router,
  RouterStateSnapshot,
} from '@angular/router'
import { Observable } from 'rxjs'
import { map, tap } from 'rxjs/operators'
import { promise } from 'selenium-webdriver'
import { AuthService } from './auth.service'

@Injectable({ providedIn: 'root' })
export class AuthGuard implements CanActivate {
  constructor(private authService: AuthService, private router: Router) {}
  canActivate(
    route: ActivatedRouteSnapshot,
    router: RouterStateSnapshot,
  ): boolean | Promise<boolean> | Observable<boolean> {

    return this.authService.user.pipe(
      map((user) => {
        console.log(!!user)
        return !!user
      }),
      tap((isAuth) => {
        if (!isAuth) {
          this.router.navigate(['./qualiexplore/auth'])
        }
      }),
    )
  }
}
