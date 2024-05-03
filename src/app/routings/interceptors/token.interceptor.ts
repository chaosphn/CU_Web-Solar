import { HttpEvent, HttpHandler, HttpInterceptor, HttpRequest } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { AuthService } from './../../share/services/auth.service';
import { HttpService } from './../../share/services/http.service';


@Injectable()
export class TokenInterceptor implements HttpInterceptor {
  constructor(private authService: AuthService,
    private httpService: HttpService) {}

  apiNotTransform = [
    'token'
  ];

  intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    if (this.checkAPITransform(request.url)) {
      const authReq = this.addToken(request);
      return next.handle(authReq);
    }
    return next.handle(request);
  }

  private addToken(request: HttpRequest<any>) {
    const token = localStorage.getItem('token');
    if(token){
      const authReq = request.clone({
        headers: request.headers.set('Authorization', token)
      });
      return authReq;
    } else {
      return request;
    }
  }

  private checkAPITransform(url: string): boolean {
    const check = this.apiNotTransform.find(x => url.indexOf(x) >= 0);
    return (check) ? false : true;
  }


}
