import {CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, Router} from "@angular/router";
import {Observable} from "rxjs";
import {Injectable} from "@angular/core";
import {AuthService} from "./auth.service";

@Injectable()
export class HomeGuard implements CanActivate {

  constructor(private tokenService: AuthService, public router: Router) {
    this.tokenService.loadToken();
  }

  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<boolean> | boolean {
    if(this.tokenService.getToken() != ""){
      return true;
    }
    else {
      this.router.navigate(['/login'])
      return false;
    }
  }
}
