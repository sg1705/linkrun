import { Component, OnInit, Input } from '@angular/core';
import { MdButtonModule } from '@angular/material';
import { MdIcon } from '@angular/material';
import { Link } from '../model/link';
import { LinkService } from '../services/link.service';
import { UserService } from '../services/user.service';
import { User } from '../model/user';


@Component({
  selector: 'app-link-list',
  templateUrl: './link-list.component.html',
  styleUrls: ['./link-list.component.css'],
  providers: [LinkService],
})
export class LinkListComponent implements OnInit {

  @Input() shortName: string;
  links: Array<Link>;
  user: User;

  constructor(
    private linkService: LinkService,
    private userService: UserService) {
  }

  ngOnInit() {
    this.userService.getCurrentUser().then(user => {
      this.user = user;
    }).then(_ => {
      this.refreshList();
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

  refreshList() {
      return this.linkService.getLinks(this.shortName).then(links => {
        this.links = links;
        links.forEach(link => {
          link['canEdit'] = (link.userId == this.user.id);
        });
      })
  }

}
