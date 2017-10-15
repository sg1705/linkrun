import { NgModule } from '@angular/core';

import {MdInputModule} from '@angular/material';
import {MdToolbarModule} from '@angular/material';
import {MdButtonModule} from '@angular/material';
import {MdListModule} from '@angular/material';
import {MdGridListModule} from '@angular/material';
import {MdTabsModule} from '@angular/material';
import {MdTableModule} from '@angular/material';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
import { MatSlideToggleModule } from '@angular/material';
import {MdButton} from '@angular/material';
import { MdIconModule } from '@angular/material';
import { MatMenuModule, MatTableModule, MatDialogModule } from '@angular/material';
import {MdDialog, MdDialogRef} from '@angular/material';
<<<<<<< HEAD
import {CdkTableModule} from '@angular/cdk/table';
=======
import { CdkTableModule } from '@angular/cdk/table';
>>>>>>> origin/master

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
<<<<<<< HEAD
    CdkTableModule,
    MdTableModule
=======
    MatMenuModule,
    CdkTableModule,
    MatTableModule,
    MatDialogModule,
    MatSlideToggleModule
>>>>>>> origin/master
  ],
  exports: [
    BrowserAnimationsModule,
    MdInputModule,
    MdToolbarModule,
    MdButtonModule,
    MdListModule,
    MdGridListModule,
    MdTabsModule,
<<<<<<< HEAD
    CdkTableModule,
    MdTableModule
=======
    MatMenuModule,
    CdkTableModule,
    MatTableModule,
    MatDialogModule,
    MatSlideToggleModule
>>>>>>> origin/master
  ]
})
export class MaterialModule { }
