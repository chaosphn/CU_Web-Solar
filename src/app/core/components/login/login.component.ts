import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../../../share/services/auth.service';
import { AppLoadService } from './../../../share/services/app-load.service';
import { BuildingModel } from '../../stores/sites/sites.model';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {

  username: string = '';
  password: string = '';
  invalid: boolean = false;
  animate: any;
  animateClass: string = '';
  siteSelected: BuildingModel = {
    no: "01",
    id: "ARC003",
    name: "อาคารเลิศ อุรัสยะนันทน์",
    capacity: 113.4,
    zone: "13028863"
  };
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
      await this.authService.login(this.username.trim(), this.password.trim()); 
      //console.log("login success")   
      localStorage.setItem('location', JSON.stringify(this.siteSelected));
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
