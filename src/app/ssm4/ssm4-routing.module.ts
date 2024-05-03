import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { Ssm4Component } from './ssm4.component';

const routes: Routes = [
  {
    path: '',
    component: Ssm4Component
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class Ssm4RoutingModule { }
