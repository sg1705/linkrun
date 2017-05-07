import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { HttpModule } from '@angular/http';
import { RouterModule }   from '@angular/router';

import { AppComponent } from './app.component';
import { LoginComponent } from './login/login.component';
import { FormComponent } from './form/form.component';
import { MaterialModule} from './material/material.module';
import { LinkListComponent } from './link-list/link-list.component';

@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    FormComponent,
    LinkListComponent
  ],
  imports: [
    BrowserModule,
    ReactiveFormsModule,
    HttpModule,
    MaterialModule,
    RouterModule.forRoot([  
      { path: 'login', component: LoginComponent },
      { path: 'link/create',component: FormComponent },
      { path: 'link/edit/:id',component: FormComponent },
      { path: 'links', component: LinkListComponent },
      { path: '',  redirectTo: '/links', pathMatch: 'full'}
    ])    
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }

