import { Component, OnInit, Inject } from '@angular/core';
import {MatDialog, MatDialogRef, MAT_DIALOG_DATA} from '@angular/material';
import { Router } from '@angular/router';

@Component({
  selector: 'app-dialog-site',
  templateUrl: './dialog-site.component.html',
  styleUrls: ['./dialog-site.component.scss']
})
export class DialogSiteComponent implements OnInit {

  constructor(
    public dialogRef: MatDialogRef<DialogSiteComponent>,
    private router: Router,
   ) {}

  ngOnInit() {
    
  }

  onNoClick() {
    this.dialogRef.close();
  }

  close() {
    this.dialogRef.close();
  }


}
