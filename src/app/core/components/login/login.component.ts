import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../../../share/services/auth.service';
import { AppLoadService } from './../../../share/services/app-load.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {

  username: string = 'admin';
  password: string = '1234';
  invalid: boolean = false;
  animate: any;
  animateClass: string = '';
  constructor(private authService: AuthService, 
    private appLoadService: AppLoadService,
    private router: Router) { }

  ngOnInit() {
  }

   async login() {
    // const result = await this.authService.login(this.username, this.password);
    // if (!result) {
    //   this.invalid = true;
    // }
    try {
      await this.authService.login(this.username, this.password); 
      //console.log("login success")   
      this.router.navigate([this.appLoadService.defaultRoute]);
    } catch (err) {
      this.invalid = true;
      this.animateClass = 'invalid-animate';
      this.router.navigate(['login']);
      setTimeout(() =>{
        this.changeClass();
      },1000);
    }
  }

  changeClass() {
    this.animateClass = 'invalid';
  }

}
