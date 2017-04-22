import { Component } from '@angular/core';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'app works!';
}

export class Link {
  id:           Number;
  link:         String;
  url:          String;
  description:  String;
}

export class User {
  id:         Number;
  orgId:      Number;
  firstName:  String;
  lastName:   String;
  photoUrl:   String;
  email:      String;

  construction(id, orgId, firstName, lastName, photoUrl, email) {
    this.id = id;
    this.orgId = orgId;
    this.firstName = firstName;
    this.lastName = lastName;
    this.photoUrl = photoUrl;
    this.email = email;
  }
  
}