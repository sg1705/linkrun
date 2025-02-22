import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { HttpModule } from '@angular/http';
import { RouterModule }   from '@angular/router';
import { ClipboardModule } from 'ngx-clipboard';
import { AppComponent } from './app.component';
import { LoginComponent } from './login/login.component';
import { FormComponent } from './form/form.component';
import { MaterialModule } from './material/material.module';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { FormConfirmationDialogComponent } from './form/form-confirmation-dialog.component';
import { LinkListComponent } from './link-list/link-list.component';
import { LinkNameValidator } from './form/link.validator';
import { UserService } from './services/user.service';
import { HelperService } from './services/helper.service';
import { GoogleAnalyticsEventsService } from "./services/google-analytics-events.service";

@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    FormComponent,
    LinkListComponent,
    LinkNameValidator,
    FormConfirmationDialogComponent
  ],
  imports: [
    BrowserModule,
    ReactiveFormsModule,
    HttpModule,
    MaterialModule,
    BrowserAnimationsModule,
    ClipboardModule,
    RouterModule.forRoot([  
      { path: 'login', component: LoginComponent },
      { path: 'link/create',component: FormComponent },
      { path: 'link/edit/:id',component: FormComponent },
      // { path: 'links', component: LinkListComponent },
      { path: '',  redirectTo: '/link/create', pathMatch: 'full'}
    ])    
  ],
  entryComponents: [
    FormConfirmationDialogComponent,
  ],
  providers: [UserService, GoogleAnalyticsEventsService, HelperService],
  bootstrap: [AppComponent]
})
export class AppModule { }

