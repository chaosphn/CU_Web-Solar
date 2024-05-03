import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ArrayboxesComponent } from './arrayboxes.component';

const routes: Routes = [
  {
    path: '',
    component: ArrayboxesComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ArrayboxesRoutingModule { }
