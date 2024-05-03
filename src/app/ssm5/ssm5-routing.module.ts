import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { Ssm5Component } from './ssm5.component';

const routes: Routes = [
  {
    path: '',
    component: Ssm5Component
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class Ssm5RoutingModule { }
