import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { Ssm3Component } from './ssm3.component';

const routes: Routes = [
  {
    path: '',
    component: Ssm3Component
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class Ssm3RoutingModule { }
