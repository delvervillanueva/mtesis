import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

const routes: Routes = [

  {
    path:'',
    loadChildren: () => import('./layout/layout.module').then(m => m.LayoutModule)
  },
  {
    path:'contacto',
    loadChildren: () => import('./modules/contact/contact.module').then(m => m.ContactModule)
  },
  {
    path:'quienes-somos',
    loadChildren: () => import('./modules/about/about.module').then(m => m.AboutModule)
  },
  {
    path:'',
    loadChildren: () => import('./modules/components/components.module').then(m => m.ComponentsModule)
  },
  {
    path: '**',
    redirectTo: '',
    pathMatch: 'full',

  }

];

@NgModule({
  declarations: [],
  imports: [
    RouterModule.forRoot(routes, {
    initialNavigation: 'enabledBlocking'
})
  ],
  exports: [
    RouterModule
  ]

})
export class AppRoutingModule { }

