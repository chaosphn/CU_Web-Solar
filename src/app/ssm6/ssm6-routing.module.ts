import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { Ssm6Component } from './ssm6.component';

const routes: Routes = [
  {
    path: '',
    component: Ssm6Component
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class Ssm6RoutingModule { }
