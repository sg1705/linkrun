import { NgModule } from '@angular/core';

import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
import {MatToolbarModule} from '@angular/material/toolbar';
import {MatMenuModule} from '@angular/material/menu';
import {MatSnackBarModule} from '@angular/material/snack-bar';
import {MatTableModule} from '@angular/material/table';


@NgModule({
  declarations: [],
  imports: [
    MatToolbarModule,
    MatMenuModule,
    MatSnackBarModule,
    MatTableModule,
    BrowserAnimationsModule
  ],
  exports: [
    MatToolbarModule,
    MatMenuModule,
    MatSnackBarModule,
    MatTableModule,
    BrowserAnimationsModule
  ]
})
export class MaterialModule { }
