import { Component, OnInit, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { HttpService } from '../../services/http.service';

@Component({
  selector: 'app-dialogbreaker',
  templateUrl: './dialogbreaker.component.html',
  styleUrls: ['./dialogbreaker.component.scss']
})
export class DialogbreakerComponent implements OnInit {

  username: string = '';
  password: string = '';
  invalid: boolean = false;
  animate: any;
  animateClass: string = '';
  isLogIn: boolean = false;
  isBreaker: boolean = false;
  constructor(public dialogRef: MatDialogRef<DialogbreakerComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private httpService: HttpService,
  ) { }

  ngOnInit() {
  }

  async linkBreaker(){
      const url = 'setbreaker'
      const buildNumber = this.data.no
      const username = localStorage.getItem('username')
      this.isBreaker = !this.isBreaker;
      await this.httpService.getBreaker(url,username,buildNumber)
      
      // console.log("URL :"+url+"   "+"No."+buildNumber+"   "+"User:"+username)
  }

  login(){
      if(this.username == 'admin' && this.password == '1234'){
        localStorage.setItem('username',this.username)
        this.isLogIn = true;
      } else {
        this.invalid = true;
        this.animateClass = 'invalid-animate';
        setTimeout(() =>{
          this.changeClass();
        },1000);
      }
  }

  changeClass() {
    this.animateClass = 'invalid';
  }

  close() {
    this.dialogRef.close();
  }

}
