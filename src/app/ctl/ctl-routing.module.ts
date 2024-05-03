import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { CtlComponent } from './ctl.component';

const routes: Routes = [
  {
    path: '',
    component: CtlComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class CtlRoutingModule { }
