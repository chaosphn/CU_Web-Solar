import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { Ssm1Component } from './ssm1.component';

const routes: Routes = [
  {
    path: '',
    component: Ssm1Component
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class Ssm1RoutingModule { }
