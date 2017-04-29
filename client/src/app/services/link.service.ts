import { Injectable } from '@angular/core';
import { Http } from '@angular/http';

import { Link } from '../model/link';

@Injectable()
export class LinkService {

  private apiUrl: string = '/__/api/users';

  constructor(private http: Http) { }

  /**
   * Return all links for the user
   */
  getLinks(): Promise<Array<Link>> {
      return this.http.get(this.apiUrl)
        .toPromise().then(res => {
          var data = res.json();
          var links = new Array<Link>();
          for (var entity of data) {
            var link = new Link(entity['id'], entity['gourl'], entity['url']);
            links.push(link);
          }
          return links;
        })
  }
}
