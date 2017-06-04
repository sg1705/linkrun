import { Component } from '@angular/core';
import { LoginComponent } from './login/login.component';
import { UserService } from './services/user.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {

  constructor(private userService: UserService) {
    this.userService.getCurrentUser().then(user => {
      console.debug('logged in user', user);
      if (!user.id) {
        window.location.href = '/_/';
      }
      
    })
  }

}

export class Link {
  id:           Number;
  link:         String;
  url:          String;
  description:  String;
}