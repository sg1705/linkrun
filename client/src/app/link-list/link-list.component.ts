import { Component, OnInit } from '@angular/core';
import {MdButtonModule} from '@angular/material';

import { Link } from '../model/link';
import { LinkService } from '../services/link.service';
import { UserService } from '../services/user.service';
import { User } from '../model/user';


@Component({
  selector: 'app-link-list',
  templateUrl: './link-list.component.html',
  styleUrls: ['./link-list.component.css'],
  providers: [LinkService, UserService]
})
export class LinkListComponent implements OnInit {

  links: Array<Link>;
  user: User;

  constructor(private linkService: LinkService, private userService: UserService) {
   }

  ngOnInit() {
    this.userService.getCurrentUser().then(user => {
      this.user = user;
    }).then(_ => {
      this.linkService.getLinks().then(links => {
        this.links = links;
        links.forEach(link => {
          link['canEdit'] = (link.userId == this.user.id);
        });
      })
    })
    .catch(err => {
      console.log(err);
    })
  }

  deleteLink(linkId) {
    this.linkService.deleteLink(linkId).then(done => {
      if (done) {
        this.ngOnInit();
      }
    })
  }

}
