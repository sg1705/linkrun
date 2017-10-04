import { NgModule } from '@angular/core';

import {MdInputModule} from '@angular/material';
import {MdToolbarModule} from '@angular/material';
import {MdButtonModule} from '@angular/material';
import {MdListModule} from '@angular/material';
import {MdGridListModule} from '@angular/material';
import {MdTabsModule} from '@angular/material';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
import { MatSlideToggleModule } from '@angular/material';
import {MdButton} from '@angular/material';
import { MdIconModule } from '@angular/material';
import { MatMenuModule, MatTableModule, MatDialogModule } from '@angular/material';
import {MdDialog, MdDialogRef} from '@angular/material';
import { CdkTableModule } from '@angular/cdk/table';

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
    MatMenuModule,
    CdkTableModule,
    MatTableModule,
    MatDialogModule,
    MatSlideToggleModule
  ],
  exports: [
    BrowserAnimationsModule,
    MdInputModule,
    MdToolbarModule,
    MdButtonModule,
    MdListModule,
    MdGridListModule,
    MdTabsModule,
    MatMenuModule,
    CdkTableModule,
    MatTableModule,
    MatDialogModule,
    MatSlideToggleModule
  ]
})
export class MaterialModule { }
