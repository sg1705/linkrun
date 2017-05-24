import { NgModule } from '@angular/core';

import {MdInputModule, MdError} from '@angular/material';
import {MdToolbarModule} from '@angular/material';
import {MdButtonModule} from '@angular/material';
import {MdListModule} from '@angular/material';
import {MdGridListModule} from '@angular/material';
import {MdTabsModule} from '@angular/material';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
import {MdButton} from '@angular/material';
import { MdIconModule } from '@angular/material';

@NgModule({
  imports: [
    BrowserAnimationsModule,
    MdInputModule,
    MdToolbarModule,
    MdButtonModule,
    MdListModule,
    MdGridListModule,
    MdTabsModule,
    MdIconModule
  ],
  exports: [
    BrowserAnimationsModule,
    MdInputModule,
    MdToolbarModule,
    MdButtonModule,
    MdListModule,
    MdGridListModule,
    MdTabsModule,
  ]
})
export class MaterialModule { }
