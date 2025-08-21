import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { Casa1Component } from './page/casa1/casa1.component';
import { Casa2Component } from './page/casa2/casa2.component';

const routes: Routes = [
  {
    path: '',
    children:[
      { path: 'casa-lara', component: Casa1Component},
      { path: 'casa-tacshana', component: Casa2Component},
      { path: '**', redirectTo: '' }
    ]
  }

];


@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ComponentsRoutingModule { }
