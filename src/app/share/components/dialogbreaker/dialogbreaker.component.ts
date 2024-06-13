import { Component, OnInit, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { HttpService } from '../../services/http.service';
import { EventService } from '../../services/event.service';

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
  cbStatus: boolean = false;
  constructor(public dialogRef: MatDialogRef<DialogbreakerComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private httpService: HttpService,
    private event: EventService
  ) { }

  ngOnInit() {
  }

  async linkBreaker(event: any){
      const url = 'setbreaker';
      const buildNumber = this.data.no;
      const username = localStorage.getItem('username');
      const st = confirm('Please make sure before pressed !');
      console.log(st)
      console.log(event)
      if(st){
        this.cbStatus = true;
        this.isBreaker = !this.isBreaker;
        const res = await this.httpService.getBreaker(url,username,buildNumber);
        if(res){
          alert(res);
        }
      } else {
        this.cbStatus = false;
      }
      
      // console.log("URL :"+url+"   "+"No."+buildNumber+"   "+"User:"+username)
  }

  login(){
      if(this.username == localStorage.getItem('username') && this.password == '1234'){
        //localStorage.setItem('username',this.username);
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
    this.updateData();
    this.dialogRef.close();
  }

  updateData(){
    this.event.triggerFunction()
  }

}
