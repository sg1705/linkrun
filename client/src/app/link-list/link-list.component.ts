import { Component, OnInit } from '@angular/core';
import { MdButtonModule } from '@angular/material';
import { DataSource } from '@angular/cdk/collections';
import { MdIcon } from '@angular/material';
import { Link } from '../model/link';
import { LinkService } from '../services/link.service';
import { UserService } from '../services/user.service';
import { User } from '../model/user';
import { Observable } from 'rxjs/Rx';

import 'rxjs/Rx';


@Component({
  selector: 'app-link-list',
  templateUrl: './link-list.component.html',
  styleUrls: ['./link-list.component.css', './link-list.component.scss'],
  providers: [LinkService]
})
export class LinkListComponent implements OnInit {

  user: Observable<User> | null;
  userObject: User;
  dataSource: DataSource<any>;
  displayedColumns = ['link', 'action'];

  constructor(
    private linkService: LinkService,
    private userService: UserService) {
  }

  ngOnInit() {
    this.user = Observable.fromPromise(this.userService.getCurrentUser());
    this.user.subscribe(user => {
      this.dataSource = new LinkDataSource(this.linkService, user);
      this.userObject = user;
      console.log('got user');
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
    this.dataSource = new LinkDataSource(this.linkService, this.userObject);
  }

}

export class LinkDataSource extends DataSource<any> {

  constructor(private linkService: LinkService, private user: User) {
    super();
  }

  connect(): Observable<Link[]> {
    console.log('LinkDataSource#connect')
    return Observable.fromPromise(this.linkService.getLinks().then(links => {
      
      links.forEach(link => {
        link['canEdit'] = (link.userId == this.user.id);
      });
      return links
    }));
  }

  disconnect() {}
}

