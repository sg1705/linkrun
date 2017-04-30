import { Injectable } from '@angular/core';
import { Http, Response } from '@angular/http';
import { User } from '../model/user';
import 'rxjs/add/operator/toPromise';

@Injectable()
export class UserService {

  private apiUrl: string = '/__/api/users';
  private currentUser: User;

  constructor(private http: Http) {

  }

  getCurrentUser(): Promise<User> {
    if (this.currentUser == null) {
      //make a network call to get user
      return this.http.get(this.apiUrl)
        .toPromise().then(res => {
          var data = res.json();
          var user = new User(
            data.id,
            data.orgId,
            data.fName,
            data.lName,
            data.picture,
            data.email
          );
          this.currentUser = user;
          return this.currentUser;
        })

    } else {
      return new Promise<User>((resolve, reject) => {
        resolve(this.currentUser);
      });
    }
  }
}

export class UserServiceSpy {
  testUser = new User(
    5715921523965952,
    5704147139559424,
    "Saurabh",
    "Gupta",
    "https://lh5.googleusercontent.com/-EKWz1QcfjGg/AAAAAAAAAAI/AAAAAAAAEdM/rQpQ4Z44pRA/photo.jpg",
    "sg1705@gmail.com",
  )

  getCurrentUser = jasmine.createSpy('getCurrentUser').and.callFake(
    () => Promise
      .resolve(true)
      .then(() => Object.assign({}, this.testUser))
  );
}
