import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, CanActivateChild, Router, RouterStateSnapshot } from '@angular/router';
import { Store } from '@ngxs/store';
import { SetUser, UserState } from '../../core/stores/user/user.state';
import { AuthService } from '../../share/services/auth.service';
import { UserStateModel } from './../../core/stores/user/user.model';
import { HttpService } from './../../share/services/http.service';

@Injectable({
    providedIn: 'root'
})
export class AuthGuard implements CanActivate, CanActivateChild  {
    constructor(private authService: AuthService,
        private router: Router,
        private store: Store,
        private httpService: HttpService) { }

    async canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot) {

        // const url: string = state.url;
        const res = await this.checkLogin();
        if (!res) {
            this.router.navigate(['/login']);
        }
        const username = localStorage.getItem('username');
        const pageGroup = JSON.parse(localStorage.getItem('pages'));
        //console.log(pageGroup);
        //const userGroup = await this.httpService.getUserGroup(username);
        const userGroup: UserStateModel = {
            Username: username,
            PageNames: pageGroup.pages,
            GroupNames: [],
        }
        this.store.dispatch(new SetUser(userGroup));
        return res;
    }

    // async canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Promise<boolean> {
    //     if (!localStorage.getItem('token') && !localStorage.getItem('refresh_token')) {
    //       this.router.navigate(['login']);
    //       return false;
    //     }
    //     const check = await this.authService.isAuthenticated();
    //     if (!check) {
    //       this.router.navigate(['login']);
    //       return false;
    //     }
    //     return true;
    //   }

    canActivateChild(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): boolean {
        this.canActivate(route, state);
        const userState: UserStateModel = this.store.selectSnapshot(UserState);
        const pages = userState.PageNames;
        const path = state.url.split('/');
        if (pages && path.length > 0) {
            const pathName = path[path.length - 1];
            const checkPages = pages.filter(x => pathName.replace(' ', '').toLowerCase() === x.replace(' ', '').toLowerCase());
            if (checkPages.length > 0) {
                return true;
            } 
            /*else if(userState.Username == "Chin"){
                return true;
            }*/ 
            else {
                return false;
            }
        }
        alert("หาไม่เจอค้าบ พี่ชาย 5555");
        this.router.navigate(['/not-found']);
    }

    async checkLogin() {
        try {
            if (localStorage.getItem('token') && localStorage.getItem('refresh_token') && localStorage.getItem('username')) {
                // const res = await this.authService.checkToken();
                // if (res) {
                //     return true;
                // }
                return true;
            }
            return false;
        }
        catch (ex) {
            return false;
        }
    }
}
