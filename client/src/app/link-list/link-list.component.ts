import { Component, OnInit, Renderer } from '@angular/core';
import { MdButtonModule } from '@angular/material';
import { DataSource } from '@angular/cdk/collections';
import { MdIcon } from '@angular/material';
import { MatSnackBar } from '@angular/material';
import { ClipboardService } from 'ngx-clipboard';
import { Link } from '../model/link';
import { LinkService } from '../services/link.service';
import { UserService } from '../services/user.service';
import { HelperService } from '../services/helper.service';
import { User } from '../model/user';
import { Observable } from 'rxjs/Rx';
import * as _ from 'lodash';
import 'rxjs/Rx';

@Component({
  selector: 'app-link-list',
  templateUrl: './link-list.component.html',
  styleUrls: ['./link-list.component.css', './link-list.component.scss'],
  providers: [LinkService]
})
export class LinkListComponent implements OnInit {

  user: Observable<User>;
  userObject: User;
  dataSource: DataSource<any>;
  displayedColumns = ['link', 'url', 'createdby', 'action'];
  users: Array<User>;
  activeIndex: number = -1;

  constructor(
    private linkService: LinkService,
    private userService: UserService,
    private helperService: HelperService,
    private clipboardService: ClipboardService,
    private renderer: Renderer,
    private snackBar: MatSnackBar) {      
  }

  ngOnInit() {
    this.user = this.userService.getCurrentUser();
    this.user.subscribe(user => {
      this.userService.getAllUsers().then(users => {
        this.users = users;        
        this.dataSource = new LinkDataSource(this.linkService, user, this.users);
        this.userObject = user;
      });
    })
  }

  deleteLink(linkId) {
    this.linkService.deleteLink(linkId).then(done => {
      if (done) {
        this.ngOnInit();
      }
    })
  }

  copyLink(link:string) {
    this.clipboardService.copyFromContent(this.helperService.generateFullShortLink(link), this.renderer);
    this.openSnackBar('ShortLink copied');
  }

  copyPublicLink(link:string) {
    this.clipboardService.copyFromContent(this.helperService.generatePublicLink(link, this.userObject), this.renderer);
    this.openSnackBar('Public ShortLink copied');
  }
  
  refreshList() {
    this.dataSource = new LinkDataSource(this.linkService, this.userObject, this.users);
  }

  mouseEnter(index) {
    this.activeIndex = index;
  }

  mouseLeave(index) {
    this.activeIndex = -1;
  }

  openSnackBar(message: string) {
    this.snackBar.open(message, '', {
      duration: 1000
    });
  }


}

export class LinkDataSource extends DataSource<any> {

  constructor(private linkService: LinkService, private user: User, private users:Array<User>) {
    super();
  }

  connect(): Observable<Link[]> {
    console.log('LinkDataSource#connect')
    return Observable.fromPromise(this.linkService.getLinks().then(links => {
      
      links.forEach(link => {
        link['canEdit'] = (link.userId == this.user.id);
        var user = _.find(this.users, function(user) {
            return (user.id == link.userId);
        })
        if (user != null) {
          link['userName'] = user.fName + ' ' + user.lName;
        } else {
          link['userName'] = '';
        }
        
      });
      return links
    }));
  }

  disconnect() {}
}

