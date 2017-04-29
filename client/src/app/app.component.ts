import { Component } from '@angular/core';
import { UserService } from './services/user.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
  providers: [UserService]
})
export class AppComponent {
  title = 'app works!';

  constructor(private userService: UserService) {
    this.userService.getCurrentUser().then(user => {
      console.debug('logged in user', user);
    })
  }

}

export class Link {
  id:           Number;
  link:         String;
  url:          String;
  description:  String;
}