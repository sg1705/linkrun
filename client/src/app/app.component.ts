import { Component } from '@angular/core';
import { Router, NavigationEnd } from "@angular/router";

import { LoginComponent } from './login/login.component';
import { UserService } from './services/user.service';
import { GoogleAnalyticsEventsService } from "./services/google-analytics-events.service";
import { User } from './model/user';
import { environment } from '../environments/environment';

import 'rxjs/Rx';
import { Observable } from 'rxjs/Rx';


@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {

  user: Observable<User>;

  constructor(
    private userService: UserService,
    public router: Router,
    private googleAnalyticsEventsService: GoogleAnalyticsEventsService) {
  }

  ngOnInit() {
    this.user = this.userService.getCurrentUser();
    this.user.subscribe(user => {
      console.debug('logged in user', user);
      if (!user.id) {
        window.location.href = '/_/';
      }
      console.log('Environment is production:', environment.production);

    })

    ga('create', environment.ga.GA_TRACKING_ID, 'auto');
    this.router.events.subscribe(event => {
      console.log('in router event subscribe')
      if (event instanceof NavigationEnd) {
        this.user.subscribe(user => {
          console.log('NavigationEnd called');
          ga('set', 'userId', user.id); // Set the user ID using signed-in user_id.          
          ga('set', 'page', event.urlAfterRedirects);
          ga('send', 'pageview');
        })
      }
    });
  }

}