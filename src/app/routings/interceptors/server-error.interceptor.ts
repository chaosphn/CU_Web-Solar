import { HttpErrorResponse, HttpHandler, HttpHeaderResponse, HttpInterceptor, HttpProgressEvent, HttpRequest, HttpResponse, HttpSentEvent, HttpUserEvent } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { Observable, throwError as observableThrowError } from 'rxjs';
import { catchError, switchMap } from 'rxjs/operators';
import { AuthService } from './../../share/services/auth.service';

@Injectable({ providedIn: 'root' })
export class ServerErrorsInterceptor implements HttpInterceptor {

    username: string;
    password: string;

    constructor(private authService: AuthService,
        private router: Router) { }

    intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpSentEvent | HttpHeaderResponse | HttpProgressEvent | HttpResponse<any> | HttpUserEvent<any>> {
        // return next.handle(req);
        return next.handle(req).pipe(
            catchError(error => {
                if (error instanceof HttpErrorResponse) {
                    switch ((<HttpErrorResponse>error).status) {
                        case 401:
                            return this.handle401Error(req, next);
                        case 403:
                            //this.router.navigate(['login']);
                            //this.authService.refreshLogin();
                            return this.handle403Error(req, next);
                        default:
                            return observableThrowError(error);
                    }
                } else {
                    return observableThrowError(error);
                }
            }));
    }

    handle401Error(req: HttpRequest<any>, next: HttpHandler) {
        return this.authService.refreshToken().pipe(
            switchMap((newToken: any) => {
                const newReq = this.addToken(req);
                return next.handle(newReq);
            }),
            catchError(error => {
                return this.logoutUser();
            }),
        );
    }

    handle403Error(req: HttpRequest<any>, next: HttpHandler) {
        return this.authService.refreshLogin().pipe(
            switchMap((newToken: any) => {
                //console.log(newToken)
                const newReq = this.addToken(req);
                return next.handle(newReq);
            }),
            catchError(error => {
                return this.logoutUser();
            }),
        );
    }



    private addToken(request: HttpRequest<any>) {
        const tokens = localStorage.getItem('token');
        if(tokens){
          const authReq = request.clone({
            headers: request.headers.set('Authorization', tokens)
          });
          //console.log('return new auth request')
          return authReq;
        } else {
          //console.log('return old request')
          this.logoutUser();
          return request;
        }
    }

    private async refreshToken() {
        try {
            if(this.username && this.password){
                await this.authService.login(this.username, this.password);
            }
        } catch (error) {
            console.log(error);
        }
    }

    logoutUser() {
        // Route to the login page (implementation up to you)
        this.removeUserInfo();
        this.router.navigate(['login']);
        return observableThrowError('');
    }

    private removeUserInfo() {
        localStorage.removeItem('token');
        localStorage.removeItem('refresh_token');
        localStorage.removeItem('username');
        localStorage.removeItem('pages');
    }

    setUserInfomation(user: string, pass: string){
        this.username = user;
        this.password = pass;
    }
}
