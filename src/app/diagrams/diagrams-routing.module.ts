import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { DiagramsComponent } from './diagrams.component';

const routes: Routes = [
  {
    path: '',
    component: DiagramsComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class DiagramsRoutingModule { }
