import { Injectable } from '@angular/core';
import { CanActivate, UrlSegment, Route, ActivatedRouteSnapshot, RouterStateSnapshot, CanLoad, UrlTree, Router } from '@angular/router';
import { AuthService } from '../services/auth/auth.service';

@Injectable({
  providedIn: 'root',
})
export class AuthGuard implements CanActivate, CanLoad {

  constructor(private authService: AuthService,
    private router: Router
    ) {
  }

  async canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Promise<boolean | UrlTree> {
    const validation: boolean = await this.authService.autenticarUsuario();
    if (validation) {
      return validation;
    } else {
      return this.router.navigate(['/login']);
    }
  }

  async canLoad(route: Route, segments: UrlSegment[]): Promise<boolean> {
    const validation: boolean = await this.authService.autenticarUsuario();
    if (validation) {
      return validation;
    } else {
      return this.router.navigate(['/login']);
    }
  }
}
