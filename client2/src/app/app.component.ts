import { Component } from '@angular/core';
import { Router, NavigationEnd } from "@angular/router";

import { UserService } from './services/user.service';
import { User } from './model/user';
import { environment } from '../environments/environment';

import { Observable } from 'rxjs';

// declare ga as a function to set and sent the events
declare let ga: Function;

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {

  user: Observable<User>;

  constructor(
    private userService: UserService,
    public router: Router) {
  }

  ngOnInit() {
    this.user = this.userService.getCurrentUser();
    this.user.subscribe(user => {
      console.debug('logged in user: ', user);
      if (!user.id) {
        window.location.href = '/_/';
      }
      console.log('Environment is production:', environment.production);
    });

    //initialize Google Analytics
    ga('create', environment.ga.GA_TRACKING_ID, 'auto');

    //fire analytics event at every router
    this.router.events.subscribe(event => {
      if (event instanceof NavigationEnd) {
        this.user.subscribe(user => {
          ga('set', 'userId', user.id); // Set the user ID using signed-in user_id.          
          ga('set', 'page', event.urlAfterRedirects);
          ga('send', 'pageview');
        })
      }
    });




  }



}
