import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, Resolve, RouterStateSnapshot } from '@angular/router';
import { Store } from '@ngxs/store';
import { SetUser } from '../../core/stores/user/user.state';
import { HttpService } from '../../share/services/http.service';


@Injectable({
    providedIn: 'root'
})
export class UserResolver implements Resolve<string> {
    constructor(private httpService: HttpService, private store: Store) { }

    async resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Promise<any> {
        const username = localStorage.getItem('username');
        const userGroup = await this.httpService.getUserGroup(username);
        this.store.dispatch(new SetUser(userGroup));
        return userGroup;
    }
}
