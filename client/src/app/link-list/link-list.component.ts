import { Component, OnInit } from '@angular/core';

import { Link } from '../model/link';
import { LinkService } from '../services/link.service';

@Component({
  selector: 'app-link-list',
  templateUrl: './link-list.component.html',
  styleUrls: ['./link-list.component.css'],
  providers: [LinkService]
})
export class LinkListComponent implements OnInit {

  links: Array<Link>

  constructor(private linkService: LinkService) {

   }

  ngOnInit() {
    this.linkService.getLinks().then(links => {
      this.links = links;
    })
    .catch(err => {
      console.log(err);
    })
  }

}
