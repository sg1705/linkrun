import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { HttpClientModule } from '@angular/common/http';
import { ReactiveFormsModule } from '@angular/forms';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';

import { MaterialModule } from './material/material.module';
import { LoginComponent } from './login/login.component';
import { LinkListComponent } from './link-list/link-list.component';
import { FormComponent } from './form/form.component';
import { FormConfirmationDialogComponent } from './form/form-confirmation-dialog.component';
import { LinkNameValidator } from './form/link.validator';



@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    LinkListComponent,
    FormComponent,
    FormConfirmationDialogComponent,
    LinkNameValidator
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    ReactiveFormsModule,
    MaterialModule
  ],
  entryComponents: [
    FormConfirmationDialogComponent,
  ],  
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
