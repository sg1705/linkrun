/// <reference path="../../node_modules/@types/google.analytics/index.d.ts" />

import { Component } from '@angular/core';
import { LoginComponent } from './login/login.component';
import { UserService } from './services/user.service';
import { User } from './model/user';
import { Observable } from 'rxjs/Rx';
import 'rxjs/Rx';
import { Router, NavigationEnd } from "@angular/router";
import { GoogleAnalyticsEventsService } from "./services/google-analytics-events.service";

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {

  user: Observable<User>;

  constructor(private userService: UserService, public router: Router, public googleAnalyticsEventsService: GoogleAnalyticsEventsService) {
  }

  ngOnInit() {
    this.user = this.userService.getCurrentUser();
    this.user.subscribe(user => {
      console.debug('logged in user', user);
      if (!user.id) {
        window.location.href = '/_/';
      }  
      ga('create', 'UA-99498648-1', 'auto');
      this.router.events.subscribe(event => {
        if (event instanceof NavigationEnd) {
          ga('set', 'userId', user.id); // Set the user ID using signed-in user_id.          
          ga('set', 'page', event.urlAfterRedirects);
          ga('send', 'pageview');
        }
      });    
    })
   
  }

}