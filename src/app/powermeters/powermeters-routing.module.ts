import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { PowermetersComponent } from './powermeters.component';

const routes: Routes = [
  {
    path: '',
    component: PowermetersComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class PowermetersRoutingModule { }
