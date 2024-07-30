import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { HttpService } from './http.service';

@Injectable({
    providedIn: 'root'
})
export class AuthService {
    currentRoute = 'main/dashboard';

    constructor(private router: Router, private httpService: HttpService) {

    }

    async isAuthenticated(): Promise<boolean> {
        if (localStorage.getItem('token') && localStorage.getItem('refresh_token') && localStorage.getItem('username')) {
            try {
                const res = await this.httpService.checkToken();
                return true;
            } catch (error) {
                return false;
            }
        }
        return false;

    }

    async login1(username: string, password: string): Promise<boolean> {
        const res = await this.httpService.login(username, password);
        if (res) {
            this.router.navigate([this.currentRoute]);
            return true;
        }
        else {
            return false;
        }
    }

    async login(username: string, password: string) {
        try {
            const res = await this.httpService.login(username, password);
            //console.log(res)
            if (res && res.Access.Token) {
                localStorage.setItem('token', res.Access.Token);
                localStorage.setItem('refresh_token', res.Access.Token);
                localStorage.setItem('username', username);
                //console.log(res.Access.Pages);
                let pageGroup = {
                    pages:[]
                };
                res.Access.Pages.forEach(item => {
                    //console.log(item)
                    let key = Object.keys(item);
                    if(item[key[0]]){
                        pageGroup.pages.push(key[0].toLocaleLowerCase());
                    }
                    
                });
                localStorage.setItem('pages', JSON.stringify(pageGroup));
            }
        } catch (err) {
            throw err;
        }
    }

    refreshToken(): Observable<any> {
        const refreshToken = localStorage.getItem('refresh_token');
        return this.httpService.refreshToken(refreshToken).pipe(
            map(res => {
                if (res && res.access_token && res.refresh_token) {
                    localStorage.setItem('token', res.access_token);
                    localStorage.setItem('refresh_token', res.refresh_token);
                }
                return res;
            })
        );
    }

    async checkToken(): Promise<boolean> {
        try {
            const res = await this.httpService.checkToken();
            if (res) {
                return true;
            }
            else {
                return false;
            }
        }
        catch (err) {
            return false;
        }
    }

    private removeUserInfo() {
        localStorage.removeItem('token');
        localStorage.removeItem('location');
        // localStorage.removeItem('password');
    }

    logout() {
        //this.removeUserInfo();
        this.router.navigate(['login']);
    }
}
