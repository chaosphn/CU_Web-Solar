import { Component, OnInit, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { HttpService } from '../../services/http.service';
import { EventService } from '../../services/event.service';
import { BuildingModel } from 'src/app/core/stores/sites/sites.model';

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
    @Inject(MAT_DIALOG_DATA) public data: BuildingModel,
    private httpService: HttpService,
    private event: EventService
  ) { }

  ngOnInit() {
  }

  async linkBreaker(){
      const url = 'setbreaker';
      const buildNumber = this.data.no;
      const username = localStorage.getItem('username');
      const st = confirm('Please make sure before send trip command !');
      if(st){
        this.cbStatus = true;
        this.isBreaker = !this.isBreaker;
        const res = await this.httpService.getBreaker(url,username,buildNumber);
        if(res){
          alert('Send command ' + res);
        }
      } else {
        this.cbStatus = false;
      }
      this.close();
  }

  login(){
      if(this.username == localStorage.getItem('username') && this.password == '1234'){
        this.linkBreaker();
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
