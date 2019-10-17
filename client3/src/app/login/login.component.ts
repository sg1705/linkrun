import { Component, OnInit } from "@angular/core";
import { UserService } from "../services/user.service";
import { User } from "../model/user";

@Component({
  selector: "app-login",
  templateUrl: "./login.component.html",
  styleUrls: ["./login.component.scss"]
})
export class LoginComponent implements OnInit {
  user: User;
  fName: string;
  lName: string;
  picture: string;

  constructor(private userService: UserService) {
    this.userService.getCurrentUser().subscribe(user => {
      this.user = user;
      this.fName = user.fName;
      this.lName = user.lName;
      if (user.picture == "") {
        this.picture =
          "https://lh3.googleusercontent.com/-XdUIqdMkCWA/AAAAAAAAAAI/AAAAAAAAAAA/4252rscbv5M/photo.jpg";
      } else {
        this.picture = user.picture;
      }
    });
  }

  ngOnInit() {}
}
