import { BrowserModule } from "@angular/platform-browser";
import { NgModule } from "@angular/core";
import { HttpClientModule } from "@angular/common/http";
import { ReactiveFormsModule } from "@angular/forms";

import { AppRoutingModule } from "./app-routing.module";
import { MaterialModule } from "./material/material.module";

import { AppComponent } from "./app.component";
import { BrowserAnimationsModule } from "@angular/platform-browser/animations";
import { LoginComponent } from "./login/login.component";
import { LinkListComponent } from "./link-list/link-list.component";
import { FormComponent } from "./form/form.component";
import { FormConfirmationDialogComponent } from "./form/form-confirmation-dialog.component";
import { LinkNameValidator } from "./form/link.validator";

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
    AppRoutingModule,
    BrowserModule,
    BrowserAnimationsModule,
    HttpClientModule,
    ReactiveFormsModule,
    MaterialModule
  ],
  entryComponents: [FormConfirmationDialogComponent],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule {}
