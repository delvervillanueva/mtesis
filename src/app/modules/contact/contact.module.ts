import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ContactRoutingModule } from './contact-routing.module';
import { ContactComponent } from './page/contact/contact.component';

import { LayoutModule } from '../../layout/layout.module';
import { ReactiveFormsModule } from '@angular/forms';



@NgModule({
  declarations: [
    /* ContactComponent */
  ],
  imports: [
    CommonModule,
    ContactRoutingModule,
    LayoutModule,
    ReactiveFormsModule
  ],
  exports: [
    /* ContactComponent */

  ]
})
export class ContactModule { }
