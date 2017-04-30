import { Injectable } from '@angular/core';
import { Http, Response } from '@angular/http';
import { Link } from '../model/link';

@Injectable()
export class LinkService {
  private apiUrl: string = '/__/api/linksv2';

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
            var link = new Link(entity['id'], entity['gourl'], entity['url'], entity['description']);
            links.push(link);
          }
          return links;
        })
  }

  createLink(link:Link): Promise<Link> {
    return this.http.post(this.apiUrl+'/create', {
      'link': link.link,
      'url': link.url,
      'description': link.description
    }).toPromise().then(res => {
      console.log(res);
      return null;
    })

  }
}

export class LinkServiceSpy {
  testLink = new Link(5715921523965952, 'google', 'http://www.google.com', 'description');
  getLinks = jasmine.createSpy('getLinks').and.callFake(
    () => Promise
      .resolve(true)
      .then(() => Object.assign({}, this.testLink))
  );
}