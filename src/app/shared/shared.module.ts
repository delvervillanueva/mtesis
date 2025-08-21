import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NavbarScrollyDirective } from './directives/navbar-scrolly.directive';

@NgModule({
  declarations: [
    NavbarScrollyDirective
  ],
  imports: [
    CommonModule
  ],
  exports: [
    NavbarScrollyDirective
  ]
})
export class SharedModule { }
