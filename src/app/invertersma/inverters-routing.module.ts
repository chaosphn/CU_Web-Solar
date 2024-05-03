import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { InvertersComponent } from './inverters.component';

const routes: Routes = [
  {
    path: '',
    component: InvertersComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class InvertersRoutingModule { }
