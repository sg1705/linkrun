import { NgModule } from '@angular/core';

import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
import {MatToolbarModule} from '@angular/material/toolbar';
import {MatMenuModule} from '@angular/material/menu';


@NgModule({
  declarations: [],
  imports: [
    MatToolbarModule,
    MatMenuModule,
    BrowserAnimationsModule
  ],
  exports: [
    MatToolbarModule,
    MatMenuModule,
    BrowserAnimationsModule
  ]
})
export class MaterialModule { }
