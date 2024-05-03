import { Component, OnInit, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';

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
  constructor(public dialogRef: MatDialogRef<DialogbreakerComponent>,
    @Inject(MAT_DIALOG_DATA) public data: string) { }

  ngOnInit() {
  }

  login(){
      if(this.username == 'admin' && this.password == '1234'){
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
