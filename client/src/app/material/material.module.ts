import { NgModule } from '@angular/core';

import {MdInputModule} from '@angular/material';
import {MdToolbarModule} from '@angular/material';
import {MdButtonModule} from '@angular/material';
import {MdListModule} from '@angular/material';
import {MdGridListModule} from '@angular/material';
import {MdTabsModule} from '@angular/material';
import {MdTableModule} from '@angular/material';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
import {MdButton} from '@angular/material';
import { MdIconModule } from '@angular/material';
import {MdDialog, MdDialogRef} from '@angular/material';
import {CdkTableModule} from '@angular/cdk/table';

@NgModule({
  imports: [
    BrowserAnimationsModule,
    MdInputModule,
    MdToolbarModule,
    MdButtonModule,
    MdListModule,
    MdGridListModule,
    MdTabsModule,
    MdIconModule,
    CdkTableModule,
    MdTableModule
  ],
  exports: [
    BrowserAnimationsModule,
    MdInputModule,
    MdToolbarModule,
    MdButtonModule,
    MdListModule,
    MdGridListModule,
    MdTabsModule,
    CdkTableModule,
    MdTableModule
  ]
})
export class MaterialModule { }
